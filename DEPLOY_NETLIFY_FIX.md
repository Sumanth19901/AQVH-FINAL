# Netlify Deployment Fixes

I have identified and validated the fixes required to deploy your Next.js application to Netlify successfully.

## 1. Configuration Changes Made (`netlify.toml`)
I have updated your `netlify.toml` to:
- **Set Node.js Version**: Enforced Node.js 20 (Required for Next.js 15).
- **Correct Build Command**: Ensured it uses `npm run build`.
- **Remove Invalid Settings**: Removed the manual `publish = ".next"` setting which conflicts with the Netlify Next.js plugin.

## 2. Actions You Must Take in Netlify

### A. Clear Build Cache and Redploy
1. Go to your Netlify Dashboard > **Deploys**.
2. Click **"Trigger deploy"** and select **"Clear cache and deploy site"**.

### B. Environment Variables
You **MUST** add the following Environment Variables in **Site Settings > Environment variables**:

| Key | Value | Purpose |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `your_actual_api_key` | Required for the AI features. |
| `Next_FORCE_EDGE_IMAGES` | `true` | (Optional) Helps with image optimization sometimes. |

### C. Verify Build Settings
1. Go to **Site Settings > Build & deploy**.
2. Ensure **Build command** is set to `npm run build` (or left blank to use `netlify.toml`).
3. **IMPORTANT**: If you see any command like `pip install ...` or `python ...`, **REMOVE IT**. Netlify cannot host your `backend.py` Python server alongside the Next.js site in this standard deployment.
   - *Note*: Your app is designed to fall back to "Mock Data" if the backend is unreachable, so the site will still work (in Demo Mode).

## 3. Why `pip install` was failing
Your previous errors indicated Netlify was trying to install Python dependencies ("pip install fa..."). This happens if the build command includes Python instructions or if Netlify attempts to build the Python part. I have adjusted the configuration to focus strictly on the Node.js/Next.js frontend.
