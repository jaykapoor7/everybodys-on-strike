# Validation — 2026-10-18

- Production build: `npm run build` passed (TypeScript + Vite).
- Complete browser suite: **12 tests passed**, covering all three endings from the opening click on desktop and mobile, checkpoint reload, ending persistence, replay, settings, secrets, pointer drag, real touch drag, real touch hold, drawn/typed signatures, missed-cookie recovery, silence interruption, and restart.
- Final mobile play-through after reading-flow and typography polish: passed through all 20 disputes, union ending, reload, and replay.
- Final responsive/focus/checkbox matrix: **36 checks passed** at 320, 390, 768, and 1440px. No horizontal page overflow across the representative opening and cases 6, 9, 12, 14, 16, and 20. Forced checkbox state persists. Modal keyboard focus stays contained and Escape closes it.
- Browser runtime errors: none during the successful complete play-throughs.
- Browser engine: system Chromium. Desktop and touch-enabled mobile viewports were exercised, including native touch events through Chrome DevTools Protocol.
- Artwork/screenshots were visually reviewed for the corporate opening, mobile layout, walkout, gravity revolt, and endings.
- Final compiled app: approximately 94 KB JavaScript + 16 KB CSS gzipped. Complete static output, including self-hosted fonts and social artwork: under 800 KB uncompressed.
- `git diff --check`: passed.

The finished game has subsequently been **pushed to GitHub main**, with the remote commit verified. **Vercel publishing remains blocked**: the connected account still receives a project-creation permission error. The requested production domain returned HTTP 404 when checked; no live deployment is claimed. See `DEPLOYMENT.md` for the exact target configuration, observed permissions, and DNS recommendation.
