# Gilad Doron - Online Fitness Coaching Landing Page

A high-converting RTL Hebrew landing page for online fitness and nutrition coaching, designed for Israeli men looking for real results.

## Features

- **Mobile-first design** optimized for Hebrew (RTL)
- **Premium cinematic design** with dark theme and orange accent
- **Lead form integration** via EmailJS
- **Client results carousel** with before/after photos
- **Video testimonials** via Vimeo
- **Accessibility compliant** (WCAG standards)
- **Legal compliance** (Privacy Policy, Terms of Use, Accessibility Statement)

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Embla Carousel** for client results
- **EmailJS** for form submissions
- **Vimeo** for video embeds

## Getting Started

### Prerequisites

- Node.js (v18 or higher)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env.local`:
   ```env
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   VITE_EMAILJS_SERVICE_ID=your_service_id (optional, has default)
   VITE_EMAILJS_TEMPLATE_ID=your_template_id (optional, has default)
   VITE_RECIPIENT_EMAIL=your_email (optional, has default)
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000/Gilad-landing-page/](http://localhost:3000/Gilad-landing-page/) in your browser

## Deployment

**Preferred (CI):** Push to `main` triggers GitHub Actions, which builds with **GitHub Secrets** and deploys to GitHub Pages. No secrets in repo or local deploy needed. In Cursor you can say **"commit and deploy"** and the agent will run `git add`, `git commit`, `git push origin main` for you.

- **New GitHub account?** Add repository secrets (at least `VITE_EMAILJS_PUBLIC_KEY`) and enable Pages from `gh-pages` branch. See **`docs/DEPLOY_FROM_NEW_ACCOUNT.md`** for step-by-step.

**Manual (optional):** From your machine (requires `.env.local` with EmailJS key):
```bash
npm run deploy
```

The site will be available at: `https://yourusername.github.io/Gilad-landing-page/`

## Project Structure

- `App.tsx` - Main React component with all sections
- `index.css` - Global styles and Tailwind configuration
- `public/assets/` - Images, videos, and other assets
- `docs/` - Project documentation (legal, compliance, handover)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Build and deploy to GitHub Pages
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## License

Private project - All rights reserved
