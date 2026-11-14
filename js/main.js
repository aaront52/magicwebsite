/* Aaron Tang Magic — site behaviour (no dependencies) */
(() => {
  "use strict";
  const config = window.SITE_CONFIG || {};
  document.documentElement.classList.remove("no-js");

  /* Mobile navigation ------------------------------------------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  }

  /* Footer year -------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* Booking email (from config) ---------------------------------- */
  document.querySelectorAll("[data-booking-email]").forEach((el) => {
    if (!config.bookingEmail) { el.closest("[data-email-row]")?.remove(); return; }
    el.textContent = config.bookingEmail;
    el.href = `mailto:${config.bookingEmail}`;
  });

  /* Fade-in on scroll -------------------------------------------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* Gallery lightbox --------------------------------------------- */
  const items = [...document.querySelectorAll("[data-lightbox]")];
  if (items.length) {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML = `
      <button class="lightbox__btn lightbox__close" type="button" aria-label="Close">✕</button>
      <button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous photo">←</button>
      <img alt="" />
      <p class="lightbox__caption"></p>
      <button class="lightbox__btn lightbox__next" type="button" aria-label="Next photo">→</button>`;
    document.body.appendChild(box);
    const img = box.querySelector("img");
    const caption = box.querySelector(".lightbox__caption");
    let index = 0;
    let lastFocus = null;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const item = items[index];
      const thumb = item.querySelector("img");
      img.src = item.dataset.full;
      img.alt = thumb ? thumb.alt : "";
      caption.textContent = item.dataset.caption || "";
    };
    const open = (i) => {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
      box.querySelector(".lightbox__close").focus();
    };
    const close = () => {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      lastFocus?.focus();
    };

    items.forEach((item, i) => item.addEventListener("click", () => open(i)));
    box.querySelector(".lightbox__close").addEventListener("click", close);
    box.querySelector(".lightbox__prev").addEventListener("click", () => show(index - 1));
    box.querySelector(".lightbox__next").addEventListener("click", () => show(index + 1));
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
      if (e.key === "Tab") { // keep focus inside the viewer
        const btns = [...box.querySelectorAll("button")];
        const pos = btns.indexOf(document.activeElement);
        e.preventDefault();
        btns[(pos + (e.shiftKey ? -1 : 1) + btns.length) % btns.length].focus();
      }
    });
    // Swipe on touch screens
    let startX = null;
    box.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  /* Instagram posts (from config) -------------------------------- */
  const feed = document.querySelector("[data-instagram-feed]");
  if (feed && Array.isArray(config.instagramPosts) && config.instagramPosts.length) {
    feed.innerHTML = config.instagramPosts.map((url) =>
      `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"><a href="${url}">View this post on Instagram</a></blockquote>`
    ).join("");
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(s);
  }

  /* Booking form -------------------------------------------------- */
  const form = document.getElementById("booking-form");
  if (!form) return;
  const status = form.querySelector(".form-status");
  const submit = form.querySelector('button[type="submit"]');
  const submitLabel = submit.innerHTML;

  const messages = {
    firstName: "Please enter your first name.",
    lastName: "Please enter your last name.",
    email: "Please enter a valid email address, like name@example.com.",
    phone: "Please enter a valid phone number.",
    message: "Please tell Aaron a little about your event (at least 20 characters).",
  };

  const validateField = (input) => {
    const field = input.closest(".field");
    let ok = input.checkValidity();
    if (ok && input.name === "phone" && input.value.trim()) {
      ok = input.value.replace(/\D/g, "").length >= 7;
    }
    field.classList.toggle("has-error", !ok);
    input.setAttribute("aria-invalid", String(!ok));
    const err = field.querySelector(".field__error");
    if (err) err.textContent = ok ? "" : messages[input.name] || "Please check this field.";
    return ok;
  };

  const inputs = [...form.querySelectorAll("input:not(.form__honeypot input), textarea")];
  inputs.forEach((input) => {
    input.addEventListener("blur", () => { if (input.value) validateField(input); });
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("has-error")) validateField(input);
    });
  });

  const setStatus = (type, html) => {
    status.className = `form-status is-${type}`;
    status.innerHTML = html;
    status.focus();
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const results = inputs.map(validateField);
    if (results.includes(false)) {
      inputs[results.indexOf(false)].focus();
      return;
    }
    if (form.querySelector('[name="_honey"]').value) return; // bot

    const fallback = config.bookingEmail
      ? ` You can also email <a href="mailto:${config.bookingEmail}">${config.bookingEmail}</a> directly.`
      : ` You can also reach Aaron on <a href="https://www.instagram.com/aarontangmagic/" target="_blank" rel="noopener">Instagram</a>.`;

    if (!config.formEndpoint) {
      setStatus("error", `The booking form isn't connected yet.${fallback}`);
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    delete data._honey;
    const payload = {
      ...data,
      _subject: `New booking inquiry from ${data.firstName} ${data.lastName}`,
      _replyto: data.email,
      _template: "table",
      _captcha: "false",
    };

    submit.disabled = true;
    submit.textContent = "Sending…";
    try {
      const res = await fetch(config.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body.success === false || body.success === "false") throw new Error(body.message || res.status);
      form.reset();
      inputs.forEach((i) => i.closest(".field").classList.remove("has-error"));
      setStatus("success", `<strong>Thank you, ${data.firstName}!</strong> Your inquiry has been sent. Aaron will get back to you soon.`);
    } catch (err) {
      setStatus("error", `Sorry, your message couldn't be sent right now. Please try again in a moment.${fallback}`);
    } finally {
      submit.disabled = false;
      submit.innerHTML = submitLabel;
    }
  });
})();
