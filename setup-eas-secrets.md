# Setup EAS Secrets - Step by Step

## 📋 Instructions

Follow these steps to configure your Supabase credentials for EAS Build:

### Step 1: Get Your Supabase Credentials

1. Open your `.env` file in `minecomplyapp/.env`
2. Find these two lines:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://...
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```
3. Copy the values (everything after the `=` sign)

### Step 2: Set EAS Secrets

Open PowerShell in the `minecomplyapp` directory and run:

```powershell
# 1. Set Supabase URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "PASTE_YOUR_URL_HERE" --type string

# 2. Set Supabase Anon Key  
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "PASTE_YOUR_KEY_HERE" --type string

# 3. Set Production API (optional but recommended)
eas secret:create --scope project --name PRODUCTION_API_BASE_URL --value "https://minecomplyapi.onrender.com/api" --type string
```

**IMPORTANT**: 
- Replace `PASTE_YOUR_URL_HERE` with your actual Supabase project URL
- Replace `PASTE_YOUR_KEY_HERE` with your actual Supabase anon key
- Keep the quotes around the values

### Step 3: Verify Secrets

```powershell
eas secret:list
```

You should see:
```
✔ EXPO_PUBLIC_SUPABASE_URL
✔ EXPO_PUBLIC_SUPABASE_ANON_KEY  
✔ PRODUCTION_API_BASE_URL
```

### Step 4: Rebuild APK

```powershell
eas build --profile preview --platform android
```

This time, the build will include your Supabase credentials!

---

## 🎯 Example (with fake values)

```powershell
# Example with fake values (replace with your real ones!)
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://abcdefghijk.supabase.co" --type string

eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example-key-here" --type string

eas secret:create --scope project --name PRODUCTION_API_BASE_URL --value "https://minecomplyapi.onrender.com/api" --type string
```

---

## ✅ After Rebuilding

The new APK will:
- ✅ Open without showing the configuration error
- ✅ Show the login screen
- ✅ Connect to Supabase successfully
- ✅ Connect to the production API
- ✅ Have all features working

---

## 🆘 Troubleshooting

### If secrets already exist:

```powershell
# Delete existing secret
eas secret:delete --name EXPO_PUBLIC_SUPABASE_URL

# Then create new one
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "YOUR_VALUE" --type string
```

### If you get "invalid format" error:

Make sure the value is in quotes and has no extra spaces:
```powershell
# ✅ Correct
--value "https://myproject.supabase.co"

# ❌ Wrong (no quotes)
--value https://myproject.supabase.co

# ❌ Wrong (extra spaces)
--value " https://myproject.supabase.co "
```

---

## 📝 Notes

- Secrets are stored securely in EAS (not in your code)
- Secrets are available to all your builds
- You only need to set them once
- Team members can build without needing the credentials
- You can update secrets anytime without changing code

