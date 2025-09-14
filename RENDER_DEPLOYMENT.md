# Deploy Both Frontend and Backend on Render

## 🎯 Why This Solves the Cookie Problem

**Current Issue:**
- Frontend: `renteasee.vercel.app` (Vercel)
- Backend: `renteasee-api.onrender.com` (Render)
- Problem: Cross-origin = Third-party cookies blocked

**Solution:**
- Frontend: `renteasee.onrender.com` (Render)
- Backend: `renteasee-api.onrender.com` (Render)
- Result: Same domain = First-party cookies! ✅

## 📋 Step-by-Step Deployment

### Step 1: Deploy Backend (Already Done)
Your backend is already deployed on Render at `renteasee-api.onrender.com`

### Step 2: Deploy Frontend on Render

1. **Go to Render Dashboard**
   - Visit: https://render.com/dashboard
   - Click "New +" → "Static Site"

2. **Connect Repository**
   - Connect your GitHub repository
   - Select the same repository as your backend

3. **Configure Build Settings**
   - **Name**: `renteasee-frontend`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
   - **Node Version**: `18` (or latest)

4. **Set Environment Variables**
   - `VITE_API_URL`: `https://renteasee-api.onrender.com`

5. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete

### Step 3: Update Backend CORS

1. **Go to Backend Service on Render**
   - Find your `renteasee-api` service
   - Go to "Environment" tab

2. **Update Environment Variables**
   - `FRONTEND_URL`: `https://renteasee.onrender.com` (your new frontend URL)

3. **Redeploy Backend**
   - Go to "Manual Deploy" → "Deploy latest commit"

### Step 4: Test the Solution

1. **Visit New Frontend URL**
   - Go to: `https://renteasee.onrender.com`
   - Try logging in

2. **Check Browser Dev Tools**
   - Go to Application → Cookies
   - Should see `token` cookie with `SameSite: Lax`
   - No more third-party cookie issues!

## 🔧 Technical Details

### Cookie Settings (Updated)
```javascript
{
  httpOnly: true,
  secure: true,
  sameSite: 'lax', // Changed from 'none' to 'lax'
  maxAge: age,
  path: '/'
}
```

### Why This Works
- **Same Domain**: Both frontend and backend on `*.onrender.com`
- **First-Party Cookies**: `sameSite: 'lax'` works perfectly
- **No CORS Issues**: Same origin requests
- **Maximum Security**: HTTP-only cookies still work

## 🚀 Benefits

✅ **Solves third-party cookie blocking**
✅ **Maintains security with HTTP-only cookies**
✅ **No code changes needed**
✅ **Works on all browsers and profiles**
✅ **Simpler deployment (both on same platform)**

## 📝 Notes

- Your current Vercel deployment will still work for users who enable third-party cookies
- The Render deployment will work for everyone
- You can keep both deployments or switch entirely to Render
- Consider updating your domain DNS to point to Render if you want a custom domain
