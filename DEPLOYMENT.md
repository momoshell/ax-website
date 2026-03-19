# Deployment Guide

## GitHub Pages Setup

### Option 1: Automatic Deployment (Recommended)

1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Source: GitHub Actions
4. The `.github/workflows/deploy.yml` will auto-deploy on every push to main

### Option 2: Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. The `build/` directory contains the static site

3. For GitHub Pages project sites (e.g., `username.github.io/repo-name/`):
   - Update `svelte.config.js` paths.base to `/repo-name`
   - Build and push `build/` to `gh-pages` branch

4. For GitHub Pages user/org sites (e.g., `username.github.io/`):
   - Keep `paths.base` as empty string
   - Push `build/` contents to root of repository

## Build Verification

Before deploying, verify locally:

```bash
npm run build
npm run preview
```

Check:
- [ ] No build errors
- [ ] All pages render correctly
- [ ] Navigation works
- [ ] Images load
- [ ] No console errors in browser

## Custom Domain (Optional)

1. Add `CNAME` file to `/static/` with your domain:
   ```
   www.axlabs.ai
   ```

2. Configure DNS with your provider:
   - CNAME record pointing to `username.github.io`

3. Update `svelte.config.js`:
   ```javascript
   paths: {
     base: ''
   }
   ```

## Troubleshooting

### 404 Errors
- Check `paths.base` configuration matches your GitHub Pages URL structure
- Verify `.nojekyll` exists in `build/` root

### Assets Not Loading
- Ensure all asset paths are relative
- Check browser console for 404 errors
- Verify base path is set correctly in svelte.config.js

### Build Fails
- Run `npm run check` for TypeScript errors
- Check `build/` directory is gitignored
