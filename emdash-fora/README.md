# emdash-fora

EmDash plugin for [Fora](https://giga.mobile) — the fastest embeddable comment system, sandboxed and secure on Cloudflare's edge.

## Install

```bash
npm install emdash-fora
# or
pnpm add emdash-fora
# or
yarn add emdash-fora
```

## Usage

### As an EmDash Plugin

In your `emdash.config.ts`:

```ts
import { foraPlugin } from 'emdash-fora';

export default () => foraPlugin({
  siteKey: 'your-fora-site-key',
  theme: 'auto',
});
```

With other plugins:

```ts
import { foraPlugin } from 'emdash-fora';
import { seoPlugin } from 'emdash-seo';

export default () => [
  foraPlugin({ siteKey: 'your-fora-site-key', theme: 'dark' }),
  seoPlugin(),
];
```

### As an Astro Component (Theme Authors)

If you're building a custom EmDash theme, use the component directly:

```astro
---
import { ForaComments } from 'emdash-fora/astro';
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>

<ForaComments
  siteKey="your-site-key"
  pageId={post.slug}
  pageTitle={post.data.title}
  theme="auto"
/>
```

### SSR Count Badge

Fetch comment count at build time so static pages show a badge without JavaScript:

```astro
<ForaComments
  siteKey="your-site-key"
  buildCount={true}
/>
```

### Theming

```ts
foraPlugin({
  siteKey: 'your-fora-site-key',
  accent: '#8b5cf6',
  bg: '#0a0a0a',
  surface: '#18181b',
  text: '#e4e4e7',
  font: 'Inter, sans-serif',
  radius: '8px',
});
```

Or via the component:

```astro
<ForaComments
  siteKey="your-site-key"
  accent="#8b5cf6"
  bg="#0a0a0a"
  surface="#18181b"
  text="#e4e4e7"
  font="Inter, sans-serif"
  radius="8px"
/>
```

## Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `siteKey` | `string` | *required* | Your Fora site key |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Theme mode |
| `origin` | `string` | `'https://giga.mobile'` | Fora API origin |
| `features` | `string` | `''` | Comma-separated feature flags |
| `accent` | `string` | — | Accent color (CSS value) |
| `bg` | `string` | — | Background color (CSS value) |
| `surface` | `string` | — | Surface color (CSS value) |
| `text` | `string` | — | Text color (CSS value) |
| `font` | `string` | — | Font family |
| `radius` | `string` | — | Border radius (CSS value) |
| `containerId` | `string` | `'fora-comments'` | DOM container ID |
| `collections` | `string[]` | `['posts']` | Content collections to enable comments on |

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `siteKey` | `string` | *required* | Your Fora site key |
| `pageId` | `string` | `Astro.url.pathname` | Thread identifier |
| `pageTitle` | `string` | `document.title` | Page title for the thread |
| `pageUrl` | `string` | `Astro.url.href` | Canonical URL |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Theme mode |
| `containerId` | `string` | `'fora-comments'` | DOM container ID |
| `origin` | `string` | `'https://giga.mobile'` | Fora API origin |
| `buildCount` | `boolean` | `false` | Fetch count at build time for SSR badge |
| `accent` | `string` | — | Accent color |
| `bg` | `string` | — | Background color |
| `surface` | `string` | — | Surface color |
| `text` | `string` | — | Text color |
| `font` | `string` | — | Font family |
| `radius` | `string` | — | Border radius |

## How It Works

1. The plugin registers a `content:afterRender` hook with EmDash
2. On post pages, it injects a `<div>` container + `embed.js` from your Fora instance
3. The embed script bootstraps a Shadow DOM widget with the comment UI
4. A dashboard widget shows total comment count in the EmDash admin
5. All network access is sandboxed — the plugin can only talk to the declared Fora origin

## Security

EmDash plugins run in sandboxed Worker isolates. This plugin declares two capabilities:

- `read:content` — to access post metadata for thread mapping
- `network:giga.mobile` — to communicate with the Fora API

The plugin cannot access your database, filesystem, or any other network endpoint.

## Deploy to Cloudflare

One-click deploy template coming soon as EmDash's plugin API stabilizes past beta.

For now, install into your existing EmDash project:

```bash
npm install emdash-fora
```

## License

MIT
