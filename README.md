# Kashi Temple Tours

Website for **Kashi Temple Tours** (www.kashitempletours.com), a private guided temple tour in Varanasi with local guide Santosh Kumar.

It's a single static page built with plain HTML, CSS and vanilla JS. There's no build step. The site is also an installable web app (PWA), which is what the Google Play app is built from.

```
index.html              Page markup, SEO meta tags, schema.org JSON-LD
styles.css              Mobile-first styles (saffron / maroon / cream / gold)
script.js               Link placeholders (top of file), nav, FAQ, app setup
manifest.webmanifest    App name, colours and icons (PWA / Google Play)
sw.js                   Service worker: offline support + installability
images/                 Photos (JPG + WebP), icons, CREDITS.md
.well-known/assetlinks.json   Links the Google Play app to this domain
CNAME                   Custom domain for GitHub Pages
.nojekyll               Tells GitHub Pages to serve files as-is (incl. .well-known)
privacy.html            Privacy policy (needed for Google Play)
store/                  Google Play listing text and policy answers
```

## Secrets

This repo is public **and** served as the website, so any committed file can be downloaded by anyone.

- Put passwords and keys in `.env`, which is git-ignored. Copy `.env.example` to create it.
- Local Node scripts can read `.env` with [dotenv](https://www.npmjs.com/package/dotenv) (`npm install` first).
- The website itself runs in visitors' browsers and **cannot** use `.env`. Never put a secret in `index.html` or `script.js`.
- Keep the Google Play signing keystore (`*.keystore`, `*.jks`) out of git and backed up somewhere safe. `.gitignore` already blocks it.

## 1. Fill in your details

Edit the block at the top of `script.js`:

| Constant          | What to put there                                   |
| ----------------- | --------------------------------------------------- |
| `VIATOR_URL`      | Viator listing (set) |
| `GYG_URL`         | GetYourGuide listing (placeholder: currently the GetYourGuide homepage) |
| `TRIPADVISOR_URL` | TripAdvisor page (set) |
| `EMAIL`           | Contact email (currently `hello@kashitempletours.com`; make sure it exists) |
| `MEETING_POINT`   | Meeting point (set: St. Thomas Church, Luxa Rd) |
| `MAP_EMBED_URL`   | Google Maps embed (set to the meeting point) |
| `INSTAGRAM_URL`, `FACEBOOK_URL` | Social profiles. Hidden while empty |

In `index.html`, search for `PLACEHOLDER` to find the guide's languages and bio. If you change the email, update it in the JSON-LD block in `index.html` too.

## 2. Photos

All photos are resized to at most 1600px wide, compressed, and provided as both WebP and JPG. Sources and licenses are listed in [images/CREDITS.md](images/CREDITS.md), which is linked from the footer.

| Stop | File | Status |
| ---- | ---- | ------ |
| Hero | `hero-ghats` | Wikimedia Commons, CC BY-SA 4.0 |
| 1. Kashi Vishwanath | `kashi-vishwanath` | Owner-supplied. Low-res (590px); license to confirm |
| 2. Kal Bhairav | `kal-bhairav` | Owner-supplied. Low-res (657px); license to confirm |
| 3. Vishalakshi | `vishalakshi` | Wikimedia Commons, CC BY-SA 4.0 |
| 4. Varahi Devi | `varahi-devi` | Owner-supplied. Low-res (540px); confirm it's the Varanasi shrine; license to confirm |
| 5. Ganga Aarti | `ganga-aarti` | Owner-supplied. Low-res (631px); license to confirm |
| Guide | `guide.svg` | **Needs real photo** of Santosh |

The best fix is photos taken on your own tours: you own them outright, and they show exactly what guests will see. To replace one, save it under the same name (e.g. `kal-bhairav.jpg`), update the `src` in `index.html`, and create a WebP copy with [Squoosh](https://squoosh.app).

## 3. Preview locally

```bash
npx serve .            # or: python -m http.server 8000
```

## 4. Deploy on GitHub Pages with www.kashitempletours.com

1. Push to `main`, then on GitHub open **Settings → Pages**. Set **Source: Deploy from a branch**, **Branch: `main`**, folder **`/ (root)`**, and click **Save**.
2. At your domain registrar, add these DNS records:
   - `www`: **CNAME** → `itnmh3202.github.io`
   - `@` (apex `kashitempletours.com`): **A** records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. In **Settings → Pages → Custom domain**, confirm `www.kashitempletours.com`. After DNS resolves (minutes to a few hours), tick **Enforce HTTPS**.

The `CNAME` file is already in the repo. Until DNS is set up, `itnmh3202.github.io/KashiTempleTours` will redirect to a domain that doesn't resolve yet, so do step 2 soon after the first push.

## 5. Google Play app

The Play Store app is a **Trusted Web Activity (TWA)**: a lightweight Android wrapper that opens this website full-screen with no browser bar. Updating the website updates the app, with no new Play Store release needed.

What's already done:
- The site is an installable PWA (manifest, icons, service worker, offline support)
- `.well-known/assetlinks.json` is in place with the package name `com.kashitempletours.app`

What you need:
1. A **Google Play Console** developer account (one-time US$25 fee, identity verification). New personal accounts must run a closed test with testers for 14 days before a public release.
2. The site **live on https://www.kashitempletours.com** (step 4).
3. Generate the Android app. The easiest way is [PWABuilder](https://www.pwabuilder.com):
   enter the site URL → **Package for stores → Android**. Use package ID `com.kashitempletours.app`, and **keep the signing key it gives you safe**.
   (Alternative: `npx @bubblewrap/cli init --manifest https://www.kashitempletours.com/manifest.webmanifest`.)
4. Upload the `.aab` file to Play Console. In **Setup → App integrity**, copy the **SHA-256 certificate fingerprint** into `.well-known/assetlinks.json` in place of `REPLACE_WITH_SHA256_FINGERPRINT_FROM_PLAY_CONSOLE`, then push. Without it, the app shows a browser address bar.
5. Complete the store listing: description, screenshots, a 512×512 icon (`images/icon-512.png`), a feature graphic (1024×500), a privacy policy URL, and the content rating questionnaire.
