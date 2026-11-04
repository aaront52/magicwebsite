/* ==========================================================
   SITE SETTINGS — edit these two lines
   ========================================================== */

// The address booking requests should go to.
const BOOKING_EMAIL = "your-email@example.com";

// Optional: paste a Formspree endpoint (e.g. "https://formspree.io/f/abcdwxyz")
// to have the form send emails directly without opening the visitor's mail app.
// Leave empty ("") to use the mail-app method.
const FORM_ENDPOINT = "";

/* ========================================================== */

// Mobile navigation
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
  });
}

// Fill in any email links on the page
document.querySelectorAll("[data-email]").forEach((el) => {
  el.textContent = BOOKING_EMAIL;
  el.href = `mailto:${BOOKING_EMAIL}`;
});

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// Booking form
const form = document.querySelector("#booking-form");
if (form) {
  const status = form.querySelector(".form-status");
  const showStatus = (msg, ok) => {
    status.textContent = msg;
    status.className = `form-status show ${ok ? "ok" : "err"}`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());

    if (FORM_ENDPOINT) {
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Sending…";
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error();
        form.reset();
        showStatus("Thank you! Your request has been sent. I'll be in touch within 24 hours.", true);
      } catch {
        showStatus(`Something went wrong. Please email me directly at ${BOOKING_EMAIL}.`, false);
      } finally {
        btn.disabled = false;
        btn.textContent = "Send booking request";
      }
      return;
    }

    // Mail-app method: open a pre-filled email
    const subject = `Booking inquiry: ${data.event_type || "Event"}${data.date ? " on " + data.date : ""}`;
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "-"}`,
      `Event type: ${data.event_type}`,
      `Event date: ${data.date || "-"}`,
      `Location: ${data.location || "-"}`,
      `Guests: ${data.guests || "-"}`,
      `Budget: ${data.budget || "-"}`,
      "",
      "Details:",
      data.message || "-",
    ].join("\n");

    window.location.href =
      `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showStatus("Your email app should open with your request filled in — just hit send.", true);
  });
}
