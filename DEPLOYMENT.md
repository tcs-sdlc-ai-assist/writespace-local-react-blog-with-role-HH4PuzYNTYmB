# DEPLOYMENT

## Hosting: Vercel

writespace is designed as a static SPA (Single Page Application) using React + Vite. It can be deployed on Vercel with zero backend.

### Steps

1. **Clone the repo**

   ```
   git clone <repo-url>
   cd writespace
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Build for production**

   ```
   npm run build
   ```

4. **Deploy to Vercel**

   - Push your code to GitHub/GitLab.
   - Import the repo in [Vercel Dashboard](https://vercel.com/import).
   - Vercel auto-detects Vite and uses `npm run build`.
   - Output directory: `dist`
   - No backend required.

---

## Environment Variables

- No backend or API keys required for demo.
- All environment variables must be prefixed with `VITE_` for use in the frontend.
- Example:  
  ```
  VITE_CUSTOM_TITLE="writespace"
  ```
- Add custom variables in `.env` or `.env.production` as needed.

---

## Vercel Configuration

- **vercel.json** is included for SPA routing:

  ```
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/" }
    ]
  }
  ```

- This ensures all routes are handled by the SPA.

---

## CI/CD Notes

- Vercel automatically builds and deploys on push to main branch.
- No custom build steps required.
- For preview deployments, use feature branches.

---

## Production Checklist

- Ensure `dist/` is the output directory.
- Remove sensitive data from `.env`.
- Data is stored in browser LocalStorage (no backend).
- To reset demo data, clear browser storage.

---

## Troubleshooting

- If you see a 404 on SPA routes, check `vercel.json` for rewrites.
- If build fails, check Node version (Vercel uses Node 18+).
- For Tailwind issues, ensure `tailwind.config.js` is present and correct.

---

## Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev/guide/static-deploy.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs/installation)
- [React Router SPA Deploy](https://reactrouter.com/en/main/start/deployment)

---

**© {YEAR} writespace. All rights reserved.**