# Claude Code Prompt — CHIWO ECDE Website

Put `chiwo-website-content.md`, the logo, and your photos/videos in the project folder first (see "Setup" at the bottom), then paste everything between the lines below into Claude Code.

---

Build a static website for **CHIWO Early Childhood Education Initiative**, a low-cost ECDE school (Daycare, Playgroup, PP1, PP2) in Mathare No. 10, Nairobi. The audience is parents, mostly browsing on mid-range Android phones over mobile data.

## Source material
- All page copy is in `content/chiwo-website-content.md`. Use it **verbatim** — do not rewrite, shorten, or invent copy. Where the copy has `[bracketed placeholders]`, keep them visible in the page wrapped in `<mark class="todo">…</mark>` so I can find them, and list every one in `TODO.md`.
- Logo: `assets/brand/logo.png`
- Photos: `assets/raw/photos/` · Videos: `assets/raw/videos/`

## Stack and constraints
- Plain HTML, CSS, and vanilla JavaScript only. No frameworks, no build step, no npm dependencies. It must work by opening the files or dropping the folder onto Netlify / Cloudflare Pages.
- One shared `css/styles.css` and `js/main.js`. Shared header and footer markup is repeated in each HTML file (no JS-injected includes, so it works without a server and stays SEO-friendly).
- Mobile-first, responsive down to 320px wide.
- Fast: target under ~1.5 MB per page on first load. Lazy-load all images below the fold (`loading="lazy"`), set `width`/`height` on images to avoid layout shift.

## Pages
`index.html`, `about.html`, `programmes.html`, `admissions.html`, `gallery.html`, `contact.html`, plus a simple `404.html`. Sections on each page follow the headings in the content file.

## Design
- Warm, friendly, trustworthy — a real community school, not a glossy corporate one.
- Colours from the logo and flyer: deep teal as primary (around `#0B5669`), golden yellow accent (around `#F2B705`), cream/white backgrounds, dark text. Sample the exact values from the logo if possible and define them as CSS custom properties.
- Fonts via Google Fonts: a rounded, friendly heading font (e.g. Baloo 2 or Fredoka) and a highly readable body font (e.g. Nunito), with system-font fallbacks.
- Rounded corners, soft shadows, generous spacing, large tap targets (min 44px).
- Sticky header with logo and nav; hamburger menu on mobile.
- A **floating WhatsApp button** on every page linking to `https://wa.me/254725265345` with a prefilled message: "Hello CHIWO, I'd like to ask about admission for my child."
- All phone numbers are `tel:` links; the email is a `mailto:` link.

## Media handling
- Write a script `tools/optimize-media.sh` (using ImageMagick/cwebp and ffmpeg) that converts `assets/raw/photos/*` into WebP at 1600px and 600px widths into `assets/img/`, and compresses videos to H.264 MP4 (max 720p, ~1.5 Mbps, no audio unless needed) plus a poster JPG into `assets/video/`. Run it if the tools are available; otherwise tell me the command to run.
- Use `<picture>`/`srcset` for responsive images.
- Videos: never autoplay with sound. If you use a hero video, it must be muted, looped, `playsinline`, have a poster image, and fall back to the poster on slow connections or `prefers-reduced-motion`.
- Write meaningful `alt` text for every image.

## Gallery
- Driven by `data/gallery.json` (array of `{ src, thumb, alt, album, type: "image"|"video" }`) rendered by `js/gallery.js`, so I can add photos by editing JSON only.
- Album filter buttons (In the Classroom, Play Time, Meal Time, Special Days, Graduation).
- Tap to open an accessible lightbox (keyboard + swipe, Esc to close, focus trapped).
- Generate the initial `gallery.json` from the optimized media, with album set to `"Uncategorized"` for me to sort.

## Contact page
- Enquiry form with the fields listed in the content file, submitting to Formspree via `action="https://formspree.io/f/FORM_ID"` (leave `FORM_ID` as a placeholder and note it in `TODO.md`). Add a honeypot field for spam and a JS success message without leaving the page.
- Embedded Google Map (iframe) with a placeholder for the embed URL, plus a "Get directions" link.

## SEO and accessibility
- Unique `<title>` and meta description per page; Open Graph and Twitter card tags using the logo or a hero photo.
- JSON-LD `Preschool` / `ChildCare` structured data on the homepage with name, address, phones, email, and opening hours placeholder.
- `sitemap.xml` and `robots.txt` (use `https://example.com` as the domain placeholder).
- Semantic HTML, one `<h1>` per page, skip-to-content link, visible focus states, WCAG AA contrast.
- Favicon set generated from the logo.

## Deliverables
1. The complete site in this structure:
```
/
├── index.html, about.html, programmes.html, admissions.html, gallery.html, contact.html, 404.html
├── css/styles.css
├── js/main.js, js/gallery.js
├── data/gallery.json
├── assets/brand/, assets/img/, assets/video/
├── tools/optimize-media.sh
├── sitemap.xml, robots.txt
├── README.md   (how to update fees, gallery, term dates, and deploy to Netlify/Cloudflare Pages)
└── TODO.md     (every placeholder and missing item)
```
2. Before writing code, show me a short plan: file list, colour palette, fonts, and which photos you'd use for each page's hero. Wait for my OK, then build.
3. When done, run a quick local check (e.g. `python3 -m http.server`) and confirm there are no broken links or missing assets.

---

## Setup (do this before pasting the prompt)

```
chiwo-site/
├── content/chiwo-website-content.md
├── assets/brand/logo.png
├── assets/raw/photos/   ← all photos
└── assets/raw/videos/   ← all videos
```

Open Claude Code in `chiwo-site/` and paste the prompt.
