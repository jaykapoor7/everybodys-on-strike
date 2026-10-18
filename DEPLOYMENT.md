# Release and hosting

## Intended targets

- Repository: `jaykapoor7/everybodys-on-strike`, branch `main`.
- Vercel team: `jaykapoor700-1687s-projects` (`team_qRMlvTFfcxrezBvNVj8C02iF`).
- New, independent Vercel project: `everybodys-on-strike`.
- Production URL: `https://strike.kapoorjay.com`.
- Framework: Vite. Build: `npm run build`. Output: `dist`. Install: `npm ci`.
- No environment variables, external APIs, storage services, or secrets.

## Current release status — October 17, 2026 (America/New_York)

The user created [jaykapoor7/everybodys-on-strike](https://github.com/jaykapoor7/everybodys-on-strike). The finished game is now pushed to `main`, and the remote commit was verified. The repository's initial README commit was preserved by merging its history with the game release. No other repository was modified.

The connected Vercel account can read the intended team. The requested Vercel project was not found, including a search for projects named `strike`. Importing the now-populated GitHub repository with `POST /v11/projects` still returned **403: You don’t have permission to create the project**. The documented CLI fallback has no existing CLI credentials. No Vercel project or deployment was created. No deployment success is claimed.

## Complete publishing once access is available

1. Open [Vercel New Project](https://vercel.com/new), select team `jaykapoor700-1687s-projects`, and import `jaykapoor7/everybodys-on-strike`.
2. Name the independent project `everybodys-on-strike`. Vite, the build command, and `dist` output are configured by `vercel.json`. Use Node.js 24. No environment variables are needed.
3. Deploy `main` to production. Wait for READY, visit the deployment URL, and check the opening button and at least one full run before declaring it live.
4. Add `strike.kapoorjay.com` to this project’s production domains. Verify the domain and the actual page response.

An already authenticated Vercel CLI can also deploy from this directory:

```sh
vercel link --scope jaykapoor700-1687s-projects --project everybodys-on-strike
vercel deploy --prod --scope jaykapoor700-1687s-projects
```

## DNS

Vercel’s domain configuration read during this release reports the parent zone using `ns1.vercel-dns.com` and `ns2.vercel-dns.com`, with `strike.kapoorjay.com` already resolving to Vercel infrastructure. Adding the domain to the new project may therefore handle DNS automatically.

If the new project still requests a DNS change, follow its displayed recommendation. The current API recommendation is a **CNAME named `strike` pointing to `cname.vercel-dns.com`**. Replace conflicting records for that subdomain only if needed. Do not change the apex domain, nameservers, portfolio, or any other game’s records. No DNS records were changed during this build.
