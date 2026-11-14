# Aaron Tang Magic

Website for **aarontangmagic.com**: a booking site for Aaron Tang, magician and medical student.

Plain HTML, CSS and JavaScript with no build step. Edit a file, commit, push, and GitHub Pages updates the live site within a minute or two.

## Design
"Midnight theatre": solid navy backgrounds, gray text and icons, no gradients.
Display type is Cormorant Garamond and body type is Manrope (Google Fonts).
Colors, fonts and spacing are set once as variables at the top of `css/styles.css`.

## Files
| File | What it is |
|---|---|
| `index.html` | Home |
| `about.html` | About |
| `gallery.html` | Gallery (with full-screen photo viewer) + Instagram |
| `faq.html` | FAQ: Services & Styles |
| `contact.html` | Booking inquiry form |
| `404.html` | "Page not found" |
| `js/config.js` | **Settings**: booking email, form service, Instagram posts |
| `js/main.js` | Menu, fade-ins, photo viewer, form validation & sending |
| `css/styles.css` | All styles |
| `assets/img/` | Optimized photos |
| `tools/optimize_images.py` | Prepares new photos for the site |
| `CNAME` | Custom domain for GitHub Pages |

## Turn on the booking form
Open `js/config.js` and fill in:
- `bookingEmail`: shown on the Contact page (optional).
- `formEndpoint`: where submissions are sent. Easiest option:
  `https://formsubmit.co/ajax/YOUR-EMAIL`. Submit the form once on the live site, then click the activation link FormSubmit emails you. After that, every inquiry arrives in your inbox.

## Add a gallery photo
1. `python3 tools/optimize_images.py ~/Desktop/photo.jpg assets/img/gallery/05-short-name`
   (needs Pillow: `pip install pillow`). This resizes the photo and removes hidden location data.
2. In `gallery.html`, copy one `<figure class="gallery__item">…</figure>` block, paste it where you want it, and update the file names, alt text and caption.

## Show Instagram posts
Add post links to `instagramPosts` in `js/config.js`, e.g. `"https://www.instagram.com/p/ABC123/"`. They appear under "Follow along" on the Gallery page.

## Domain
GitHub Pages serves this repo at `aarontangmagic.com` (see `CNAME`). The Namecheap DNS points there:
- `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `CNAME` record for `www` → `aaront52.github.io`
