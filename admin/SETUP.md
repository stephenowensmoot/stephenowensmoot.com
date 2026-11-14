# Activating the website editor

The editor is prepared at `/admin/`, but online login requires a hosted Git repository and OAuth configuration.

## Required one-time setup

1. Create a GitHub account if needed.
2. Create a repository named `stephenowensmoot.com` and add this website to it.
3. Replace `YOUR_GITHUB_USERNAME` in `admin/config.yml` with the repository owner.
4. Connect the GitHub repository to Cloudflare Pages.
5. Deploy a GitHub OAuth proxy as a Cloudflare Worker, following the Decap CMS GitHub backend documentation.
6. Add the Worker URL as `backend.base_url` in `admin/config.yml`.
7. Register the matching GitHub OAuth application and store its client ID and secret in the Worker.

After deployment, visit `https://stephenowensmoot.com/admin/`, select **Login with GitHub**, edit the forms, and select **Publish**. Publishing commits `content/site.json` to GitHub; Cloudflare Pages then redeploys the site automatically.

Do not put OAuth client secrets in this repository. Store them only as encrypted Cloudflare Worker secrets.
