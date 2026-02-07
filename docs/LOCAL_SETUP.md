# Local Development Setup

## Required URL

Open **http://localhost:3000/Gilad-landing-page/** in your browser (not http://localhost:3000/). The app uses a base path for GitHub Pages compatibility.

## macOS: If the dev server won't start

If `npm run dev` fails with **"bad interpreter: Operation not permitted"** or you see a **Gatekeeper warning** about a `.node` file (e.g. `rollup.darwin-arm64.node`):

1. **Clear quarantine** (run from project root):
   ```bash
   xattr -cr .
   ```
   If you moved the project, run this again on the new path.

2. **Use the alternative dev script** if `npm run dev` still fails:
   ```bash
   npm run dev:node
   ```
   This starts Vite via Node directly and avoids shebang execution issues.

3. **If a security dialog appears** for a binary (e.g. "Apple could not verify..."):
   - Click **סיום** (Done). Do **not** click "Move to Trash".
   - If macOS shows a message in **System Settings → Privacy & Security**, you can allow the developer there. After running `xattr -cr .`, the dialog often does not reappear.

## Open Cursor from the project folder

To avoid path confusion (e.g. if the project was moved from Downloads to Desktop), open the project folder directly: **File → Open Folder** and select the project directory. Then the integrated terminal and paths in docs will match.
