# Auth0 Setup Guide for BudgetGuard App

## 🚀 Quick Setup Steps

### 1. Create Auth0 Account
1. Go to [auth0.com](https://auth0.com) and sign up for a free account
2. Choose your region (US, EU, or AU)

### 2. Create a New Application
1. In your Auth0 Dashboard, go to **Applications** → **Applications**
2. Click **"Create Application"**
3. Choose **"Single Page Application"**
4. Name it: `BudgetGuard App`
5. Click **"Create"**

### 3. Configure Application Settings
1. Go to your application's **Settings** tab
2. Update the following settings:

#### **Allowed Callback URLs**
```
http://localhost:8080/budget-guard-app/budget
https://asperumalla.github.io/budget-guard-app/budget
```

#### **Allowed Logout URLs**
```
http://localhost:8080/budget-guard-app/budget/login
https://asperumalla.github.io/budget-guard-app/budget/login
```

#### **Allowed Web Origins**
```
http://localhost:8080
https://asperumalla.github.io
```

#### **Allowed Origins (CORS)**
```
http://localhost:8080
https://asperumalla.github.io
```

### 4. Enable Social Connections (Optional)
1. Go to **Authentication** → **Social**
2. Enable **Google** and **GitHub** connections
3. Follow the setup instructions for each provider

### 5. Update Environment Variables
1. Copy your **Domain** and **Client ID** from the application settings
2. Update `.env.local` with your actual values:

```env
VITE_AUTH0_DOMAIN=your-actual-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-actual-client-id
VITE_AUTH0_AUDIENCE=your-auth0-audience
VITE_AUTH0_REDIRECT_URI=http://localhost:8080/budget-guard-app/budget
```

### 6. Test the Integration
1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:8080/budget-guard-app/budget/login`
3. Test the Auth0 login buttons

## 🔧 Production Configuration

### For GitHub Pages Deployment:
1. Update your Auth0 application settings:
   - **Allowed Callback URLs**: Add `https://asperumalla.github.io/budget-guard-app/budget`
   - **Allowed Logout URLs**: Add `https://asperumalla.github.io/budget-guard-app/budget/login`
   - **Allowed Web Origins**: Add `https://asperumalla.github.io`

2. Update environment variables for production:
```env
VITE_AUTH0_REDIRECT_URI=https://asperumalla.github.io/budget-guard-app/budget
```

## 🎯 Features Available

### ✅ **Authentication Methods**
- **Database Login**: Username/Password authentication
- **Google OAuth**: Sign in with Google
- **GitHub OAuth**: Sign in with GitHub
- **Demo Login**: Temporary demo account for testing

### ✅ **User Management**
- Automatic user profile creation
- Avatar generation
- Session persistence
- Secure logout

## 🚨 Important Notes

1. **Never commit `.env.local`** to version control
2. **Update redirect URIs** when deploying to different domains
3. **Test thoroughly** in both development and production environments
4. **Monitor Auth0 logs** for any authentication issues

## 🔍 Troubleshooting

### Common Issues:
1. **"Invalid redirect URI"**: Check your Auth0 application settings
2. **"Connection not found"**: Ensure social connections are enabled
3. **"Domain not found"**: Verify your Auth0 domain in environment variables

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are loaded
3. Check Auth0 Dashboard logs
4. Ensure all URLs match exactly (including trailing slashes)

## 📚 Additional Resources

- [Auth0 React SDK Documentation](https://auth0.com/docs/quickstart/spa/react)
- [Auth0 Dashboard](https://manage.auth0.com)
- [Auth0 Community](https://community.auth0.com)
