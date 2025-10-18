## Designer Portfolio

Static, fast, and responsive portfolio website for a designer. Built with vanilla HTML/CSS/JS – easy to host anywhere (GitHub Pages, Netlify, Vercel, S3).

### Features
- Responsive layout with grid-based portfolio cards
- Category filters (All / Branding / UI / Illustration)
- Light/dark theme toggle with localStorage persistence
- Accessible lightbox for previewing images
- Contact section with basic Netlify form support

### Getting Started
1. Open `index.html` in a browser to preview locally.
2. Replace placeholder content:
   - Update name and bio in `index.html`.
   - Swap images: replace files in `assets/` and update `data-lightbox`/`img src`.
   - Adjust colors in `styles/main.css` under `:root`.
3. Optional: deploy to GitHub Pages.

### Deploy to GitHub Pages
1. Commit and push this folder to a repository.
2. In GitHub repo settings → Pages → set Source to `main` branch `/ (root)`.
3. Wait for the site to build; your portfolio will be available at the GitHub Pages URL.

### Customize
- Add more categories by extending filter chips and `data-category` values.
- Duplicate a `.card` in the `#portfolio-grid` for each project.
- Adjust spacing, colors, and typography in `styles/main.css`.

### License
MIT – free to use and adapt.



