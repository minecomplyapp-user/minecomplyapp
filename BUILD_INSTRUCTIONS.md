# 📱 MineComply APK Build Instructions

> **Last Updated**: December 2025  
> **Build Tool**: EAS Build (Expo Application Services)

---

## 🚨 CRITICAL: Fix for APK Instant Crash

If your APK crashes instantly upon opening, it's likely due to **missing environment variables**. This document provides the complete fix and build instructions.

### ⚠️ Root Causes Identified

1. **Missing Supabase Credentials**: App needs `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
2. **Missing API URL**: Production builds need API endpoint configuration
3. **No Fallback Values**: Old code threw errors instead of using fallbacks

### ✅ Fixes Applied

- ✅ Added production API fallback (`https://minecomplyapi.onrender.com/api`)
- ✅ Added graceful error handling (shows error screen instead of crashing)
- ✅ Added configuration validation on startup
- ✅ Created `ConfigurationErrorScreen` for user-friendly error display
- ✅ Updated `app.config.js` with default values
- ✅ Updated `eas.json` with environment variable templates

---

## 📋 Prerequisites

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

Enter your Expo account credentials.

### 3. Required Environment Variables

You **MUST** have these values before building:

| Variable | Required | Where to Get It |
|----------|----------|-----------------|
| `EXPO_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase Dashboard → Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase Dashboard → Settings → API |
| `PRODUCTION_API_BASE_URL` | ⚠️ Optional | Defaults to `https://minecomplyapi.onrender.com/api` |

---

## 🔧 Method 1: Build with .env File (Recommended)

### Step 1: Create .env File

```bash
cd minecomplyapp
cp env.example.txt .env
```

### Step 2: Edit .env File

Open `.env` and fill in your actual values:

```bash
# REQUIRED
EXPO_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key

# OPTIONAL (has default)
PRODUCTION_API_BASE_URL=https://minecomplyapi.onrender.com/api
```

### Step 3: Build APK

```bash
eas build --profile preview --platform android
```

**Note**: The `.env` file is automatically read by EAS Build.

---

## 🔧 Method 2: Build with eas.json Configuration

### Step 1: Update eas.json

Edit `minecomplyapp/eas.json` and fill in the `env` section:

```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://your-actual-project.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key",
        "PRODUCTION_API_BASE_URL": "https://minecomplyapi.onrender.com/api"
      }
    }
  }
}
```

### Step 2: Build APK

```bash
eas build --profile preview --platform android
```

⚠️ **Warning**: Don't commit `eas.json` with real credentials to Git!

---

## 🔧 Method 3: Build with EAS Secrets (Most Secure)

### Step 1: Set EAS Secrets

```bash
cd minecomplyapp

# Set Supabase URL
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co" --type string

# Set Supabase Key
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key-here" --type string

# Set Production API (optional)
eas secret:create --name PRODUCTION_API_BASE_URL --value "https://minecomplyapi.onrender.com/api" --type string
```

### Step 2: Verify Secrets

```bash
eas secret:list
```

### Step 3: Build APK

```bash
eas build --profile preview --platform android
```

**Advantages**:
- ✅ Secrets stored securely in EAS
- ✅ No credentials in code or .env files
- ✅ Team members can build without sharing credentials
- ✅ Easy to rotate credentials

---

## 📱 Build Profiles

### Preview Build (APK - Recommended for Testing)

```bash
eas build --profile preview --platform android
```

**Output**: APK file (can be installed directly on Android devices)  
**Use Case**: Internal testing, QA, stakeholder demos

### Production Build (AAB - For Google Play Store)

```bash
eas build --profile production --platform android
```

**Output**: AAB (Android App Bundle)  
**Use Case**: Publishing to Google Play Store

### Development Build (Dev Client)

```bash
eas build --profile development --platform android
```

**Output**: Development APK with dev tools  
**Use Case**: Active development with live reload

---

## 🎯 Post-Build Checklist

After the build completes:

### 1. Download APK

EAS will provide a download link. Download the APK to your computer.

### 2. Test on Device

```bash
# Install via ADB
adb install path/to/minecomply.apk

# Or share the download link to install directly
```

### 3. Verify No Crashes

- ✅ App opens without instant crash
- ✅ Login screen appears
- ✅ Can create account
- ✅ Can sign in
- ✅ Dashboard loads
- ✅ All features work

### 4. Check Configuration

On first launch, the app should:
- ✅ Show "Initializing MineComply..." briefly
- ✅ Load successfully (no configuration error screen)
- ✅ Connect to Supabase (check login functionality)
- ✅ Connect to API (check reports functionality)

---

## 🐛 Troubleshooting

### Issue: "Configuration Error" Screen Appears

**Cause**: Missing environment variables during build

**Solution**: 
1. Verify `.env` file has correct values
2. Rebuild with proper configuration
3. Use Method 3 (EAS Secrets) for guaranteed security

### Issue: Build Fails with "Invalid Credentials"

**Cause**: Incorrect Supabase URL or Key

**Solution**:
1. Go to Supabase Dashboard → Settings → API
2. Copy the exact Project URL and anon key
3. Ensure no extra spaces or quotes
4. Rebuild

### Issue: App Opens but Login Fails

**Cause**: Supabase credentials are correct but user doesn't exist

**Solution**:
1. Create a test account in Supabase Dashboard
2. Or use the Sign Up feature in the app

### Issue: Reports Don't Load

**Cause**: API endpoint not reachable

**Solution**:
1. Verify `PRODUCTION_API_BASE_URL` is correct
2. Check if backend API is running: https://minecomplyapi.onrender.com/api/health
3. Rebuild if needed

---

## 🔄 Update Workflow

When you need to update the app:

### 1. Make Code Changes

```bash
cd minecomplyapp
# Make your changes
git commit -am "feat: add new feature"
git push
```

### 2. Increment Version

Edit `app.config.js`:

```javascript
{
  expo: {
    version: "1.0.1", // Increment this
  }
}
```

### 3. Rebuild

```bash
eas build --profile preview --platform android
```

### 4. Distribute

Share the new APK download link with testers.

---

## 📊 Build Monitoring

### Check Build Status

```bash
eas build:list
```

### View Build Details

```bash
eas build:view BUILD_ID
```

### Cancel Build

```bash
eas build:cancel BUILD_ID
```

---

## 💡 Best Practices

### ✅ DO

- ✅ Use EAS Secrets for production builds
- ✅ Test APKs on multiple devices before distribution
- ✅ Increment version numbers for each build
- ✅ Keep environment variables up to date
- ✅ Document any configuration changes

### ❌ DON'T

- ❌ Commit `.env` to Git
- ❌ Share credentials in plain text (use EAS Secrets)
- ❌ Skip testing after rebuilds
- ❌ Use development builds for production
- ❌ Forget to update version numbers

---

## 🆘 Need Help?

### Resources

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **Supabase Docs**: https://supabase.com/docs
- **Project README**: See `README.md` in project root
- **Setup Guide**: See `SETUP_GUIDE.md` for development setup

### Common Commands Reference

```bash
# Build preview APK
eas build --profile preview --platform android

# Build production AAB
eas build --profile production --platform android

# List recent builds
eas build:list

# Set environment secret
eas secret:create --name VAR_NAME --value "value"

# List all secrets
eas secret:list

# Delete a secret
eas secret:delete --name VAR_NAME
```

---

## 📝 Summary

1. **Setup**: Create `.env` with Supabase credentials
2. **Build**: Run `eas build --profile preview --platform android`
3. **Download**: Get APK from build dashboard
4. **Install**: Share APK or install via ADB
5. **Test**: Verify all features work

**Result**: ✅ APK that opens without crashing and has all features working!

---

_Last Updated: December 2025 - After APK Crash Fix_

