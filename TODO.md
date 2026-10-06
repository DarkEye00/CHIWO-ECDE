s# TODO before the CHIWO site goes live

Every gap on the site is now filled with a typical default for a Kenyan ECDE centre, so the pages look finished. **The school has not confirmed any of these.** They are no longer highlighted, so this table is the only record of them. Search the project for the text in the middle column (VS Code: Ctrl+Shift+F) to find each one. Replace it with the real detail, or confirm it, and then delete its row.

To leave a new gap, write `<mark class="todo">[…]</mark>`: it shows as pink dashed text (README → Changing text).

## Defaults to confirm with the school

| Detail | Default now on the site | Where | Where the default comes from |
|---|---|---|---|
| Opening hours | `Monday–Friday, 6:30am – 6:00pm` | Footer of all 9 pages, and "Hours" on contact.html | Common hours for Nairobi daycares serving working parents. The timetable has children arriving at 8:00am, so 6:30am reads as early drop-off. Confirm both. |
| Opening hours, machine format | `"openingHours": "Mo-Fr 06:30-18:00"` | JSON-LD block in the `<head>` of index.html | Must match the hours above. |
| Year founded and number of children | `Since 2018` · `more than 80 children` | about.html, Our impact | These came in the school's own text (5 Oct 2026), but they are exactly the defaults invented for the draft on 3 Oct. Check that the school confirmed them and didn't copy them from the draft site. |
| Age ranges | `6 months – 3 years`, `3–4`, `4–5`, `5–6` | programmes.html (Daycare, Playgroup, PP1, PP2) | Kenya's pre-primary entry ages: PP1 at 4, PP2 at 5, Grade 1 at 6. |
| Daily schedule | `8:00am` arrival, `8:30am` lessons, `10:00am` tea break, `10:30am` outdoor play, `12:30pm` lunch, `1:00pm` rest, `2:30pm` afternoon activities, `From 4:00pm` home time | programmes.html, A typical day | A typical Kenyan pre-primary day. Arrival at 8:00am was set by you (3 Oct 2026). |
| Admission documents | Copy of birth certificate or birth notification · clinic card showing immunisations · 2 passport-size photos · copy of parent's or guardian's ID card | admissions.html, What to bring | What Kenyan ECDE centres usually ask for. |
| Daycare fee | `KSh 1,500 a month` | admissions.html, Fees | **Invented.** Set a little above the school fee (KSh 3,000 a term, about KSh 1,000 a month) because daycare days are longer. Parents will act on this, so it must be confirmed. |
| 2027 term dates | Term 1 `4 Jan – 25 Mar`, Term 2 `26 Apr – 16 Jul`, Term 3 `16 Aug – 5 Nov` | admissions.html, Term dates | **Not official.** In June 2026 the Ministry of Education said every term is 12 weeks from 2027, and reports give Monday 4 January 2027 as the first day. As of 3 October 2026 the full 2027 calendar wasn't out, so Terms 2 and 3 follow the usual April and August holidays. Term 1 ends on Thursday 25 March because 26 March is Good Friday. Replace these with the Ministry's dates when they are published. |
| Getting there | `Ask for the SDA Church in Mathare No. 10: we're right behind it. Lost on the way? Call 0717 040 800 and we'll guide you in.` | contact.html, Visit Us | Uses the address from the content file and the main number. |

## School updates of 5 Oct 2026: still to check

The school's story, vision, mission, values, impact, Holiday Programme, safeguarding text, ways to help and social media links are on the site. Two of the WhatsApp messages were cut off, and some short text was added to make the new pages work:

| What | On the site | Where | To do |
|---|---|---|---|
| Values | Love, Safety, Quality, Integrity | about.html, Our values | The message was cut off at "accountable to children, parents and partner…", so it ends "…and partners." Check whether more values came after Integrity. |
| Safeguarding commitments | The first three are the school's. The last three were **written by us**: staff and volunteers understand their duty; children are handed over only to named people; we listen and act quickly on concerns. | safeguarding.html, Our commitment | The message was cut off at "Ensur…". Get the full text from the school, or confirm these. |
| Raising a concern | Talk to the head teacher or call 0717 040 800. Concerns are reported to the authorities when a child may be at risk. If a child is in danger, call Childline Kenya on 116 or the police on 999. | safeguarding.html, Worried about a child? | **Written by us.** Confirm who handles concerns. If the school has a written child protection policy, offer it on request or as a PDF. |
| Support page descriptions | One line under each way to help and each funding priority, e.g. "Child-sized tables, chairs and shelves for our classrooms" | support.html | **Written by us**: the school sent the headings only. Check each line. |
| Donation details | None. Givers are asked to call, WhatsApp or email. | support.html | Add an M-Pesa paybill or bank details only if the school gives them in writing. Check them carefully, because wrong or fake payment details are a common scam. |
| Holiday Programme | `School holidays`. No ages, dates or fees. | programmes.html | Ask which ages it's for, which holidays it runs in, and what it costs. |

## Testimonials (index.html): needed before launch

Four parents' photos are on the home page. Three of the four quotes were written by us, because no words came with the photos.

| Parent | Quote | To do |
|---|---|---|
| Photo in the blue and yellow kitenge dress (`parent-kitenge-dress`) | **Written by us, not by the parent**: "I go to work with peace of mind…" | The parent must read it and agree that it says what they think, or give their own words. Publishing words they didn't say as their testimonial would be a fake review. |
| Photo in the pink top (`parent-pink-top`) | The parent's own words, lightly edited: "Chiwo" → "CHIWO", "interact" → "interacts", "all rounded" → "all-rounded", and commas added. | Check the parent is happy with the edits. |
| Parent holding a baby in a white dress (`parent-with-baby`), sent 6 Oct | **Written by us, not by the parent**: "Leaving my baby with someone else was not easy at first…" | The parent must read it and agree, or give their own words. The credit `CHIWO daycare parent` is a guess from the baby's age. |
| Parent walking a pupil and a toddler past the school (`parent-walking-to-school`), sent 6 Oct | **Written by us, not by the parent**: "CHIWO's fees are fair for families like ours…" | The parent must read it and agree, or give their own words. "My firstborn" is a guess from the photo. |

For both:
- [ ] Get written consent to use their photo and words on the website.
- [ ] Ask whether they'd like a first name and their child's class in the credit (e.g. `Mary, PP1 parent`). Right now three credits say `CHIWO parent` and one says `CHIWO daycare parent`.

## Other things to confirm

| Needed | Where |
|---|---|
| Signed parental consent for every child in the 36 photos now on the site | Before launch. Remove any photo without consent (README → Gallery). |

## Setup

- [ ] **Review the photos.** 36 of the 189 photos in the Google Drive folder are on the site: in the gallery and on each page. Check the descriptions and albums in `data/gallery.json`. Three are left as `Uncategorized` (they show under **All**): `walking-to-school-4414`, `parent-walking-to-school-4316` and `staff-at-school-sign-4442`. There are no graduation photos yet, so the Graduation button stays hidden until some are added.
- [x] **Staff names.** Done 6 Oct 2026. about.html shows Ms Awino S Opondo (Founder & Director), Caroline Atieno (Head Teacher, who also signs the welcome letter) and Jane Achieng (Childcare Assistant), with the details the school sent. The group photo 0W4A4442 in `data/gallery.json` now names Ms Opondo (left) and Caroline Atieno. The team line "almost 40 years of experience" adds up their 7 + 30 + 2 years, so update it if staff join or leave.
- [ ] **Enquiry form.** Create a free form at formspree.io and replace `FORM_ID` in contact.html (`action="https://formspree.io/f/FORM_ID"`). Until then the form sends nothing and offers parents WhatsApp instead. Send yourself a test enquiry afterwards.
- [x] **Map pin.** Done 3 Oct 2026. The map, the "Get directions" button and the JSON-LD in index.html now use the school's pin (`-1.263766, 36.860561`, from https://maps.app.goo.gl/jLDbRua5VWnFhCwP6). After launch, tap **Get directions** on a phone once to check that it routes to the gate.
- [ ] **Domain.** Replace `https://example.com` with the real address in:
  - the `<head>` of every page except 404.html (canonical, `og:url`, `og:image`, `twitter:image`)
  - the JSON-LD in index.html
  - sitemap.xml
  - robots.txt
- [ ] **Phone numbers.** Since 3 Oct 2026 the main number is 0717 040 800. It's listed first everywhere and used by every WhatsApp button and the enquiry form's WhatsApp fallback. 0725 265 345 is listed second, and the third number was removed. Send a test WhatsApp to 0717 040 800 to confirm it arrives.
