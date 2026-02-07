# Connect Your Landing Page to a GoDaddy Custom Domain

Your site is already deployed on **GitHub Pages** (e.g. `https://<username>.github.io/Gilad-landing-page/`). This guide walks you through pointing a domain you own at GoDaddy to that same site.

---

## Before You Start — Checklist

- [ ] **Domain purchased** at GoDaddy (e.g. `yourname.com` or `giladfitness.com`).
- [ ] **Site is live on GitHub Pages** and loads correctly at the `*.github.io` URL.
- [ ] **GitHub repo** has Pages enabled (Settings → Pages → branch `gh-pages`, root).
- [ ] **15–60 minutes** for DNS changes to propagate (sometimes up to 48 hours).

You do **not** need to “upload” files to GoDaddy. The site stays on GitHub; you only point the domain to GitHub’s servers via DNS.

---

## Two Ways to Use Your Domain

| Option | Example URL | Ease | Notes |
|--------|-------------|------|--------|
| **www** (subdomain) | `www.yourname.com` | ✅ Easiest | One CNAME record. Recommended. |
| **Apex/root** (no www) | `yourname.com` | Slightly more | Need A records (IPs) or CNAME flattening. |

**Recommendation:** Set up **www** first. You can add the root domain later if you want both.

---

## Part 1: DNS at GoDaddy

You tell GoDaddy: “When someone visits `www.yourname.com`, send them to GitHub Pages.”

### 1.1 Log in to GoDaddy

1. Go to [godaddy.com](https://www.godaddy.com) and sign in.
2. Open **My Products** and find your domain.
3. Click the domain → **DNS** (or **Manage DNS**).

### 1.2 Add a CNAME record (for www)

1. Click **Add** (or **Add Record**).
2. Choose **CNAME**.
3. Fill in:
   - **Name:** `www`  
     (Some panels show a full host like `www.yourname.com`; use `www` or whatever leaves just `www` in the name.)
   - **Value / Points to:**  
     `YOUR_GITHUB_USERNAME.github.io`  
     (e.g. if your GitHub user is `johndoe`, use `johndoe.github.io` — **no** `https://`, **no** path, **no** repo name.)
   - **TTL:** 600 (or default).
4. Save.

### 1.3 (Optional) Root domain — `yourname.com` without www

If you want `yourname.com` (no www) to open your site:

**Option A — A records (GitHub’s IPs)**  
Add **four A records** with these exact values (GitHub’s load balancers):

| Type | Name | Value | TTL |
|------|------|--------|-----|
| A | @ | 185.199.108.153 | 600 |
| A | @ | 185.199.109.153 | 600 |
| A | @ | 185.199.110.153 | 600 |
| A | @ | 185.199.111.153 | 600 |

**Option B — CNAME flattening (ALIAS/ANAME)**  
If GoDaddy supports “ALIAS” or “ANAME” for the root (@), you can point @ to `YOUR_USERNAME.github.io`. Check GoDaddy’s DNS docs for “root CNAME” or “ALIAS”.

---

## Part 2: GitHub Pages — Custom Domain

Tell GitHub: “This repo’s Pages site should respond to my domain.”

### 2.1 Set the custom domain in GitHub

1. Open your repo on GitHub.
2. Go to **Settings** → **Pages**.
3. Under **Custom domain**, type:
   - For www: `www.yourname.com`
   - For root only: `yourname.com`
4. Click **Save**.

### 2.2 Enforce HTTPS (recommended)

After saving, GitHub will show a **Enforce HTTPS** checkbox once it has verified the domain. Check it so visitors always use `https://`.

### 2.3 Wait for DNS

- GitHub may show “DNS check is still in progress” or “Unverified” for a while.
- Propagation usually takes **15–60 minutes**; in rare cases up to 48 hours.
- You can re-save the custom domain or wait; once DNS is correct, GitHub will verify and HTTPS will become available.

---

## Part 3: Redirect root to www (optional, at GoDaddy)

If you use **www** as the canonical URL and want `yourname.com` to redirect to `www.yourname.com`:

1. In GoDaddy, go to your domain → **Manage** → look for **Forwarding** or **Domain Forwarding**.
2. Add a forward: `yourname.com` → `https://www.yourname.com` (301 permanent).
3. This avoids having to set up A records for the root if you only care about www.

---

## Quick Reference

| Step | Where | What to do |
|------|--------|------------|
| 1 | GoDaddy DNS | CNAME: `www` → `USERNAME.github.io` |
| 2 | GitHub → Settings → Pages | Custom domain: `www.yourname.com` → Save |
| 3 | GitHub Pages | After DNS propagates, enable **Enforce HTTPS** |
| 4 | (Optional) GoDaddy | Forward `yourname.com` → `https://www.yourname.com` |

---

## Troubleshooting

- **“Site not found” or wrong page**  
  - Confirm CNAME **Value** is exactly `USERNAME.github.io` (your GitHub username, no repo name, no `https://`).
  - Confirm GitHub Pages source is **gh-pages** branch, root.

- **GitHub says “DNS check is still in progress”**  
  - Wait 15–60 minutes (or up to 48 hours).  
  - Use [whatsmydns.net](https://www.whatsmydns.net) and check that `www.yourname.com` resolves to GitHub (e.g. CNAME to `USERNAME.github.io`).

- **HTTPS not available**  
  - Enable **Enforce HTTPS** only after the custom domain shows as verified in GitHub.  
  - If you use only root domain, ensure A records (or ALIAS) are correct; CNAME for root can delay certificate issuance.

- **Old content or 404**  
  - Hard refresh (Ctrl+F5 / Cmd+Shift+R) or try in incognito.  
  - Confirm the last deploy succeeded (Actions tab) and that you’re on the right branch (gh-pages).

---

## Summary

1. **Before:** Domain at GoDaddy, site live on GitHub Pages.
2. **GoDaddy:** Add CNAME `www` → `USERNAME.github.io`.
3. **GitHub:** Settings → Pages → Custom domain `www.yourname.com` → Save → Enforce HTTPS when offered.
4. **Optional:** Forward root domain to www at GoDaddy.

Your landing page files stay in GitHub; you only connect the domain via DNS and one setting in GitHub Pages.
