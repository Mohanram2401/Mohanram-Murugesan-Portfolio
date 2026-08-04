# Deploying Aura Portfolio to Vercel

This guide deploys the portfolio (TanStack Start SSR app) to Vercel. Everything in
the app — content, auth, and uploads — uses the **free tiers** of Firebase and
Cloudinary, so no paid plan is required.

---

## 1. What you'll need

| Item | Purpose | Status |
|---|---|---|
| GitHub account | Host the repo so Vercel can deploy it | You already have it |
| Vercel account | Host the site | Create free at vercel.com |
| Firebase project `mohan-profile-beafa` | Auth + Firestore content | Already configured |
| Cloudinary account | Photo & resume uploads (free tier) | Already configured (`f5mafkpl` / `aura_portfolio`) |

> **Before you start**: make sure the code you want to deploy is committed and
> pushed to GitHub. This project is connected to Lovable, so keep the connected
> branch clean and only push working commits.

---

## 2. One-time Firebase setup

These need to be done once per environment (dev/preview/production domains).

### a) Add your Vercel domain to Firebase Auth

Firebase only allows sign-in from "authorized domains". Your Vercel URL is a new
domain, so add it or the admin login won't work:

1. Open the [Firebase Console](https://console.firebase.google.com/) → your
   `mohan-profile-beafa` project.
2. Go to **Authentication → Settings → Authorized domains**.
3. Click **Add domain** and add:
   - `your-app.vercel.app` (replace with your actual Vercel URL)
   - If you use a custom domain, add that too (e.g. `portfolio.example.com`).

### b) Make sure Firestore rules are deployed

The repo contains `firestore.rules` (public read, signed-in write). If they were
never deployed to your Firebase project, content will not be readable:

**Option A — Firebase CLI (recommended):**

```bash
# from the project root
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules
```

**Option B — Console:**

1. Firebase Console → **Firestore Database → Rules**.
2. Paste the contents of `firestore.rules` and click **Publish**.

> No Cloudinary setup is needed here — the unsigned upload preset
> (`aura_portfolio`) already works from the browser.

---

## 3. Create a `vercel.json` (optional but recommended)

Nitro auto-detects Vercel during the build (it sets `VERCEL=1`), but pinning the
preset explicitly removes any ambiguity. Create this file in the project root:

```json
{
  "framework": null,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": ""
}
```

`"outputDirectory": ""` is important — it lets Vercel use Nitro's
`.vercel/output` (Build Output API v3) directly. Do **not** set it to `dist`.

Commit this file to the repo.

---

## 4. Import the project into Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Click **Add New… → Project** and select your Git repository.
3. Vercel will try to detect the framework. Because this is a TanStack Start /
   Nitro SSR app, set these manually under **Build and Output Settings**:

   | Setting | Value |
   |---|---|
   | Framework Preset | **Other** |
   | Build Command | `npm run build` |
   | Install Command | `npm install` |
   | Output Directory | *(leave empty)* |
   | Node.js Version | 20.x or newer (24.x recommended) |

> If you set `vercel.json` in step 3, these fields are pre-filled from it.

---

## 5. Add environment variables

Add these in the Vercel project **Settings → Environment Variables**. Add them
for **Production**, **Preview**, and **Development** so every environment works.

| Variable | Value |
|---|---|
| `VITE_FIREBASE_API_KEY` | `AIzaSyChgsyoRu-nA1-RJtMAZihJw2Gl_XmdHP0` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `mohan-profile-beafa.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `mohan-profile-beafa` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `mohan-profile-beafa.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `683130955395` |
| `VITE_FIREBASE_APP_ID` | `1:683130955395:web:f3e1839219f77f4e57ddb6` |
| `VITE_CLOUDINARY_CLOUD_NAME` | `f5mafkpl` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `aura_portfolio` |
| `NITRO_PRESET` | `vercel` |

> These are the same values as your `.env.local`. The `VITE_FIREBASE_*` values
> are baked into the client bundle, so they are intentionally public (this is
> standard Firebase web config).
>
> `NITRO_PRESET=vercel` is a build-time env var that forces Nitro's Vercel preset
> even if Vercel's auto-detection changes.

---

## 6. Deploy

1. Click **Deploy**. The first build takes a few minutes.
2. When it finishes, Vercel gives you a URL like `https://your-app.vercel.app`.
3. Copy that URL and **add it to Firebase Authorized domains** (step 2a) if you
   haven't already.
4. Test the deployed site:
   - Open the homepage — hero, sections, and nav should render (server-side).
   - Open `/admin`, sign in with your email/password.
   - Upload a profile photo (Profile & Hero → Upload photo).
   - Upload a resume (Resumes → Upload resume) and toggle **Active**.
   - Toggle sections in **Visibility** and confirm the nav updates.

---

## 7. Verifying it's the SSR build

This project is server-rendered (TanStack Start + Nitro). A correct Vercel build
produces:

```
.vercel/output/
├── config.json
├── functions/__server.func/   ← the SSR serverless function
└── static/                    ← client assets, favicon, robots.txt
```

If instead you see `dist/` output or only static files with no server function,
the Framework Preset was detected as a plain Vite SPA — fix the settings in
step 4 and redeploy.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Build fails with `Output directory not found: dist` | Set **Framework Preset: Other** and leave **Output Directory empty** (step 4). |
| 404 / blank page on deep links | Wrong preset — ensure `NITRO_PRESET=vercel` is set and output is `.vercel/output`. |
| Admin login says domain not authorized | Add the Vercel URL to Firebase **Authorized domains** (step 2a). |
| Content empty on the site | Deploy `firestore.rules` (step 2b). |
| Photo/resume upload fails with `invalid preset` | In Cloudinary, the `aura_portfolio` preset must have **Signing mode: Unsigned**. |
| Upload fails with `Cloudinary isn't configured` | The `VITE_CLOUDINARY_*` env vars are missing (step 5). |
| Very large build / function size warning | Normal for this stack. You can ignore it; the app runs fine. |
| Old error "To use Storage, upgrade your pricing plan" | No longer relevant — file uploads use Cloudinary, not Firebase Storage. |

---

## Notes

- **Do not commit** the `.vercel`, `.output`, or `.wrangler` folders — they are
  build artifacts and now covered by `.gitignore`.
- **Env vars change → redeploy.** Vite bakes `VITE_*` variables into the bundle,
  so you must redeploy after changing them.
- **Updates**: push to GitHub and Vercel auto-deploys the connected branch.
- This project is connected to Lovable — avoid force-pushing or rewriting
  published history on the connected branch.
