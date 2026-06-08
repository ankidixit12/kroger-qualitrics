# kroger-qualitrics

This repository contains a simple Staffbase Studio plugin that loads a Qualtrics Zone URL directly in the browser.

## What this repo includes

- `staffbase-plugin/` — the standalone Staffbase plugin package
- `staffbase-plugin/src/index.js` — plugin bootstrap logic
- `staffbase-plugin/src/QualtricsLoader.js` — loads the Qualtrics Zone URL and sets `externalReference`
- `staffbase-plugin/src/RouteListener.js` — refreshes Qualtrics for SPA navigation
- `staffbase-plugin/plugin.json` — Staffbase plugin descriptor

## No backend required

This plugin does not need a server-side backend. It loads Qualtrics entirely from the browser using the configured Zone URL.

## Staffbase plugin setup

1. Build the plugin:
   ```bash
   cd /workspaces/kroger-qualitrics/staffbase-plugin
   npm install
   npm run build
   ```

2. The plugin output is:
   - `staffbase-plugin/dist/index.js`

3. Register the plugin in Staffbase Studio using `staffbase-plugin/plugin.json` and the built bundle.

## Qualtrics URL

The plugin uses this Qualtrics Zone URL:

```text
https://zn2ukynhmxdi4ug6f-krogerxmit.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_2uKyNHmXdi4UG6f
```

If you want to customize the Zone URL, edit `staffbase-plugin/src/QualtricsLoader.js`.

## How it works

- `staffbase-plugin/src/index.js` initializes the plugin with `context` from Staffbase
- It reads the logged-in user and sets `externalReference`
- It loads the Qualtrics Zone script once
- It refreshes Qualtrics on SPA route changes if Staffbase navigation is available

## Run locally

This plugin package is static. The simplest validation is to build it:

```bash
cd /workspaces/kroger-qualitrics/staffbase-plugin
npm run build
```

If you want a local preview page, run:

```bash
cd /workspaces/kroger-qualitrics/staffbase-plugin
npm run preview
```

Then open:

```text
http://localhost:3000
```

This preview page loads `staffbase-plugin/dist/index.js` and initializes the plugin with a fake Staffbase context.

## Notes

- You do not need `server/` or `client/` to use the Staffbase plugin.
- If you want, I can also remove the unused `server/` and `client/` folders from the repo.
