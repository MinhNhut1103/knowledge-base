# Deployment Guide (Vercel)

This application is built with **React (+Vite)** and uses **Supabase** for the database. The best place to deploy it is **Vercel**.

## Prerequisites
1.  A [GitHub](https://github.com/) account.
2.  A [Vercel](https://vercel.com/) account.
3.  Your **Supabase URL** and **Anon Key** (from your `.env` file).

## Step 1: Push to GitHub

If you haven't already, push your code to a new GitHub repository.

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Rename branch to main
git branch -M main

# Add remote (Replace URL with your new repository URL)
git remote add origin https://github.com/YOUR_USERNAME/knowledge-base.git

# Push
git push -u origin main
```

## Step 2: Deploy on Vercel

1.  Log in to your **Vercel Dashboard**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `knowledge-base` repository from GitHub.

## Step 3: Configure Environment Variables (CRITICAL)

**Before clicking Deploy**, you MUST add your Supabase credentials:

1.  In the Vercel import screen, look for **"Environment Variables"**.
2.  Expand it and add the following two variables (copy values from your local `.env` file):

    | Name | Value |
    |------|-------|
    | `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` |
    | `VITE_SUPABASE_ANON_KEY` | `your-long-anon-key-string` |

3.  Click **Add** for each one.

## Step 4: Finalize

1.  Click **"Deploy"**.
2.  Wait for Vercel to build your project (usually creates a build in `dist` folder).
3.  Once finished, you will get a live URL (e.g., `https://knowledge-base-app.vercel.app`).

## Troubleshooting

-   **White Screen?** Check the Browser Console (F12). If you see "Missing Supabase URL", you forgot Step 3. Go to Vercel Settings -> Environment Variables and add them, then redeploy.
-   **Routing Issues?** Vercel handles SPA routing automatically for Vite, but if you hit 404 on refresh, ensure a `vercel.json` exists (usually not needed for default Vite, but good to know).

## Optional: vercel.json
If you encounter 404s on refresh, create a `vercel.json` file in your project root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
