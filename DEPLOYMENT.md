# 🚀 Deployment Guide

## Frontend Deployment (Vercel)

### 1. Deploy Frontend to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure the project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Add Environment Variables:**
   - `VITE_API_URL` = `https://your-backend-url.railway.app` (you'll get this after backend deployment)
7. **Click "Deploy"**

### 2. Update API URL After Backend Deployment

After deploying the backend, update the `VITE_API_URL` environment variable in Vercel with your actual backend URL.

---

## Backend Deployment (Render)

### 1. Deploy Backend to Render

1. **Go to [Render](https://render.com)**
2. **Sign up/Login** with GitHub
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure:**
   - **Root Directory**: `api`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. **Add Environment Variables:**
   ```
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/rent?retryWrites=true&w=majority
   JWT_SECRET_KEY=your-super-secret-jwt-key-here
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   PORT=8800
   NODE_ENV=production
   ```
7. **Click "Create Web Service"**

### 2. Get Backend URL

After deployment, Render will give you a URL like: `https://your-project-name.onrender.com`

---

## Environment Variables Setup

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Backend (Render)
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/rent?retryWrites=true&w=majority
JWT_SECRET_KEY=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
PORT=8800
NODE_ENV=production
```

**Note**: Socket.io is now integrated into the main API server, so you only need to deploy one backend service!

---

## Prerequisites

### 1. MongoDB Atlas
- Create a MongoDB Atlas account
- Create a cluster
- Get your connection string
- Update `DATABASE_URL` in backend environment variables

### 2. Cloudinary (for image uploads)
- Create a Cloudinary account
- Get your cloud name, API key, and API secret
- Update Cloudinary variables in backend environment variables

### 3. GitHub Repository
- Push your code to GitHub
- Make sure both `client` and `api` folders are in the root

---

## Post-Deployment Steps

1. **Update Frontend API URL**: After backend deployment, update `VITE_API_URL` in Vercel
2. **Test the Application**: Make sure all features work
3. **Set up Custom Domain** (optional): Add your custom domain in Vercel
4. **Monitor**: Check logs in both Vercel and Render

---

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in backend
2. **Database Connection**: Verify `DATABASE_URL` is correct
3. **Image Upload Issues**: Check Cloudinary credentials
4. **Build Failures**: Check build logs in deployment platform

### Support:
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
