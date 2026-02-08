# Deploy From New GitHub Account

Use this guide when the repo is under a **new GitHub account**. Secrets from the previous account are not transferred—you must add them again in the new repo.

---

## 1. One-time: Create repo and add secrets

### 1.1 Create the repository (if not done)

- On the new GitHub account: **Repositories → New**.
- Name it (e.g. `Gilad-landing-page`; URL will be `https://<username>.github.io/Gilad-landing-page/`).
- Do **not** initialize with README (you already have code).
- Create the repo.

### 1.2 Push your code

```bash
git remote set-url origin https://github.com/<NEW_USERNAME>/<REPO_NAME>.git
git push -u origin main
```

(Use your new username and repo name. If default branch is `master`, use `master`.)

### 1.3 Add GitHub Actions secrets (required for deploy)

Deploy runs via **GitHub Actions** on push to `main`. The workflow needs these **repository secrets** (no secrets in code or in the repo).

**Where to add:** Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

| Secret name | Required | Where to get it | Notes |
|-------------|----------|-----------------|--------|
| `VITE_EMAILJS_PUBLIC_KEY` | **Yes** | [EmailJS Dashboard](https://dashboard.emailjs.com) → Account → API Keys → Public Key | Form won’t work without it. |
| `VITE_EMAILJS_SERVICE_ID` | No | EmailJS → Email Services → Service ID | Default in code: `service_fphe5xu`. Add only if you use another service. |
| `VITE_EMAILJS_TEMPLATE_ID` | No | EmailJS → Email Templates → Template ID | Default in code: `template_8p1hgtg`. Add only if you use another template. |
| `VITE_RECIPIENT_EMAIL` | No | Your email | Default in code: `gilad042@gmail.com`. Add only to override. |
| `GEMINI_API_KEY` | No | — | Referenced in workflow but not used by the app. Can leave unset. |

**Minimum for deploy:** add **`VITE_EMAILJS_PUBLIC_KEY`**; the rest are optional (code has defaults). The app implements these defaults for service ID, template ID, and recipient email, so only the public key is required.

### 1.4 Turn on GitHub Pages

- Repo → **Settings** → **Pages**.
- **Source:** Deploy from a branch.
- **Branch:** `gh-pages` → **/ (root)** → Save.

After the first successful deploy, the site will be at:  
`https://<username>.github.io/Gilad-landing-page/`

---

## 2. “Commit and deploy” (every time)

Deploy is **automatic** when you push to `main`: the workflow builds with GitHub Secrets and deploys to `gh-pages`.

To **commit and deploy**:

1. Stage and commit your changes.
2. Push to `main`:
   ```bash
   git push origin main
   ```
3. GitHub Actions runs the “Deploy to GitHub Pages” workflow. When it finishes, the live site is updated.

You can say **“commit and deploy”** in chat: the assistant will run `git add`, `git commit`, and `git push origin main` for you (see `.cursor/rules/commit-and-deploy.mdc`).

---

## 3. Safety (no secrets in repo)

- **Secrets live only in:** GitHub repo **Settings → Secrets and variables → Actions**.
- **Local:** Use `.env.local` for the EmailJS public key when developing; `.env.local` is gitignored and never committed.
- **CI:** The workflow injects secrets at build time; they are not stored in the repo or in the built site beyond what Vite embeds (e.g. public key in client bundle, which is normal for EmailJS).

---

## 4. EmailJS already in the project

EmailJS is **already integrated** in this project:

- **Code:** `index.html` (CDN script), `App.tsx` (env vars and `window.emailjs.send()`).
- **Config:** `.env.example` and (locally) `.env.local`; CI uses GitHub Secrets.
- **What you must do on the new account:** Create an EmailJS account (or use an existing one), get the **Public Key**, and add it as the **`VITE_EMAILJS_PUBLIC_KEY`** repository secret. Optionally add Service ID / Template ID / Recipient email if you change from defaults.
