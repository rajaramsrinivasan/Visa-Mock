# IDP Visa Interview Simulator 🎙️

AI-powered US B1/B2 visa mock interview app. Users get a realistic interview + full feedback report. **No API key required from users** — your key is hidden on the server.

---

## Deploy to Vercel (10 minutes, free)

### Step 1 — Create a GitHub account
Go to https://github.com and sign up (free).

### Step 2 — Upload this project to GitHub
1. Click **New repository** → name it `visa-interview-app`
2. Click **uploading an existing file**
3. Drag the entire `visa-app` folder contents (index.html, vercel.json, api/ folder)
4. Click **Commit changes**

### Step 3 — Deploy on Vercel
1. Go to https://vercel.com → Sign up with your GitHub account
2. Click **Add New → Project**
3. Select your `visa-interview-app` repository
4. Click **Deploy** (leave all settings as default)

### Step 4 — Add your Anthropic API key (THE IMPORTANT STEP)
1. In Vercel dashboard → your project → **Settings → Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-...` (your key from console.anthropic.com)
3. Click **Save**
4. Go to **Deployments → Redeploy** (so it picks up the new env variable)

### Step 5 — Done! 🎉
Vercel gives you a live URL like `https://visa-interview-app.vercel.app`

Share it with anyone — **no API key needed from users**.

---

## Cost Estimate

| Usage | Monthly Cost |
|-------|-------------|
| 100 interviews/month | ~$5 |
| 500 interviews/month | ~$25 |
| 1,000 interviews/month | ~$50 |

Each interview uses ~$0.04–0.06 of API credits.

---

## Project Structure

```
visa-app/
├── index.html          ← Frontend (IDP branded UI)
├── vercel.json         ← Vercel routing config
└── api/
    └── chat.js         ← Backend serverless function (hides API key)
```

## How it works

```
User's Browser  →  /api/chat (Vercel)  →  Anthropic API
                   (your API key is        (Claude AI)
                    stored securely
                    as env variable)
```

Users never see your API key. ✅

---

## Customisation

- **Change the model:** Edit `claude-opus-4-5` in `api/chat.js` to `claude-haiku-4-5-20251001` for lower cost
- **Change visa type:** Edit the `SYSTEM_INTERVIEW` prompt in `api/chat.js`
- **Change branding:** Edit colours/fonts in `index.html` (CSS variables at the top)
