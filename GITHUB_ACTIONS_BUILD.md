# Building Android APK with GitHub Actions

## Quick Start

1. **Push the workflow file to GitHub**:
   ```bash
   git add .github/workflows/build-android.yml GITHUB_ACTIONS_BUILD.md
   git add package.json package-lock.json android/gradle.properties android/app/build.gradle
   git commit -m "Add GitHub Actions workflow for Android builds"
   git push origin main
   ```

2. **Trigger the build**:
   - Go to your minecomplyapp GitHub repository
   - Click on **Actions** tab
   - Click on **Build Android APK** workflow
   - Click **Run workflow** button
   - Select branch (main) and click **Run workflow**

3. **Wait for build** (~10-15 minutes for first build, ~5-7 minutes for subsequent builds)

4. **Download APK**:
   - Once build completes, click on the workflow run
   - Scroll to **Artifacts** section at the bottom
   - Click on **app-release** to download the APK
   - Extract the ZIP file to get your APK

## APK Location in Artifact

The downloaded artifact will contain:
```
app-arm64-v8a-release.apk
```

## Build Configuration

The workflow:
- Uses Ubuntu runner (more reliable than Windows)
- Builds only arm64-v8a architecture (99%+ device coverage)
- Includes production environment variables
- Maximum 2 parallel workers to prevent memory issues
- APK retained for 14 days

## Environment Variables

Production environment variables are hardcoded in the workflow:
- `EXPO_PUBLIC_PRODUCTION_API_BASE_URL`: https://minecomplyapi-4a46.onrender.com
- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public key

**Note**: These are public keys and safe to commit. Never commit service role keys or JWT secrets.

## Troubleshooting

**If build fails:**
1. Check the Actions tab for error logs
2. Click on the failed run
3. Expand the failed step to see error details

**Common issues:**
- **Out of memory**: Already optimized with max-workers=2
- **Missing dependencies**: Workflow installs all deps automatically
- **Permission errors**: Workflow sets execute permissions automatically

## Cost

- **Public repositories**: Free unlimited minutes
- **Private repositories**: 2000 free minutes/month (one build = ~10 minutes)

## Manual Trigger Only

The workflow is set to manual trigger only (`workflow_dispatch`).

**To trigger on every push to main**, uncomment these lines in `.github/workflows/build-android.yml`:
```yaml
push:
  branches: [ main ]
```

---

**Status**: ✅ READY TO USE
**Date**: December 16, 2025
