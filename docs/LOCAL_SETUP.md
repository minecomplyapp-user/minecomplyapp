# MineComply Mobile App - Local Development Setup

> Complete guide for setting up the mobile app on your local machine

## Table of Contents

- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Quick Start

**For experienced developers** (~5 minutes):

```bash
# 1. Clone and install
git clone <repository-url>
cd minecomplyapp
npm install

# 2. Setup environment
cp .env .env.local
# Edit .env.local with your settings

# 3. Start Expo
npx expo start

# 4. Run on device/simulator
# Scan QR code with Expo Go (mobile device)
# or press 'i' for iOS simulator / 'a' for Android emulator
```

**Verify**: App loads, you can navigate to Auth screen

For detailed walkthrough, continue reading below.

---

## Detailed Setup

### Prerequisites

Before you begin, ensure you have the following:

| Tool | Version | Check Command | Download |
|------|---------|---------------|----------|
| **Node.js** | 20.x or higher | `node --version` | [nodejs.org](https://nodejs.org) |
| **npm** | 10.x or higher | `npm --version` | Comes with Node.js |
| **Git** | Latest | `git --version` | [git-scm.com](https://git-scm.com) |
| **Expo Go App** | Latest | Install from App Store | [iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) |

**For Simulator/Emulator (Optional):**
- **iOS**: Xcode (Mac only) with iOS Simulator
- **Android**: Android Studio with Android Emulator

**Recommended:**
- **VS Code** with extensions: React Native Tools, ESLint, Prettier
- **Backend API running** (see `minecomplyapi/docs/LOCAL_SETUP.md`)

---

### Step 1: Verify Backend is Running

Before setting up the frontend, **ensure the backend API is running**:

```bash
# Test backend health
curl http://localhost:3000/health
```

**Expected response:**
```json
{"status":"ok","environment":"development","service":"MineComply API"}
```

✅ If you get this response, proceed!  
❌ If not, setup the backend first: `minecomplyapi/docs/LOCAL_SETUP.md`

---

### Step 2: Clone Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd minecomplyapp
```

---

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- React Native & Expo dependencies
- Navigation libraries
- Zustand for state management
- Supabase client
- UI libraries
- And more...

**Expected output**: Should complete without errors (warnings are usually fine)

**Note**: This may take 3-5 minutes depending on your internet connection.

---

### Step 4: Configure Environment Variables

#### 4.1 Create .env.local File

```bash
# Copy the existing .env as template
cp .env .env.local
```

Or create `.env.local` manually:

**Windows:**
```cmd
type nul > .env.local
```

**Mac/Linux:**
```bash
touch .env.local
```

#### 4.2 Find Your Local IP Address

You need your computer's IP address for the mobile app to connect to your local backend.

**Windows:**
```cmd
ipconfig
```
Look for `IPv4 Address` under your active network adapter (WiFi or Ethernet).

**Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Or simpler:
ipconfig getifaddr en0  # WiFi
ipconfig getifaddr en1  # Ethernet
```

**Linux:**
```bash
hostname -I | awk '{print $1}'
# Or:
ip addr show | grep "inet " | grep -v 127.0.0.1
```

**Example output**: `192.168.1.100` (yours will be different)

#### 4.3 Edit .env.local File

Open `.env.local` in your editor and configure:

```bash
# ==================== API CONFIGURATION ====================

# For local development (backend running on your computer)
USE_RENDER_API=false
API_BASE_URL=http://192.168.1.100:3000

# For testing with production API (if backend not running locally)
# USE_RENDER_API=true
# EXPO_PUBLIC_API_BASE_URL=https://minecomplyapi.onrender.com

# ==================== SUPABASE CONFIGURATION ====================

# Get these from your Supabase project dashboard
# (Should match the backend's Supabase project)
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key

# ==================== OPTIONAL CONFIGURATION ====================

# Confirmation redirect (for email verification)
# CONFIRMATION_REDIRECT_URL=exp://192.168.1.100:8081
```

**Important:**
- Replace `192.168.1.100` with YOUR actual local IP
- Use the **same Supabase project** as your backend
- Get Supabase credentials from Supabase Dashboard → Settings → API
- Keep `USE_RENDER_API=false` for local development

#### 4.4 Configuration Scenarios

**Scenario 1: Local Backend** (Recommended for development)
```bash
USE_RENDER_API=false
API_BASE_URL=http://192.168.1.100:3000  # Your IP
```

**Scenario 2: Production Backend** (Testing without local backend)
```bash
USE_RENDER_API=true
EXPO_PUBLIC_API_BASE_URL=https://minecomplyapi.onrender.com
```

**Scenario 3: Different Port** (If backend not on port 3000)
```bash
USE_RENDER_API=false
API_BASE_URL=http://192.168.1.100:3001  # Different port
```

---

### Step 5: Start Expo Development Server

```bash
npx expo start
```

**Expected output:**
```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

**Keep this terminal window open** - the Metro bundler needs to run continuously.

---

### Step 6: Run the App

You have several options:

#### Option A: Physical Device (Recommended)

**iOS (iPhone/iPad):**
1. Install "Expo Go" from App Store
2. Open Camera app
3. Scan the QR code from terminal
4. Tap the notification to open in Expo Go

**Android:**
1. Install "Expo Go" from Play Store
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Scan the QR code from terminal

**Note**: Your phone and computer must be on the same WiFi network!

#### Option B: iOS Simulator (Mac Only)

```bash
# Press 'i' in the Expo terminal
# Or run:
npx expo start --ios
```

**Prerequisites:**
- Xcode installed
- iOS Simulator setup

#### Option C: Android Emulator

```bash
# Press 'a' in the Expo terminal
# Or run:
npx expo start --android
```

**Prerequisites:**
- Android Studio installed
- Android Emulator created and running

#### Option D: Web Browser (Limited Features)

```bash
# Press 'w' in the Expo terminal
# Or run:
npx expo start --web
```

**Note**: Some features don't work on web (camera, signatures, etc.)

---

## Verification

### Test 1: App Loads

✅ **Success indicators:**
- App opens without crashing
- You see the Login/Signup screen
- No red error screens

❌ **If you see errors:**
- Check that Metro bundler is running
- Verify your .env.local configuration
- See [Troubleshooting](#troubleshooting) section

### Test 2: API Connection

Try to sign up or log in:

1. On the Auth screen, tap "Sign Up"
2. Enter:
   - Email: `test@example.com`
   - Password: `Test123456!`
   - First Name: `Test`
   - Last Name: `User`
3. Tap "Sign Up"

✅ **If successful:**
- You'll be redirected to Role Selection screen
- This confirms API and Supabase are connected

❌ **If you see network errors:**
- Verify `API_BASE_URL` uses your correct IP
- Ensure backend is running (`curl http://localhost:3000/health`)
- Check firewall isn't blocking port 3000
- See [Troubleshooting: Network Errors](#network-errors)

### Test 3: Navigation

After logging in:

1. Select a role (e.g., "Proponent")
2. Navigate to Dashboard
3. Explore different screens

✅ **If navigation works:**
- You can move between screens
- Back button works
- No crashes

### Test 4: Draft System

1. From Dashboard, go to "CMVR Reports"
2. Create a new report
3. Fill in some basic info
4. Save as draft
5. Go back to Dashboard
6. Check if "Resume Draft" appears

✅ **If draft system works:**
- Draft saves successfully
- Can resume editing
- Data persists after app restart

---

## Troubleshooting

### Network Errors

#### Symptoms:
```
Network request failed
TypeError: Network request failed
```

#### Solutions:

**1. Verify Backend is Running**
```bash
curl http://localhost:3000/health
```

**2. Check IP Address**
- Ensure `API_BASE_URL` in `.env.local` uses your current IP
- Your IP may change if using DHCP
- Test from your phone's browser: `http://192.168.1.100:3000/health`

**3. Check Same Network**
- Phone and computer must be on same WiFi
- Some corporate/public WiFi blocks device-to-device communication
- Try mobile hotspot from your phone if needed

**4. Check Firewall**

**Windows:**
```cmd
# Allow Node through firewall
netsh advfirewall firewall add rule name="Node.js" dir=in action=allow program="C:\Program Files\nodejs\node.exe" enable=yes
```

**Mac:**
- System Preferences → Security & Privacy → Firewall
- Click "Firewall Options"
- Ensure Node.js is allowed

**5. Try Production API**
Edit `.env.local`:
```bash
USE_RENDER_API=true
EXPO_PUBLIC_API_BASE_URL=https://minecomplyapi.onrender.com
```
Restart Expo and test again.

---

### Metro Bundler Issues

#### Symptoms:
```
Metro bundler has encountered an internal error
Unable to resolve module
```

#### Solutions:

**1. Clear Cache**
```bash
# Stop Expo (Ctrl+C)
npx expo start --clear
```

**2. Reset Everything**
```bash
# Stop Expo
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

**3. Specific Module Error**
If error mentions specific module:
```bash
npm install <module-name>
```

---

### QR Code Not Scanning

#### Symptoms:
- QR code appears but won't scan
- Camera doesn't detect code

#### Solutions:

**iOS:**
- Use the native Camera app (not Expo Go for scanning)
- Ensure Camera has permissions
- Try increasing brightness

**Android:**
- Open Expo Go app first
- Use the in-app scanner (not camera app)
- Ensure Expo Go has camera permissions

**Alternative: Manual Connection**
1. Note the URL shown in terminal: `exp://192.168.1.100:8081`
2. In Expo Go, tap "Enter URL manually"
3. Type the URL
4. Tap "Connect"

---

### Supabase Authentication Errors

#### Symptoms:
```
Invalid login credentials
User already registered
```

#### Solutions:

**1. Verify Supabase Configuration**
- `EXPO_PUBLIC_SUPABASE_URL` matches backend
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` is correct
- Same Supabase project as backend

**2. Check Supabase Dashboard**
- Go to Authentication → Users
- Verify user exists
- Check email verification status

**3. Create User Manually**
In Supabase Dashboard:
1. Authentication → Users
2. "Add user"
3. Enter email/password
4. Create user
5. Try logging in with those credentials

---

### App Crashes on Startup

#### Symptoms:
- Red error screen immediately
- App closes

#### Common Errors & Fixes:

**1. "Cannot read property of undefined"**
```bash
# Usually missing dependencies
npm install
npx expo start --clear
```

**2. "Native module cannot be found"**
```bash
# Rebuild native modules
npx expo prebuild
npx expo start
```

**3. "Element type is invalid"**
```bash
# Check for import errors
# Look at the error stack trace for the problematic file
```

---

### iOS Simulator Issues

#### Symptoms:
- Simulator doesn't open
- Simulator opens but app doesn't load

#### Solutions:

**1. Install Xcode Command Line Tools**
```bash
xcode-select --install
```

**2. Accept Xcode License**
```bash
sudo xcodebuild -license accept
```

**3. Reset Simulator**
- Simulator → Device → Erase All Content and Settings

**4. Specific Simulator**
```bash
npx expo start --ios --simulator="iPhone 15 Pro"
```

---

### Android Emulator Issues

#### Symptoms:
- Emulator doesn't start
- "No devices/emulators found"

#### Solutions:

**1. Check Emulator is Running**
```bash
# List available devices
adb devices

# If empty, start emulator from Android Studio
```

**2. Create AVD (Android Virtual Device)**
- Open Android Studio
- Tools → AVD Manager
- Create Virtual Device
- Choose Pixel 5 or similar
- Download system image if needed

**3. Set ANDROID_HOME**

**Mac/Linux (.bash_profile or .zshrc):**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Windows (System Environment Variables):**
```
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
```

---

### Slow Performance

#### Symptoms:
- App is laggy
- Long load times
- Slow typing

#### Solutions:

**1. Development Mode**
- Shake device → "Disable Fast Refresh" if causing issues
- Shake device → "Debug Remote JS" off (use Hermes)

**2. Build for Production**
```bash
npx expo prebuild
npx expo run:ios    # or run:android
```

Production builds are much faster than Expo Go.

**3. Reduce Form Size**
- Close sections you're not working on
- Save drafts frequently
- Clear old drafts

---

### Environment Variables Not Working

#### Symptoms:
```
Cannot read EXPO_PUBLIC_SUPABASE_URL
API_BASE_URL is undefined
```

#### Solutions:

**1. Restart Expo**
Environment variables are loaded at startup:
```bash
# Stop Expo (Ctrl+C)
npx expo start --clear
```

**2. Check File Name**
- Should be `.env.local` (not `.env.local.txt`)
- Located in project root (next to `package.json`)

**3. Check Variable Names**
- Must start with `EXPO_PUBLIC_` to be accessible in app
- Or defined in `app.config.js` under `extra`

**4. Verify app.config.js**
Check that it's reading from environment:
```javascript
extra: {
  USE_RENDER_API: process.env.USE_RENDER_API,
  API_BASE_URL: process.env.API_BASE_URL,
  // ...
}
```

---

### Getting Help

If you're still stuck:

1. **Check Expo Diagnostics**: Run `npx expo-doctor`
2. **Review Logs**: Look at full error messages in terminal
3. **Check Backend**: Ensure backend is actually running and accessible
4. **Test on Different Device**: Try simulator vs physical device
5. **Documentation**: See [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
6. **Ask Team**: Share full error message and what you've tried

---

## Next Steps

### 1. Explore the App

Now that the app is running:

- **Dashboard**: Central hub for all features
- **CMVR Reports**: Try creating a compliance report
- **Drafts**: Save work and resume later
- **Profile**: Update your user profile
- **Attendance**: Create meeting attendance records

### 2. Review Documentation

- **[FEATURES.md](FEATURES.md)** - Detailed feature guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - App architecture
- **[STATE_MANAGEMENT.md](STATE_MANAGEMENT.md)** - How Zustand stores work
- **[API_INTEGRATION.md](API_INTEGRATION.md)** - API client usage
- **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** - Development workflows

### 3. Development Workflow

- **Hot Reload**: Edit code and see changes instantly
- **Debug Menu**: Shake device → access debug options
- **React DevTools**: Install for component inspection
- **Zustand DevTools**: Monitor state changes

### 4. Build for Production

When ready to distribute:

```bash
# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

See [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

### 5. Team Collaboration

- **Share .env.local template**: Don't commit actual values
- **Keep dependencies updated**: `npm outdated`
- **Branch workflow**: Create feature branches
- **Pull requests**: Review code before merging

---

## Quick Reference

### Common Commands

```bash
# Start Development
npx expo start              # Start Metro bundler
npx expo start --clear      # Start with cache cleared
npx expo start --ios        # Open iOS simulator
npx expo start --android    # Open Android emulator
npx expo start --web        # Open in web browser

# Development Tools
npx expo-doctor             # Check for issues
npx expo install            # Install correct package versions

# Native Builds
npx expo prebuild           # Generate native code
npx expo run:ios            # Build and run on iOS
npx expo run:android        # Build and run on Android

# Code Quality
npm run lint                # Run linter (if configured)
npm run typecheck           # TypeScript type checking

# Troubleshooting
rm -rf node_modules         # Clear dependencies
npm install                 # Reinstall dependencies
npx expo start --clear      # Clear all caches
```

### Important URLs

| Service | URL |
|---------|-----|
| Metro Bundler | http://localhost:8081 |
| Backend API | http://localhost:3000 |
| Backend Health | http://localhost:3000/health |
| Backend Swagger | http://localhost:3000/api/docs |
| Supabase Dashboard | https://app.supabase.com |

### Debug Menu (Shake Device)

- **Reload**: Reload JavaScript
- **Debug Remote JS**: Chrome DevTools debugging
- **Show Inspector**: Element inspector
- **Toggle Performance Monitor**: FPS monitor
- **Toggle Element Inspector**: UI debug
- **Disable Fast Refresh**: Turn off hot reload

### Project Structure

```
minecomplyapp/
├── App.tsx                 # App entry point
├── app.config.js           # Expo configuration
│
├── screens/                # All app screens
│   ├── auth/              # Login/signup
│   ├── dashboard/         # Main dashboard
│   ├── CMVRPAGE/          # CMVR reports (180+ files)
│   ├── ecc/               # ECC monitoring
│   ├── attendance/        # Attendance management
│   └── profile/           # User profile
│
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication state
│
├── store/                 # Zustand stores
│   ├── cmvrStore.js       # CMVR state
│   └── eccStore.js        # ECC state
│
├── lib/                   # Utilities & API
│   ├── api.ts            # Base API client
│   ├── supabase.ts       # Supabase client
│   └── drafts.ts         # Draft management
│
├── components/            # Reusable components
├── navigation/            # Navigation setup
├── .env.local            # Your config (create this)
└── package.json          # Dependencies
```

---

## Platform-Specific Notes

### Windows Development

- Use PowerShell or Command Prompt
- Firewall may block ports - add exceptions
- Android Emulator works great
- iOS development not available (Mac only)

### Mac Development

- Best platform for React Native development
- Both iOS and Android development supported
- Use Xcode for iOS Simulator
- Use Android Studio for Android Emulator

### Linux Development

- Android development fully supported
- iOS development not available
- May need to configure Android SDK paths manually
- Some Expo features may require workarounds

---

**Congratulations! 🎉** Your MineComply Mobile App is now running!

You're ready to start developing. Happy coding!

---

**Questions?** Check the documentation in the `/docs` folder or ask your team!

