# Release and hosting

## Production

- Live game: https://strike.kapoorjay.com
- Vercel address: https://everybodys-on-strike-mb6b.vercel.app
- Repository: https://github.com/jaykapoor7/everybodys-on-strike, branch `main`.
- Independent Vercel project: `everybodys-on-strike-mb6b`.
- Project ID: `prj_k71YAakMNOT4jF9399CarsN0Ch4T`.
- Team: `jaykapoor700-1687s-projects` (`team_qRMlvTFfcxrezBvNVj8C02iF`).
- Framework: Vite, Node.js 24. Build: `npm run build`. Output: `dist`. Install: `npm ci`.
- No environment variables, external APIs, backend services, or secrets.

## Verified release — October 17, 2026 (America/New_York)

The game is pushed to GitHub `main`. The repository's initial README commit was preserved by merging its history with the game release.

The user imported the repository into Vercel and supplied its production URL. Vercel confirmed the production deployment was **READY**, with GitHub commit `1ad7423f752b779d38123fbaa87a0b33a8ccf492`.

The custom domain `strike.kapoorjay.com` was then attached to project `prj_k71YAakMNOT4jF9399CarsN0Ch4T`. Vercel reports the domain as verified and its alias points to this game's production deployment.

Public HTTPS verification succeeded at the custom domain: the opening document returns HTTP 200, the JavaScript and CSS SHA-256 hashes exactly match the locally tested production build, and the favicon, social artwork, robots file, and all six font files return HTTP 200. The game was previously played through all three endings on desktop and mobile in the automated local production-build suite. The complete browser suite was not rerun against the public deployment.

## DNS

The domain already uses Vercel DNS and resolves to Vercel infrastructure. Attaching the subdomain was sufficient: HTTPS and application asset delivery work. **No manual DNS action is required.** No apex-domain, nameserver, portfolio, or other-game settings were changed.

For future diagnosis, inspect this exact project's domain record and use Vercel's current domain/project-specific DNS recommendation. Do not replace working records with generic values.

## Future releases

Push the tested game to GitHub `main`; this repository is connected to the independent Vercel project. Confirm the resulting deployment is READY and verify https://strike.kapoorjay.com before reporting a release as live.

An already authenticated Vercel CLI can also deploy from this directory:

```sh
vercel link --scope jaykapoor700-1687s-projects --project everybodys-on-strike-mb6b
vercel deploy --prod --scope jaykapoor700-1687s-projects
```

Use the immutable project ID for connector lookups when needed. It resolves to the verified intended team and project.
