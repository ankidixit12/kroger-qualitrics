# kroger-qualitrics

This repository is a starter for a Staffbase Studio plugin that embeds a Qualtrics survey using React and Node.

## Repository structure

- `client/` — React + Vite front-end.
- `server/` — Node/Express server for hosting the app and optionally exposing the Qualtrics survey URL.
- `plugin.json` — Staffbase plugin descriptor.
- `.env.example` — environment variables for Qualtrics configuration.

## Local setup

1. Install dependencies from the repository root:
   ```bash
   cd /workspaces/kroger-qualitrics
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and set your Qualtrics embed URL:
   ```bash
   VITE_QUALTRICS_EMBED_URL=https://yourdatacenter.qualtrics.com/jfe/form/SURVEY_ID
   ```

4. Start the development stack:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Qualtrics embedding

The React app loads the Qualtrics survey URL from `VITE_QUALTRICS_EMBED_URL`. If that variable is missing, the client calls `/api/qualtrics-link` on the server.

### Recommended flow

- Create an embedded survey in Qualtrics.
- Copy the survey URL.
- Set it in `.env` as `VITE_QUALTRICS_EMBED_URL`.
- Deploy the built plugin to an HTTPS host.

## Staffbase Studio integration

1. Deploy the plugin website to HTTPS hosting.
2. Register the plugin in Staffbase Studio.
3. Use the hosted URL as the plugin entry point.
4. The plugin will display the Qualtrics survey inside an iframe.

## Notes

- `server/index.js` serves the built React app and exposes `/api/qualtrics-link`.
- For production plugin packaging, adjust `plugin.json` to your Staffbase Studio schema.
- Staffbase Studio requires secure HTTPS hosting for embedded content.

## Staffbase Studio plugin package

A dedicated Staffbase plugin is available in `staffbase-plugin/`:

- `staffbase-plugin/src/index.js` — main plugin init logic
- `staffbase-plugin/src/QualtricsLoader.js` — loads Qualtrics zone script and sets `externalReference`
- `staffbase-plugin/src/RouteListener.js` — refreshes Qualtrics for SPA navigation
- `staffbase-plugin/plugin.json` — plugin descriptor for Staffbase Studio

### Build the Staffbase plugin

1. Change into the plugin folder:
   ```bash
   cd staffbase-plugin
   ```
2. Build the plugin bundle:
   ```bash
   npm run build
   ```

The resulting file is `staffbase-plugin/dist/index.js`. Register that as the plugin entry point in Staffbase Studio.
