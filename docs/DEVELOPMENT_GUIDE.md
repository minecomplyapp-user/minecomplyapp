# MineComply Mobile App - Development Guide

> Last Updated: December 2025

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Running the App](#running-the-app)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Building](#building)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Initial Setup

```bash
cd minecomplyapp
npm install
```

### Environment Configuration

Create `.env.local`:

```bash
# API Configuration
USE_RENDER_API=false
API_BASE_URL=http://192.168.1.100:3000
EXPO_PUBLIC_API_BASE_URL=https://minecomplyapi.onrender.com

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Running the App

### Start Development Server

```bash
npx expo start
```

### Run on Simulator/Emulator

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

### Run on Physical Device

1. Install Expo Go app
2. Scan QR code from terminal
3. App loads on device

---

## Development Workflow

### Daily Workflow

1. Pull latest changes
2. Install dependencies (if package.json changed)
3. Start Expo dev server
4. Make changes (hot reload enabled)
5. Test on simulator/device
6. Commit and push

### API Base URL Configuration

**Local Development:**
```bash
USE_RENDER_API=false
API_BASE_URL=http://YOUR_COMPUTER_IP:3000
```

**Testing Production API:**
```bash
USE_RENDER_API=true
EXPO_PUBLIC_API_BASE_URL=https://minecomplyapi.onrender.com
```

### Finding Your Local IP

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```cmd
ipconfig | findstr IPv4
```

---

## Testing

### Manual Testing

Test checklist:
- [ ] Authentication (login/signup)
- [ ] CMVR report creation
- [ ] Draft save/load
- [ ] File uploads
- [ ] Document generation
- [ ] Profile management

### Debug Tools

**React Native Debugger:**
```bash
# Install
brew install --cask react-native-debugger

# Use: Shake device → Debug
```

**Expo Dev Tools:**
- Press `m` for menu
- Press `j` for debugger
- Press `r` to reload

---

## Building

### Development Build

```bash
npx expo prebuild
npx expo run:ios  # or run:android
```

### Production Build (EAS)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build iOS
eas build --platform ios

# Build Android  
eas build --platform android
```

---

## Troubleshooting

### Common Issues

**Metro Bundler Port Conflict:**
```bash
lsof -ti:8081 | xargs kill
```

**Clear Cache:**
```bash
npx expo start --clear
```

**Reset Node Modules:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**iOS Build Issues:**
```bash
cd ios
pod install
cd ..
```

**Android Build Issues:**
```bash
cd android
./gradlew clean
cd ..
```

### Network Issues

If API requests fail:
1. Verify API_BASE_URL is your computer's IP
2. Ensure API server is running
3. Check firewall isn't blocking port 3000
4. Try USE_RENDER_API=true to test with production API

---

## Code Style

- TypeScript for new files
- NativeWind for styling
- Functional components with hooks
- Zustand for state management

---

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [Zustand](https://github.com/pmndrs/zustand)

