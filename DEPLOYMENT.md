# Release and hosting

## Intended targets

- Repository: `jaykapoor7/everybodys-on-strike`, branch `main`.
- Vercel team: `jaykapoor700-1687s-projects` (`team_qRMlvTFfcxrezBvNVj8C02iF`).
- New, independent Vercel project: `everybodys-on-strike`.
- Production URL: `https://strike.kapoorjay.com`.
- Framework: Vite. Build: `npm run build`. Output: `dist`. Install: `npm ci`.
- No environment variables, external APIs, storage services, or secrets.

## Observed access on 2026-10-18

The connected GitHub account authenticates as `jaykapoor7`. The requested repository does not exist. Both GitHub GraphQL `createRepository` and REST `POST /user/repos` rejected its creation with **Resource not accessible by integration (403)**. No repository was created, no remote push succeeded, and no other repository was modified.

The connected Vercel account can read the intended team. The requested Vercel project does not exist. `POST /v11/projects` returned **403: You don’t have permission to create the project**. The documented CLI fallback had no existing CLI credentials, so its automatic login attempt was stopped. No Vercel project or deployment was created. No deployment success is claimed.

## Complete publishing once access is available

1. Create the empty GitHub repository `jaykapoor7/everybodys-on-strike`, without a README or other initial commit. Grant the connected GitHub integration contents access to that repository.
2. Push the prepared local `main` branch:

   ```sh
   git push -u origin main
   ```

3. In the intended Vercel team, create `everybodys-on-strike` by importing that exact repository. It is configured by `vercel.json`; use Node.js 24.
4. Deploy `main` to production. Wait for READY, visit the deployment URL, and check the opening button and at least one full run before declaring it live.
5. Add `strike.kapoorjay.com` to this project’s production domains. Verify the domain and the actual page response.

An already authenticated Vercel CLI can also deploy from this directory:

```sh
vercel link --scope jaykapoor700-1687s-projects --project everybodys-on-strike
vercel deploy --prod --scope jaykapoor700-1687s-projects
```

## DNS

Vercel’s domain configuration read on 2026-10-18 reports the parent zone using `ns1.vercel-dns.com` and `ns2.vercel-dns.com`, with `strike.kapoorjay.com` already resolving to Vercel infrastructure. Adding the domain to the new project may therefore handle DNS automatically.

If the new project still requests a DNS change, follow its displayed recommendation. The current API recommendation is a **CNAME named `strike` pointing to `cname.vercel-dns.com`**. Replace conflicting records for that subdomain only if needed. Do not change the apex domain, nameservers, portfolio, or any other game’s records. No DNS records were changed during this build.
