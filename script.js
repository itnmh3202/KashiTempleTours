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
