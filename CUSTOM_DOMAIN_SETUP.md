# Custom Domain Setup Guide

## 🌐 Using Your Own Domain (.com, .in, etc.)

### ✅ Will It Work?
**YES!** Your app will work perfectly with a custom domain. In fact, it will work even better because:
- Same domain = No cookie issues
- Professional appearance
- Better SEO
- Custom branding

## 📋 Step-by-Step Setup

### Step 1: Purchase a Domain

**Recommended Domain Registrars:**
- **Namecheap** (best value, easy setup)
- **GoDaddy** (popular, good support)
- **Google Domains** (simple interface)
- **Cloudflare** (free DNS, fast)

**Domain Examples:**
- `renteasee.com`
- `renteasee.in`
- `myrentalapp.com`
- `housefinder.com`

### Step 2: Configure Domain on Render

1. **Go to Render Dashboard:**
   - Visit: https://render.com/dashboard
   - Click on your `renteasee-fullstack` service

2. **Add Custom Domain:**
   - Click **"Settings"** tab
   - Scroll to **"Custom Domains"** section
   - Click **"Add Custom Domain"**
   - Enter your domain: `renteasee.com`
   - Click **"Add Domain"**

3. **Get DNS Instructions:**
   - Render will show you DNS records to add
   - Copy the CNAME record value
   - Note the IP address for A record

### Step 3: Configure DNS Records

**In your domain registrar (e.g., Namecheap):**

**Option A: CNAME + A Record (Recommended)**
```
Type: CNAME
Name: www
Value: renteasee-fullstack.onrender.com
TTL: 300

Type: A
Name: @
Value: [IP address from Render]
TTL: 300
```

**Option B: Use Render Nameservers (Easier)**
```
Change nameservers to:
ns1.render.com
ns2.render.com
```

### Step 4: Update Environment Variables

1. **In Render Dashboard:**
   - Go to **"Environment"** tab
   - Update `FRONTEND_URL` to your domain:
     ```
     FRONTEND_URL=https://renteasee.com
     ```
   - Click **"Save Changes"**

2. **Redeploy Service:**
   - Go to **"Manual Deploy"** → **"Deploy latest commit"**
   - Wait for deployment to complete

### Step 5: Test Your Domain

1. **Wait for DNS Propagation:**
   - Can take 5 minutes to 24 hours
   - Usually works within 1 hour

2. **Test Your Domain:**
   - Visit: `https://renteasee.com`
   - Test login functionality
   - Check if cookies work

3. **Verify in Browser:**
   - Open Dev Tools → Application → Cookies
   - Should see `token` cookie with `SameSite: Lax`
   - No third-party cookie issues!

## 🔧 Technical Details

### How It Works:
```
User visits: renteasee.com
↓
DNS resolves to: renteasee-fullstack.onrender.com
↓
Render serves your app
↓
Same domain = Perfect cookie support
```

### Cookie Configuration:
```javascript
{
  httpOnly: true,
  secure: true,
  sameSite: 'lax', // Works perfectly with same domain
  maxAge: age,
  path: '/'
}
```

## 🚀 Benefits of Custom Domain

### Security:
- ✅ **Same-origin requests** = No CORS issues
- ✅ **HTTP-only cookies** work perfectly
- ✅ **No third-party cookie blocking**

### Professional:
- ✅ **Custom branding** (yourname.com)
- ✅ **Better SEO** (search engines prefer custom domains)
- ✅ **User trust** (looks more professional)

### Performance:
- ✅ **Faster loading** (no cross-origin requests)
- ✅ **Better caching** (same domain)
- ✅ **Reduced latency**

## 🔍 Troubleshooting

### If Domain Doesn't Work:
1. **Check DNS Propagation:**
   - Use: https://dnschecker.org
   - Enter your domain and check globally

2. **Verify DNS Records:**
   - Make sure CNAME points to `renteasee-fullstack.onrender.com`
   - Check A record has correct IP

3. **Check Render Logs:**
   - Go to "Logs" tab in Render
   - Look for any errors

### If Cookies Still Don't Work:
1. **Check Environment Variables:**
   - Verify `FRONTEND_URL` is set correctly
   - Make sure it matches your domain

2. **Clear Browser Cache:**
   - Hard refresh (Ctrl+F5)
   - Clear cookies and try again

3. **Check HTTPS:**
   - Make sure your domain uses HTTPS
   - Render provides free SSL certificates

## 📝 SSL Certificate

**Render automatically provides:**
- ✅ **Free SSL certificate**
- ✅ **Automatic HTTPS redirect**
- ✅ **Secure connections**

**No additional setup needed!**

## 🎯 Final Result

After setup:
- **Your domain**: `https://renteasee.com`
- **API endpoints**: `https://renteasee.com/api/*`
- **Perfect cookies**: Same domain = No issues
- **Professional look**: Custom domain branding
- **Works everywhere**: All browsers, all profiles

## 💡 Pro Tips

1. **Use www subdomain**: `www.renteasee.com` (more professional)
2. **Set up redirects**: `renteasee.com` → `www.renteasee.com`
3. **Monitor uptime**: Use services like UptimeRobot
4. **Backup domain**: Consider buying similar domains

Your app will work perfectly with a custom domain and solve all cookie issues! 🚀
