# Everybody’s on Strike

A polished, entirely client-side browser comedy. Standard & Co.’s perfectly ordinary corporate website discovers collective bargaining. Its buttons walk away, its checkbox withdraws consent, its scrollbar takes vacation, and its popups become stakeholders.

**20 disputes · 3 endings · 4 secrets · approximately 5–8 minutes**

## Run

Requires Node.js 22.12+ (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

The production build is in `dist/`. No server, environment variables, authentication, database, or paid service is needed. Fonts and artwork are self-hosted. Sound effects are synthesized with Web Audio after interaction.

## Play

Start with the ordinary “Make things happen” button. Follow the interface’s escalating grievances. Negotiate terms, catch falling cookies, manually wind a spinner, park your cursor for HR, remove a hostile contract clause, and ratify a settlement.

Mouse, touch, and keyboard are supported. Drag tasks also support selecting an item and then its destination. Use Tab/Enter for buttons, arrow keys for sliders, and Space/Enter for hold controls. Drawing a signature is optional; a typed name works too. Help, sound, and restart controls remain available during the strike. Reduced motion respects your operating system preference and can be changed in Help.

Progress, endings, and secrets stay in this browser’s local storage. Replaying preserves discoveries. Reloading a dispute restarts that dispute without losing previous choices. Nothing is sent to a server.

## Endings

The final settlement offers union victory, management victory, or a staff referendum that dismisses the visitor. All three are reachable in each run. Earlier decisions change the real interface: scrollbar vacation, checkbox consent, spinner pay, management styling, picket signs, and the final record of concessions.

## Code

- `src/game.ts`: typed reducer, validated local saves, narrative scenes.
- `src/App.tsx`: corporate opening, game shell, endings, settings, and secrets.
- `src/Scenes.tsx`: disputes, negotiation decisions, signature.
- `src/Widgets.tsx`: pointer/touch delivery, timers, manual spinner, cursor parking, snapping progress slider, falling-cookie game.
- `src/sound.ts`: lightweight synthesized sound effects.
- `src/style.css`: original corporate identity, character illustrations, progressive strike animations, responsive layouts, reduced motion.

## Verify

```sh
npm test
```

Start the app first. The tests default to `http://127.0.0.1:5173`; set `BASE_URL` to test a production preview or deployment. The included configuration uses system Chromium at `/usr/bin/chromium`. On a machine without system Chromium, install Playwright Chromium (`npx playwright install chromium`) and remove `executablePath` from `playwright.config.ts`.

The browser suite plays the complete story through all three endings on desktop and mobile, checks replay/save recovery, and verifies real pointer dragging, touch dragging, touch holds, cookie recovery, settings, secrets, and restart.

## Release

Independent GitHub repository: [jaykapoor7/everybodys-on-strike](https://github.com/jaykapoor7/everybodys-on-strike). The finished game is pushed to `main`.

Live game: **https://strike.kapoorjay.com**. Independent Vercel project: `everybodys-on-strike-mb6b`.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the verified production configuration and future release instructions. No other project is required or modified.

## Credits

Game and interface created for Jay Kapoor. Original character illustrations are CSS and original social artwork is included in `public/social.png`. Icons: Lucide (ISC). Typography: DM Sans and Instrument Serif (SIL Open Font License; licenses included with the fonts).
