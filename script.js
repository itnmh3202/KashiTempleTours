/* ==========================================================================
   Kashi Temple Tours — site script
   ========================================================================== */

/* --------------------------------------------------------------------------
   PLACEHOLDERS — EDIT THESE
   Replace each value below with the real link/detail. Everything on the page
   that uses these values updates automatically. Links left as "" are hidden.
   -------------------------------------------------------------------------- */
const VIATOR_URL      = "https://www.viator.com/tours/Varanasi/Kashi-Temple-Tour/d22015-117685P2";
const GYG_URL         = "https://www.getyourguide.com/";    // PLACEHOLDER: replace with your GetYourGuide listing URL
const TRIPADVISOR_URL = "https://www.tripadvisor.in/Attraction_Review-g297685-d15825967-Reviews-Kashi_Temple_Tours-Varanasi_Varanasi_District_Uttar_Pradesh.html";
const EMAIL           = "hello@kashitempletours.com";       // TODO: confirm this mailbox exists (or use your real email)
const MEETING_POINT   = "St. Thomas Church (Girja Ghar), Luxa Rd, Luxmanpura, Varanasi, Uttar Pradesh 221001";

// Optional extras
const WHATSAPP_NUMBER = "917652059003";                     // Santosh Kumar. Country code + number, digits only
const WHATSAPP_MESSAGE = "Namaste Santosh! I'm interested in the Kashi Temple Tour.";
const PHONE_DISPLAY   = "+91 765 205 9003";
const MAP_EMBED_URL   = "https://maps.google.com/maps?q=" +
  encodeURIComponent("St. Thomas Church, Luxa Rd, Varanasi 221001") + "&z=16&output=embed";
const INSTAGRAM_URL   = "";                                 // TODO (hidden until set)
const FACEBOOK_URL    = "";                                 // TODO (hidden until set)
/* ------------------------------------------------------------------------ */

const LINKS = {
  VIATOR_URL,
  GYG_URL,
  TRIPADVISOR_URL,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  WHATSAPP_URL: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  PHONE_URL: `tel:+${WHATSAPP_NUMBER}`,
  EMAIL_URL: `mailto:${EMAIL}`,
};

const TEXT = { EMAIL, MEETING_POINT, PHONE_DISPLAY };

// Fill links and text from the placeholders above
document.querySelectorAll("[data-link]").forEach((el) => {
  const url = LINKS[el.dataset.link];
  if (url) el.href = url;
  else (el.closest("li") || el).hidden = true;
});
// Hide a footer column if all its links are hidden
document.querySelectorAll(".site-footer ul").forEach((list) => {
  if (![...list.children].some((li) => !li.hidden)) list.parentElement.hidden = true;
});
document.querySelectorAll("[data-text]").forEach((el) => {
  const value = TEXT[el.dataset.text];
  if (value) el.textContent = value;
});

// Map embed, or a placeholder when no URL is set yet
document.querySelectorAll("[data-src-key]").forEach((frame) => {
  const src = { MAP_EMBED_URL }[frame.dataset.srcKey];
  if (src) {
    frame.src = src;
  } else {
    const note = document.createElement("div");
    note.className = "map-placeholder";
    note.textContent = "Google Maps embed goes here. Set MAP_EMBED_URL in script.js.";
    frame.replaceWith(note);
  }
});

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

function setNav(open) {
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
}

toggle.addEventListener("click", () => setNav(toggle.getAttribute("aria-expanded") !== "true"));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) { setNav(false); toggle.focus(); }
});

// Highlight the nav link for the section in view
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => {
        const isActive = a.getAttribute("href") === `#${entry.target.id}`;
        a.classList.toggle("active", isActive);
        if (isActive) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => observer.observe(s));
}

// FAQ accordion: keep only one answer open at a time
const faqItems = document.querySelectorAll(".faq details");
faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (item.open) faqItems.forEach((other) => { if (other !== item) other.open = false; });
  });
});

/* --------------------------------------------------------------------------
   Motion and video. Skipped entirely for visitors who have "reduce motion"
   turned on, so they get the plain, fully visible page.
   -------------------------------------------------------------------------- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const connection = navigator.connection || {};
const savingData = connection.saveData === true || /(^|-)2g$/.test(connection.effectiveType || "");

if (!prefersReducedMotion) {
  document.documentElement.classList.add("motion");
}

// Hero background video (Ganga Aarti loop), with a pause button
(function heroVideo() {
  const slot = document.querySelector(".hero-video-slot");
  if (!slot || prefersReducedMotion || savingData) return;

  const video = document.createElement("video");
  video.className = "hero-video";
  video.muted = true;               // must be muted to autoplay on phones
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("aria-hidden", "true");
  video.preload = "auto";
  video.poster = slot.dataset.poster;
  video.src = slot.dataset.video;
  slot.replaceWith(video);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "hero-video-toggle";
  const pauseIcon = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  const playIcon = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
  let userPaused = false;
  function setButton(paused) {
    button.innerHTML = paused ? playIcon : pauseIcon;
    button.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
  }
  setButton(false);
  button.addEventListener("click", () => {
    userPaused = !video.paused;
    if (userPaused) video.pause(); else video.play().catch(() => {});
    setButton(userPaused);
  });
  document.querySelector(".hero").appendChild(button);

  video.addEventListener("playing", () => video.classList.add("is-playing"), { once: true });
  video.play().catch(() => { button.hidden = true; }); // autoplay blocked: keep the photo

  // Pause while scrolled away from the hero, to save battery
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      if (userPaused) return;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }).observe(video);
  }
})();

// Scroll reveals, timeline progress and counting numbers
(function scrollMotion() {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

  // Things that fade up into view; siblings are staggered slightly
  const groups = [
    "#tour .narrow > *", ".facts li",
    "#itinerary .narrow > *", ".stop",
    ".about-photo", ".about-text > *",
    "#reviews .narrow > *", ".review", "#reviews .btn-row",
    "#faq .narrow > p, #faq .narrow > h2", ".faq details",
    ".contact-info > *", ".map",
  ];
  groups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--delay", `${Math.min(i, 5) * 0.08}s`);
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // Timeline line fills from the first stop to the last as you scroll
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    let ticking = false;
    const update = () => {
      const rect = timeline.getBoundingClientRect();
      const reached = window.innerHeight * 0.6 - rect.top;
      const progress = Math.max(0, Math.min(1, reached / rect.height));
      timeline.style.setProperty("--progress", progress.toFixed(3));
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // Numbers count up when they come into view ("20+ years", "5 sacred stops", "~4.5 hours")
  const counters = [...document.querySelectorAll(".facts strong, .about-stats dd")]
    .filter((el) => /\d/.test(el.textContent) && el.children.length === 0);
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);
      const el = entry.target;
      const original = el.textContent;
      const match = original.match(/(\d+(?:\.\d+)?)/);
      const target = parseFloat(match[1]);
      const decimals = (match[1].split(".")[1] || "").length;
      const start = performance.now();
      const duration = 1200;
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = original.replace(match[1], (target * eased).toFixed(decimals));
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = original;
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => countObserver.observe(el));
})();

// iPhone/iPad: suggest "Add to Home Screen" (iOS has no install prompt of its own)
(function iosInstallHint() {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isInstalled = window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches;
  const KEY = "iosHintDismissed";
  let dismissed = false;
  try { dismissed = localStorage.getItem(KEY) === "1"; } catch (e) {}
  if (!isIOS || isInstalled || dismissed) return;

  setTimeout(() => {
    const hint = document.createElement("div");
    hint.className = "ios-hint";
    hint.setAttribute("role", "dialog");
    hint.setAttribute("aria-label", "Install the Kashi Temple Tours app");
    hint.innerHTML =
      '<img src="images/apple-touch-icon.png" alt="">' +
      '<p><strong>Get the app on your iPhone:</strong> tap ' +
      '<svg class="ios-hint-share" viewBox="0 0 24 24" width="18" height="18" aria-label="Share"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 3v12M8 7l4-4 4 4M6 11H5v10h14V11h-1"/></svg>' +
      ' Share, then <strong>Add to Home Screen</strong>.</p>' +
      '<button type="button" aria-label="Dismiss">×</button>';
    hint.querySelector("button").addEventListener("click", () => {
      hint.remove();
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
    });
    document.body.appendChild(hint);
  }, 4000);
})();

// Offline support + installable app (also required for the Google Play app)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
