# Aaron Tang Magic — Website

A sleek, modern static website for booking magic performances.

## Pages
- `index.html`: Home (hero, services, booking steps, call to action)
- `about.html`: About me
- `contact.html`: Booking/contact form + FAQ

## Set your email (required)
Open `js/main.js` and change the first setting:

```js
const BOOKING_EMAIL = "your-email@example.com";
```

By default, submitting the form opens the visitor's email app with a pre-filled booking request addressed to you.

### Optional: send emails straight from the form
1. Create a free form at [formspree.io](https://formspree.io) using your email.
2. Copy its endpoint (looks like `https://formspree.io/f/abcdwxyz`).
3. Paste it into `FORM_ENDPOINT` in `js/main.js`.

Then submissions are emailed to you directly, without opening the visitor's mail app.

## Add your photo
Save a photo as `images/aaron.jpg`, then uncomment the `<img>` line inside the `.portrait` block in `about.html`.

## Publish with GitHub Pages
Repo **Settings → Pages → Build and deployment → Deploy from a branch → `main` / root**.
Your site will be live at `https://aaront52.github.io/magicwebsite/`.
