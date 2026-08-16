# Lead intake worker

This Cloudflare Worker is the private bridge between the public GitHub Pages form and monday.com.

## Required secret

Set `MONDAY_API_TOKEN` as a Worker secret. Never add it to the repository or to a `VITE_*` variable.

```bash
npx wrangler secret put MONDAY_API_TOKEN
npx wrangler deploy
```

After deployment, add the Worker URL to the GitHub repository secret `VITE_LEAD_API_URL`. The existing Pages workflow passes that value to the Vite build.

EmailJS remains active as a fallback, so a temporary CRM outage does not lose the lead.
