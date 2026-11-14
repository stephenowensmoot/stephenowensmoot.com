# Stephen Owen Smoot — personal website

A lightweight, responsive personal website for `stephenowensmoot.com`. It uses plain HTML, CSS, and JavaScript, so it can be hosted nearly anywhere without a build step. Editable content is stored in `content/site.json` and can be managed through the prepared `/admin` interface after deployment.

## Preview locally

Open `index.html` directly, or serve the folder locally:

```bash
ruby -run -e httpd . -p 8000 -b 127.0.0.1
```

Then visit `http://localhost:8000`.

## Pages

- `index.html` — homepage, bio, selected work, and current focus
- `cv.html` — printable CV
- `projects.html` — research, publications, and collaborations
- `media.html` — filterable podcasts, interviews, and lectures
- `contact.html` — inquiry information and profile links
- `content/site.json` — all editable website content
- `admin/` — browser-based Decap CMS editor and configuration

## Before publishing

Search the project for placeholder language such as `20XX`, `#`, `placeholder`, and `City, State`. Replace those values with confirmed information.

In particular:

1. Replace the draft biography and professional headline.
2. Add real CV entries and links.
3. Replace project and media samples.
4. Replace `hello@stephenowensmoot.com` once domain email is configured.
5. Replace the `#` profile links with real URLs.
6. Update the “Last updated” line on the homepage.

The CV page’s **Print / Save PDF** button uses the browser print dialog and a dedicated print stylesheet, allowing the live CV to be saved as a PDF without maintaining a second document.

## Website editor

The prepared editor will live at `https://stephenowensmoot.com/admin/`. It edits `content/site.json`, commits the change to GitHub, and triggers a fresh deployment. See `admin/SETUP.md` for the one-time activation steps. The GitHub repository name and OAuth worker URL in `admin/config.yml` must be configured after the repository and hosting accounts exist.
