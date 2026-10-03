# CHIWO Early Childhood Education Initiative — website

A static website for CHIWO's daycare and ECDE school in Mathare No. 10, Nairobi. It's plain HTML, CSS and JavaScript, with no build step and nothing to install. It is designed for parents browsing on phones over mobile data (each page is well under 1.5 MB).

Before launch, work through **[TODO.md](TODO.md)**: it lists every default the school must confirm, and every setup step.

```
index.html, about.html, programmes.html, admissions.html, gallery.html, contact.html, 404.html
css/styles.css        all styling; brand colours and fonts are at the top
js/main.js            mobile menu, enquiry form, click-to-load map
js/gallery.js         gallery page (reads data/gallery.json)
data/gallery.json     the list of gallery photos and videos
assets/brand/         logo, favicons, share image
assets/img/           optimised photos, 3 sizes each (made by the script)
assets/video/         optimised videos and poster images (made by the script)
assets/raw/           your original photos and videos (not uploaded to the website)
tools/optimize-media.sh
_headers              security settings read by Netlify and Cloudflare Pages
sitemap.xml, robots.txt, site.webmanifest, favicon.ico
```

## Preview on your computer

You can double-click any `.html` file to open it. Two things only work through a local web server: the **gallery**, and the styling of the **404 page**. From this folder:

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Changing text

Open the page's `.html` file and edit the words between the tags. The header, footer and WhatsApp button are repeated in all 7 pages, so to change something that appears everywhere (a phone number, the hours, a menu label), use **Replace in Files** in VS Code (Ctrl+Shift+H).

Details the school hasn't confirmed yet (founding year, hours, daycare fee, term dates and so on) are filled in with typical defaults for a Kenyan ECDE centre. TODO.md lists each one with its exact text, so search for that text to find it.

To leave a gap for something you don't know yet, write it as `<mark class="todo">[year]</mark>`. It shows as pink dashed text, so it can't be missed. Replace the whole `<mark …>…</mark>` with the real text once you have it.

## Updating fees

In `admissions.html`, find the fees table:

```html
<tr><th scope="row">Term 1</th><td>KSh 3,000</td></tr>
<tr><th scope="row">Term 2</th><td>KSh 3,000</td></tr>
<tr><th scope="row">Term 3</th><td>KSh 2,500</td></tr>
```

Change the amounts. The daycare fee (`KSh 1,500 a month`) is on the line below the table.

## Updating term dates

In `admissions.html`, under `Term dates`, change the year in the table heading and the dates in each row:

```html
<tr><th scope="col">Term</th><th scope="col">2027</th></tr>
...
<tr><th scope="row">Term 1</th><td>4&nbsp;Jan&nbsp;– 25&nbsp;Mar</td></tr>
```

`&nbsp;` is a space that never breaks, so on a narrow phone a date wraps after the dash and not in the middle. Keep it between the day and month, and before the dash. Update the dates at the start of each school year, from the Ministry of Education calendar.

## Gallery

**Only publish photos and videos of children whose parents have signed a consent form.** Never put a child's full name in a file name or description.

The site has 36 photos chosen from the photographer's 189 in the school's Google Drive folder. The originals (about 35 MB each) stay in Drive. `assets/raw/photos/` holds 2000 px copies, which are plenty for the web. The gallery shows 12 photos at a time with a **Show more photos** button, so parents only download what they look at. An album button only appears once that album has photos.

To add more:

1. Copy the photos into `assets/raw/photos/` and videos into `assets/raw/videos/`. Name them after what they show (e.g. `sports-day-race.jpg`), since the name becomes the web file name. Keep videos short (under a minute), because parents watch on mobile data.
2. Run the media script from this folder (in Git Bash on Windows):
   ```
   bash tools/optimize-media.sh
   ```
   It makes web-sized WebP photos in `assets/img/`: 1600, 1000 and 600 px wide. It makes 720p MP4 videos with a poster image in `assets/video/`; these are silent unless you run it as `KEEP_AUDIO=1 bash tools/optimize-media.sh`. It also removes hidden location data from the files, and adds each new item to `data/gallery.json`.
3. Open `data/gallery.json` and, for each new item, fill in `alt` and `album`:
   ```json
   { "src": "assets/img/lunch-time-1600.webp", "thumb": "assets/img/lunch-time-600.webp",
     "alt": "Children eating lunch together at long tables", "album": "Meal Time", "type": "image" }
   ```
   - **alt** is what a blind visitor's phone reads aloud. Describe what's happening in a short sentence.
   - **album** must be exactly one of: `In the Classroom`, `Play Time`, `Meal Time`, `Special Days`, `Graduation`. Items left as `Uncategorized` still show under **All**.
   - The order in the file is the order on the page.
4. To remove a photo, delete its `{ … }` entry (and the comma before or after it) from `gallery.json`. Then delete its three `assets/img/NAME-*.webp` files and its copy in `assets/raw/photos/`, or the script will add it back next time. Some photos are also used on the pages; search the `.html` files for the photo's name first.

The script skips anything it has already done, so you can run it again whenever you add more. Videos never play by themselves; parents tap to play.

### Installing the media tools (one time)

- **Windows:** `winget install --id ImageMagick.ImageMagick` and `winget install --id Gyan.FFmpeg`, then open a new Git Bash window.
- **macOS:** `brew install imagemagick ffmpeg`
- **Linux:** `sudo apt install imagemagick ffmpeg`

## Photos on the pages

Every page has at least one photo, for example beside the page title or on each programme. To swap one, find its `<img>` in the page and change the name in all three file names (`-600`, `-1000` and `-1600`), plus the `alt` text. To add a photo somewhere new, copy this pattern:

```html
<figure class="photo">
  <img src="assets/img/NAME-1600.webp"
       srcset="assets/img/NAME-600.webp 600w, assets/img/NAME-1000.webp 1000w, assets/img/NAME-1600.webp 1600w"
       sizes="(min-width: 60em) 34rem, calc(100vw - 2rem)"
       width="1600" height="1067"
       alt="What the photo shows"
       loading="lazy">
</figure>
```

Phones download the 1000 px version (about 80 KB) rather than the 1600 px one. Set `width` and `height` to the photo's real size so the page doesn't jump while it loads. Remove `loading="lazy"` if the photo is at the very top of the page.

## Testimonials

The parent quotes are on the home page (`index.html`, under `Testimonials`). Each one is a `<li>` holding the quote, the parent's photo and a short credit such as `CHIWO parent`. **Only publish a parent's words and photo with their written OK.** Use their first name only, never a child's name.

- **To change a quote or credit**, edit the text inside `<p>…</p>` or `<span>…</span>`.
- **To add a parent**, copy a whole `<li>…</li>` block. Two quotes sit side by side on wide screens, so a third starts a new row.
- **Photos** are round headshots. Crop the photo square with the face in the middle (any phone's photo editor can do this) and save the original in `assets/raw/testimonials/`. Then make two small WebP copies (the media script doesn't do this, because it's for gallery photos):
  ```
  magick assets/raw/testimonials/NAME.jpg -auto-orient -strip -resize 320x320 -quality 80 assets/img/NAME-320.webp
  magick assets/raw/testimonials/NAME.jpg -auto-orient -strip -resize 160x160 -quality 80 assets/img/NAME-160.webp
  ```
  Then change `NAME` in the block's `src` and `srcset`.

## Logo and share image

- **Logo:** `assets/brand/logo.png` is the CHIWO badge, cut out of `chiwo logo.jpeg` onto a transparent background. It keeps a thin white rim so it stands out on the dark footer. The header and footer of every page use it, and the favicons were made from it. If the school updates its logo, save the new one as `logo.png` (a square PNG with a transparent background, about 256 × 256 px), then run `bash tools/optimize-media.sh` to rebuild the favicons.
- **Share image:** `assets/brand/og-image.jpg` (1200 × 630 px) is the picture shown when the link is shared on WhatsApp or Facebook. It's the class photo in front of the school's sign. To change it, save a new 1200 × 630 JPEG under the same name.

## Enquiry form (Formspree)

1. Sign up at https://formspree.io, create a form, and set it to email the school's address.
2. Copy the form's ID (the part after `/f/` in its endpoint, e.g. `xyzabcde`).
3. In `contact.html`, replace `FORM_ID` in `action="https://formspree.io/f/FORM_ID"`.
4. Send a test enquiry from the live site.

The form checks the parent's name and phone number before sending, shows a thank-you message without leaving the page, and has a hidden spam trap. If sending fails, parents get a button that opens WhatsApp with their message already typed.

## Map

The map on the contact page loads only when a visitor taps **Show map**, which saves mobile data. To point it at the school's exact location:

1. Find the school on Google Maps (drop a pin if it isn't listed).
2. **Share → Embed a map → Copy HTML.** From what you copied, take only the `src="…"` address and paste it into the `<iframe src="…">` inside the `<template>` in `contact.html`.
3. **Share → Copy link**, and paste it as the `href` of the **Get directions** button.

## Going live

Upload only the website files. Leave out `assets/raw/` (large originals), `tools/`, the `.md` files and `.gitignore`.

**Netlify:** go to https://app.netlify.com/drop and drag in a folder containing just the website files. For later updates, drag the folder into the site's **Deploys** page.

**Cloudflare Pages:** in the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Upload assets**, and upload the same folder. Cloudflare serves pages without `.html` (e.g. `/about`); the site's links still work.

Either way, you can also connect a GitHub repository instead of uploading by hand. `.gitignore` already keeps `assets/raw/` out of Git.

The GitHub repo (DarkEye00/CHIWO-ECDE) is public, so `.gitignore` also keeps out the web photos in `assets/img/` and the share image `assets/brand/og-image.jpg`. A deploy straight from GitHub would therefore have no photos. Until every parent has signed a consent form, deploy by uploading the folder from this computer. Once consent is in, either delete those lines from `.gitignore` and commit the photos, or make the repo private first.

After the first deploy:

- add the school's domain in the host's settings, then replace `https://example.com` everywhere (see TODO.md)
- send a test enquiry
- share the link in a WhatsApp chat to check the preview picture

## Security settings (`_headers`)

`_headers` tells browsers to block anything the site doesn't need: other sites' scripts, framing of the site by other sites, and so on. It allows only Google Fonts, Formspree and Google Maps.

- **Adding an outside service** (analytics, a chat widget, a YouTube video): add its domain to the matching line in `_headers`, or browsers will block it. The browser console (F12) names what was blocked.
- **The one-line script in each page's `<head>`** is allowed by its `sha256-…` value. If you change that script, the console error shows the new `sha256-…` value; copy it into `_headers`.

## Brand

Colours and fonts are defined once at the top of `css/styles.css`:

| Colour | Hex | Used for |
|---|---|---|
| Teal (from the logo) | `#0e5a6e` | headings, links, main blocks |
| Deep teal | `#073b48` | footer, painted bands, text on gold |
| Golden yellow (from the logo) | `#fcbd46` | stripes, sun, highlights, form button |
| Green | `#347a28` | WhatsApp buttons, growth, chalkboard |
| Sun cream | `#fff6de` | page headers and soft sections |

Headings use **Baloo 2**. Body text uses **Andika**, a typeface designed by SIL for beginning readers. Both load from Google Fonts.
