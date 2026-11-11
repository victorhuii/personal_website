# Victor Hui's personal website

React 19 + Vite portfolio, built as a static website. GitHub repository:
[victorhuii/personal_website](https://github.com/victorhuii/personal_website).

## Local development

Use Node 24 (`nvm use` if you use nvm).

```sh
npm ci
npm run dev
```

Edit content in `src/content/`, pages in `src/pages/`, and styles in `src/styles/`
and `src/App.css`. Images and PDFs live in `public/`.

## Publish with Cloudflare Pages (one-time connection)

The repository is prepared for hosting; connect your Cloudflare account before
pushes can update a live website.

1. Sign in to [Cloudflare](https://dash.cloudflare.com/) and open **Workers & Pages**.
2. Create a **Pages** application using **Connect to Git** (not Direct Upload).
3. Connect GitHub and grant access to **victorhuii/personal_website**.
4. Select the repository and use these settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | React (Vite) |
| Root directory | Repository root (leave blank) |
| Build command | `npm run check` |
| Build output directory | `dist` |
| Node version | `24` (from `.nvmrc`; alternatively set `NODE_VERSION=24`) |

5. Save and deploy. Cloudflare provides the live `*.pages.dev` URL after a successful build.
6. Optionally add your domain in the project's **Custom domains** settings.

No API tokens or application environment variables are needed for this static site.
Cloudflare's Git integration handles deployment; the GitHub Actions workflow
independently verifies tests, the production build, and hosting limits.

## Update the live site

After the one-time Cloudflare connection:

```sh
npm run check
git add .
git commit -m "Describe the website changes"
git push origin main
```

Cloudflare automatically rebuilds and deploys a successful push to `main`.
Check the deployment status in Cloudflare before expecting the live site to change.
Other branches can get preview URLs without changing production.

## Checks and hosting behavior

- `npm test`: existing photo-spread layout tests.
- `npm run build`: production bundle in `dist/`.
- `npm run check:hosting`: verifies the built entry point, headers, and Pages file limits.
- `npm run check`: runs all three; used by Cloudflare and GitHub Actions.
- `npm run preview`: inspect the production build locally.
- `npm run lint`: separate source lint check; not part of the deployment gate.

The site uses hash routes (for example `/#/about` and `/#/projects/missionguard`),
so no route-rewrite configuration is needed. Keep Vite's root base URL for Pages.
`public/_headers` adds basic response headers and long-lived caching only for
Vite's generated, fingerprinted assets. Images keep their normal cache behavior
so replacements can update without changing the filename.

Commit the lockfile and all referenced files in `public/`. Do not commit
`node_modules/`, `dist/`, local environment files, or credentials.

Cloudflare documentation: [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/),
[build settings](https://developers.cloudflare.com/pages/configuration/build-configuration/),
[Node version](https://developers.cloudflare.com/pages/configuration/build-image/),
[file limits](https://developers.cloudflare.com/pages/platform/limits/).
