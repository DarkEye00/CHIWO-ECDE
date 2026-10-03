#!/usr/bin/env bash
#
# Optimise CHIWO photos, videos and the logo for the web.
#
#   assets/raw/photos/*   ->  assets/img/<name>-1600.webp, -1000.webp (for photos on pages, viewed on phones) and -600.webp
#   assets/raw/videos/*   ->  assets/video/<name>.mp4 (H.264, max 720p, ~1.5 Mbps) and <name>.jpg (poster)
#   assets/brand/logo.png ->  favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png
#
# New photos and videos are added to data/gallery.json with album "Uncategorized" and a
# placeholder alt text for you to fill in. Existing entries are never changed, and files
# that are already optimised are skipped, so it is safe to run again after adding more.
#
# Needs ImageMagick 7 ("magick") or cwebp for photos, ffmpeg for videos, ImageMagick for favicons.
#
# Usage (from the site folder):
#   bash tools/optimize-media.sh
#   KEEP_AUDIO=1 bash tools/optimize-media.sh     # keep the sound in videos (e.g. songs, speeches)

set -euo pipefail
shopt -s nullglob nocaseglob

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAW_PHOTOS="$ROOT/assets/raw/photos"
RAW_VIDEOS="$ROOT/assets/raw/videos"
IMG_DIR="$ROOT/assets/img"
VIDEO_DIR="$ROOT/assets/video"
BRAND_DIR="$ROOT/assets/brand"
GALLERY_JSON="$ROOT/data/gallery.json"

PHOTO_WIDTHS=(1600 1000 600)
WEBP_QUALITY=78

log()  { printf '%s\n' "$*"; }
warn() { printf 'warning: %s\n' "$*" >&2; }

# ImageMagick 7 is "magick". ImageMagick 6 is "convert", but on Windows "convert" is also a
# built-in disk tool, so only use it when it really is ImageMagick.
IM=""
if command -v magick >/dev/null 2>&1; then
  IM="magick"
elif command -v convert >/dev/null 2>&1; then
  case "$(command -v convert)" in
    *[Ss]ystem32*) ;;
    *) if convert -version 2>/dev/null | grep -q ImageMagick; then IM="convert"; fi ;;
  esac
fi

# "Class Photo 01.JPG" -> "class-photo-01"
slugify() {
  local slug
  slug="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"
  printf '%s' "${slug:-media}"
}

optimise_photos() {
  local files=("$RAW_PHOTOS"/*.{jpg,jpeg,png,webp,heic,heif,tif,tiff})
  if (( ${#files[@]} == 0 )); then
    log "No photos in assets/raw/photos."
    return
  fi
  if [[ -z "$IM" ]] && ! command -v cwebp >/dev/null 2>&1; then
    warn "Photos skipped: install ImageMagick (magick) or cwebp."
    return
  fi
  if [[ -z "$IM" ]]; then
    warn "Using cwebp: it ignores the phone's rotation setting, so check for sideways photos (ImageMagick fixes this)."
  fi

  mkdir -p "$IMG_DIR"
  local src name width out converted
  for src in "${files[@]}"; do
    name="$(slugify "$(basename "${src%.*}")")"
    converted=0
    for width in "${PHOTO_WIDTHS[@]}"; do
      out="$IMG_DIR/$name-$width.webp"
      if [[ "$out" -nt "$src" ]]; then
        continue
      fi
      if [[ -n "$IM" ]]; then
        # -auto-orient applies the phone's rotation; -strip removes GPS location and other metadata.
        if ! "$IM" "$src" -auto-orient -strip -resize "${width}x>" -quality "$WEBP_QUALITY" "$out"; then
          warn "Could not convert $src"
          rm -f "$out"
          continue 2
        fi
      elif ! cwebp -quiet -q "$WEBP_QUALITY" -resize "$width" 0 -metadata none "$src" -o "$out"; then
        warn "Could not convert $src"
        rm -f "$out"
        continue 2
      fi
      converted=1
    done
    if (( converted )); then
      log "photo  $name"
    fi
  done
}

optimise_videos() {
  local files=("$RAW_VIDEOS"/*.{mp4,mov,m4v,3gp,avi,mkv,webm})
  if (( ${#files[@]} == 0 )); then
    log "No videos in assets/raw/videos."
    return
  fi
  if ! command -v ffmpeg >/dev/null 2>&1; then
    warn "Videos skipped: install ffmpeg."
    return
  fi

  mkdir -p "$VIDEO_DIR"
  local audio=(-an)
  if [[ "${KEEP_AUDIO:-0}" == "1" ]]; then
    audio=(-c:a aac -b:a 96k -ac 2)
  fi

  # Shorter side at most 720 px (landscape or portrait), even dimensions for H.264.
  local scale="scale='if(gt(iw,ih),-2,trunc(min(720,iw)/2)*2)':'if(gt(iw,ih),trunc(min(720,ih)/2)*2,-2)'"
  local src name out poster converted
  for src in "${files[@]}"; do
    name="$(slugify "$(basename "${src%.*}")")"
    out="$VIDEO_DIR/$name.mp4"
    poster="$VIDEO_DIR/$name.jpg"
    converted=0
    if [[ ! "$out" -nt "$src" ]]; then
      if ! ffmpeg -hide_banner -loglevel error -y -i "$src" \
          -vf "$scale,format=yuv420p" \
          -c:v libx264 -preset slow -profile:v high -crf 26 -maxrate 1500k -bufsize 3000k \
          -map_metadata -1 "${audio[@]}" -movflags +faststart "$out"; then
        warn "Could not convert $src"
        rm -f "$out"
        continue
      fi
      converted=1
    fi
    if [[ ! "$poster" -nt "$out" ]]; then
      ffmpeg -hide_banner -loglevel error -y -i "$out" -vf "thumbnail=60" -frames:v 1 -q:v 4 "$poster" \
        || warn "Could not make a poster image for $src"
      converted=1
    fi
    if (( converted )); then
      log "video  $name"
    fi
  done
}

make_favicons() {
  local logo="$BRAND_DIR/logo.png"
  if [[ ! -f "$logo" ]]; then
    warn "No assets/brand/logo.png, favicons not updated."
    return
  fi
  if [[ "$ROOT/favicon.ico" -nt "$logo" ]]; then
    return
  fi
  if [[ -z "$IM" ]]; then
    warn "Favicons not updated from the new logo: install ImageMagick."
    return
  fi
  if (( $(wc -c < "$logo") > 150000 )); then
    warn "assets/brand/logo.png is over 150 KB. Every page loads it, so export a smaller PNG (about 256 x 256 px)."
  fi

  "$IM" "$logo" -background none -gravity center -resize 512x512 -extent 512x512 "$BRAND_DIR/icon-512.png"
  "$IM" "$logo" -background none -gravity center -resize 192x192 -extent 192x192 "$BRAND_DIR/icon-192.png"
  "$IM" "$logo" -resize 160x160 -background white -gravity center -extent 180x180 -flatten "$BRAND_DIR/apple-touch-icon.png"
  "$IM" "$logo" -background none -gravity center -resize 256x256 -extent 256x256 -define icon:auto-resize=48,32,16 "$ROOT/favicon.ico"
  log "favicons updated from assets/brand/logo.png"
}

# Alt text is read aloud to blind visitors: replace the placeholder with what the photo shows.
gallery_entry() {
  local what="photo"
  if [[ "$3" == "video" ]]; then what="video"; fi
  printf '{ "src": "%s", "thumb": "%s", "alt": "[Describe this %s]", "album": "Uncategorized", "type": "%s" }' \
    "$1" "$2" "$what" "$3"
}

update_gallery() {
  mkdir -p "$(dirname "$GALLERY_JSON")"
  if [[ ! -s "$GALLERY_JSON" ]]; then
    printf '[]\n' > "$GALLERY_JSON"
  fi

  local existing file name
  local new=()
  existing="$(cat "$GALLERY_JSON")"

  for file in "$IMG_DIR"/*-1600.webp; do
    name="$(basename "$file" -1600.webp)"
    [[ -f "$IMG_DIR/$name-600.webp" ]] || continue
    [[ "$existing" == *"\"assets/img/$name-1600.webp\""* ]] && continue
    new+=("$(gallery_entry "assets/img/$name-1600.webp" "assets/img/$name-600.webp" image)")
  done
  for file in "$VIDEO_DIR"/*.mp4; do
    name="$(basename "$file" .mp4)"
    [[ -f "$VIDEO_DIR/$name.jpg" ]] || continue
    [[ "$existing" == *"\"assets/video/$name.mp4\""* ]] && continue
    new+=("$(gallery_entry "assets/video/$name.mp4" "assets/video/$name.jpg" video)")
  done

  if (( ${#new[@]} == 0 )); then
    log "data/gallery.json is up to date."
    return
  fi
  if [[ "$existing" != *"]"* ]]; then
    warn "data/gallery.json is not a list [ ... ], so it was not changed. Fix it and run again."
    return 1
  fi

  # Drop the closing ] and any trailing whitespace, then append the new entries.
  local body="${existing%]*}"
  body="${body%"${body##*[![:space:]]}"}"
  local separator=","
  [[ "${body: -1}" == "[" ]] && separator=""

  local entry
  {
    printf '%s' "$body"
    for entry in "${new[@]}"; do
      printf '%s\n  %s' "$separator" "$entry"
      separator=","
    done
    printf '\n]\n'
  } > "$GALLERY_JSON.tmp"
  mv "$GALLERY_JSON.tmp" "$GALLERY_JSON"
  log "data/gallery.json: added ${#new[@]} item(s) to \"Uncategorized\". Give each one alt text and an album."
}

optimise_photos
optimise_videos
make_favicons
update_gallery
log "Done."
