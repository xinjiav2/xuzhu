# Personal Space

A small static portfolio, blog, and notebook. Responsive dark design, an original parametric wireframe canvas, and no runtime framework dependencies.

## Local development

Requires Node.js 18 or newer. No dependency installation required.

```
npm run build
npm run check
npm run dev
```

Open http://127.0.0.1:4173. Run the build again after editing source files, then reload the browser.

## Make it yours

- Edit `build.mjs` to change the introduction, about copy, project metadata, notebook entries, and blog posts. All personal content is explicitly illustrative; replace it before using as your public portfolio.
- Add posts to the `posts` array. Each post automatically gets a real static HTML page, blog listing entry, and reading link.
- Add projects to the `projects` array and replace the included concept demos with your project details and destinations.
- Change the year and footer text in the `shell` function in `build.mjs`.
- Edit `style.css` for colors, spacing, and typography. Google Fonts are optional; system font fallbacks work without them.
- Replace `favicon.svg` to change the site icon.
- `app.js` contains the mobile menu, post filtering/search, focus timer, local scratchpad, and wireframe renderer. Essential pages and reading work without JavaScript.

## GitHub Pages

The repository includes a real root `index.html` and the other static pages, so GitHub Pages displays the website instead of the README without requiring a build workflow.

In **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/ (root)**, and save. The site is live at https://zhengji.tech/ (or https://xinjiav2.github.io/xuzhu/).

After editing source files, run `npm run build:pages` and commit the updated HTML along with your source changes. This refreshes both `dist/` and the root website from the build.

Alternatively, choose **GitHub Actions** as the Pages source to use the included workflow (`.github/workflows/pages.yml`). It builds and validates a fresh site automatically on each push to `main`.

For other hosts, `npm run build` produces `dist/`. `BASE_PATH` configures its URL prefix and `OUTPUT_DIR` configures its output directory.

## Other static hosts

The output directory is `dist/`. Upload it to static hosting. Configure the host to use `404.html` for missing pages, preserving an HTTP 404 status. Directory routes are real files (`about/index.html`, `blogs/making-room/index.html`, etc.). No SPA fallback is required.

The notebook demo stores text only in this browser's localStorage. The focus timer runs locally. No backend, analytics, or contact form is included.

## Design references

The layout draws on Apple's Human Interface Guidelines for clear hierarchy, readable typography, adaptable layouts, and accessible controls: https://developer.apple.com/design/human-interface-guidelines/

The monochrome palette and restrained technical aesthetic were requested as an interpretation of https://x.ai/. This site is independent and uses its own branding and original graphic.
