# Portfolio site — starter

A static HTML/CSS/JS portfolio for a hybrid game + web developer. No build step, no framework — open `index.html` in a browser or host the folder as-is (GitHub Pages, Netlify, Vercel, etc.).

## Files

- `index.html` — all page structure and mock content
- `style.css` — design tokens (colors, type, spacing) + all styling
- `script.js` — nav toggle, scroll reveal, media preview modal, contact form validation
- `assets/` — put your real images/gifs/videos here

## What to replace

1. **Identity, hook, contact info** — top of `index.html`, inside `<section class="hero">`. Update the headline, hook paragraph, email, location, and GitHub link.
2. **Three projects** — search for `PROJECT 01 / 02 / 03` comments in `index.html`. Each project has:
   - a build tag + status badge (`Shipped` / `In development` — edit the class `status-shipped` / `status-indev`)
   - a meta table (role, stack, platform, timeline)
   - links to itch.io and GitHub
   - four `.media-slot` placeholders — each is a clickable button styled like a dashed placeholder. Replace the button's contents with a real `<img>`, `<video>`, or animated `<img src="....gif">`, and keep the `data-caption` attribute if you want the click-to-preview modal to keep working (or just remove the modal behavior in `script.js` once you're using real media that already opens fine on its own).
   - three case-study blocks: The problem / The decision / The result
3. **Experience** — `<section class="experience">`, one `<li class="timeline-entry">` per role.
4. **Education / certifications / side projects** — `<section class="learning">`, three columns.
5. **Contact form** — the fields already validate on the client (required, email format, min length). It does **not** send email yet. Open `script.js` and read the comment block at the top for three options: Formspree, a `mailto:` fallback, or your own API endpoint.
6. **Footer links / socials** — bottom of `index.html`.

## Design notes

- Palette and type scale live in `:root` at the top of `style.css` — change the CSS custom properties there to re-theme the whole site.
- The "BUILD // 01" tags and console/terminal panel are the site's signature visual motif, tying the game-dev and web-dev sides together (patch notes / changelogs are native to both worlds). Feel free to adjust the wording but keep it if you like the identity.
- Fonts are loaded from Google Fonts via `<link>` tags in `index.html` (Fraunces, IBM Plex Sans, IBM Plex Mono). If you want to self-host fonts instead, download the font files and swap the `<link>` tags for local `@font-face` rules.
- Fully responsive down to small mobile, with a hamburger nav below 720px.
- Respects `prefers-reduced-motion`.
