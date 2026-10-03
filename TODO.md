s# TODO before the CHIWO site goes live

Every gap on the site is now filled with a typical default for a Kenyan ECDE centre, so the pages look finished. **The school has not confirmed any of these.** They are no longer highlighted, so this table is the only record of them. Search the project for the text in the middle column (VS Code: Ctrl+Shift+F) to find each one. Replace it with the real detail, or confirm it, and then delete its row.

To leave a new gap, write `<mark class="todo">[…]</mark>`: it shows as pink dashed text (README → Changing text).

## Defaults to confirm with the school

| Detail | Default now on the site | Where | Where the default comes from |
|---|---|---|---|
| Opening hours | `Monday–Friday, 6:30am – 6:00pm` | Footer of all 7 pages, and "Hours" on contact.html | Common hours for Nairobi daycares serving working parents. The timetable has children arriving at 8:00am, so 6:30am reads as early drop-off. Confirm both. |
| Opening hours, machine format | `"openingHours": "Mo-Fr 06:30-18:00"` | JSON-LD block in the `<head>` of index.html | Must match the hours above. |
| Year founded | `2018` | about.html, Our story | **Invented.** Nothing about CHIWO was found online. |
| Short origin story | `a small community effort to care for children from vulnerable families` | about.html, Our story | Taken from the school's painted mission sign ("children from vulnerable families"). The history itself is a guess. |
| Number of children | `more than 80` | about.html, Our story | **Invented.** A cautious figure for a four-class community centre. |
| Head teacher's name | `— Head Teacher, CHIWO` | about.html, Welcome from the head teacher | No name was invented. Add it, e.g. `— Jane Wanjiku, Head Teacher`. |
| Our team | `Our trained ECDE teachers and caregivers teach Kenya's Competency-Based Curriculum (CBC) through songs, stories and play, in English and Kiswahili. They know every child by name.` | about.html, Our team | Pre-primary in Kenya follows the CBC. Confirm the languages used in class. Names and qualifications can be added later. |
| Age ranges | `6 months – 3 years`, `3–4`, `4–5`, `5–6` | programmes.html (Daycare, Playgroup, PP1, PP2) | Kenya's pre-primary entry ages: PP1 at 4, PP2 at 5, Grade 1 at 6. |
| Daily schedule | `8:00am` arrival, `8:30am` lessons, `10:00am` tea break, `10:30am` outdoor play, `12:30pm` lunch, `1:00pm` rest, `2:30pm` afternoon activities, `From 4:00pm` home time | programmes.html, A typical day | A typical Kenyan pre-primary day. Arrival at 8:00am was set by you (3 Oct 2026). |
| Admission documents | Copy of birth certificate or birth notification · clinic card showing immunisations · 2 passport-size photos · copy of parent's or guardian's ID card | admissions.html, What to bring | What Kenyan ECDE centres usually ask for. |
| Daycare fee | `KSh 1,500 a month` | admissions.html, Fees | **Invented.** Set a little above the school fee (KSh 3,000 a term, about KSh 1,000 a month) because daycare days are longer. Parents will act on this, so it must be confirmed. |
| 2027 term dates | Term 1 `4 Jan – 25 Mar`, Term 2 `26 Apr – 16 Jul`, Term 3 `16 Aug – 5 Nov` | admissions.html, Term dates | **Not official.** In June 2026 the Ministry of Education said every term is 12 weeks from 2027, and reports give Monday 4 January 2027 as the first day. As of 3 October 2026 the full 2027 calendar wasn't out, so Terms 2 and 3 follow the usual April and August holidays. Term 1 ends on Thursday 25 March because 26 March is Good Friday. Replace these with the Ministry's dates when they are published. |
| Getting there | `Ask for the SDA Church in Mathare No. 10: we're right behind it. Lost on the way? Call 0717 040 800 and we'll guide you in.` | contact.html, Visit Us | Uses the address from the content file and the main number. |

## Testimonials (index.html): needed before launch

Two parents' photos are on the home page.

| Parent | Quote | To do |
|---|---|---|
| Photo in the blue and yellow kitenge dress (`parent-kitenge-dress`) | **Written by us, not by her**: "I go to work with peace of mind…" | She must read it and agree that it says what she thinks, or give her own words. Publishing words she didn't say as her testimonial would be a fake review. |
| Photo in the pink top (`parent-pink-top`) | Her words, lightly edited: "Chiwo" → "CHIWO", "interact" → "interacts", "all rounded" → "all-rounded", and commas added. | Check she's happy with the edits. |

For both:
- [ ] Get written consent to use their photo and words on the website.
- [ ] Ask whether they'd like a first name and their child's class in the credit (e.g. `Mary, PP1 parent`). Right now the credits say `CHIWO parent` and `CHIWO daycare parent`. "Daycare" is a guess from the second quote.

## Other things to confirm

| Needed | Where |
|---|---|
| Signed parental consent for every child in the 36 photos now on the site | Before launch. Remove any photo without consent (README → Gallery). |
| Which mission statement to use | about.html uses the content file's mission. The painted sign at the school (photo 0W4A3876) says something different: *"To provide access to quality, affordable, and inclusive early childhood education for children from vulnerable families while strengthening community participation in … learning and development"* (partly hidden in the photo). Confirm which one the school wants. |

## Setup

- [ ] **Review the photos.** 36 of the 189 photos in the Google Drive folder are on the site: in the gallery and on each page. Check the descriptions and albums in `data/gallery.json`. Three are left as `Uncategorized` (they show under **All**): `walking-to-school-4414`, `parent-walking-to-school-4316` and `staff-at-school-sign-4442`. There are no graduation photos yet, so the Graduation button stays hidden until some are added.
- [ ] **Staff names (optional).** The "Our team" photo on about.html shows two staff members (photo 0W4A4442). Once you know who they are, add their names and roles to its description in `data/gallery.json` and to the `alt` text on about.html. If one of them is the head teacher, her photo could also go beside the welcome letter.
- [ ] **Enquiry form.** Create a free form at formspree.io and replace `FORM_ID` in contact.html (`action="https://formspree.io/f/FORM_ID"`). Until then the form sends nothing and offers parents WhatsApp instead. Send yourself a test enquiry afterwards.
- [x] **Map pin.** Done 3 Oct 2026. The map, the "Get directions" button and the JSON-LD in index.html now use the school's pin (`-1.263766, 36.860561`, from https://maps.app.goo.gl/jLDbRua5VWnFhCwP6). After launch, tap **Get directions** on a phone once to check that it routes to the gate.
- [ ] **Domain.** Replace `https://example.com` with the real address in:
  - the `<head>` of every page except 404.html (canonical, `og:url`, `og:image`, `twitter:image`)
  - the JSON-LD in index.html
  - sitemap.xml
  - robots.txt
- [ ] **Phone numbers.** Since 3 Oct 2026 the main number is 0717 040 800. It's listed first everywhere and used by every WhatsApp button and the enquiry form's WhatsApp fallback. 0725 265 345 is listed second, and the third number was removed. Send a test WhatsApp to 0717 040 800 to confirm it arrives.
