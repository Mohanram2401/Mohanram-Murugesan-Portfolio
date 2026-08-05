# Deploying Aura Portfolio to Vercel

This guide outlines how to deploy your portfolio (TanStack Start SSR app) to Vercel. Everything in the app — content, auth, and uploads — uses the **free tiers** of Supabase and Cloudinary.

---

## 1. Prerequisites

| Item | Purpose |
|---|---|
| GitHub account | Host your repo for Vercel deployment |
| Vercel account | Host the live website |
| Supabase project | Authenticated Admin + PostgreSQL content database |
| Cloudinary account | Raw resume and profile photo uploads (free tier) |

---

## 2. Supabase Setup for Production

### a) Add your Vercel domain to Supabase Redirect URLs
To ensure authentication redirects work correctly after logging in from your production URL:
1. Open your **Supabase Dashboard** → **Authentication** → **URL Configuration**.
2. Add your Vercel production URL (e.g. `https://your-app.vercel.app`) to the **Redirect URLs** list.

### b) Database Tables & RLS Policies
Ensure you have run the PostgreSQL DDL queries (from the main `README.md`) inside your Supabase **SQL Editor** to create the `contacts`, `resumes`, and `settings` tables, and establish public select / admin write row-level security (RLS) policies.

---

## 3. Configuration Files

### `vercel.json`
The project includes a `vercel.json` file in the root directory that tells Vercel how to compile your TanStack Start server:

```json
{
  "framework": null,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": ""
}
```

* **Note:** `"outputDirectory": ""` is critical. It directs Vercel to use Nitro's `.vercel/output` directory (Build Output API v3) directly. Do **not** change this to `dist` or `.output`.

---

## 4. Import & Setup on Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Click **Import** next to your Git repository.
3. Vercel will auto-detect the configuration from `vercel.json`. If prompted for build settings:
   * Set **Framework Preset** to **Other**.
   * Leave **Output Directory** blank.
4. Set up the **Environment Variables** in Vercel project settings:

| Variable | Value | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://nvfsicrknphlllljbtiv.supabase.co` | Your Supabase Project API URL |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_nwicUi864Z5-RkwaKI1gbg_g0Flx-56` | Your Supabase Publishable Key |
| `VITE_CLOUDINARY_CLOUD_NAME` | `f5mafkpl` | Your Cloudinary Cloud ID |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `aura_portfolio` | Your Unsigned Preset Name |
| `NITRO_PRESET` | `vercel` | Forces Nitro to build Vercel API v3 outputs |

5. Click **Deploy**.

Once finished, Vercel will provide your live URL. You can log in to your dashboard at `https://your-app.vercel.app/admin` using the admin credentials you created in your Supabase Auth panel.
