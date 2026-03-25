# astro-fora

Astro integration for [Fora](https://giga.mobile) — the fastest embeddable comment system, built on Cloudflare's edge.

## Install

```bash
npm install astro-fora
# or
pnpm add astro-fora
# or
yarn add astro-fora
```

## Usage

```astro
---
import { ForaComments } from 'astro-fora';
---

<ForaComments siteKey="your-site-key" />
```

### With Content Collections

```astro
---
import { ForaComments } from 'astro-fora';
import { getEntry } from 'astro:content';

const post = await getEntry('blog', Astro.params.slug);
const { Content } = await post.render();
---

<article>
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

### View Transitions

This component automatically re-mounts on Astro View Transition navigations. No extra configuration needed.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `siteKey` | `string` | *required* | Your Fora site key |
| `pageId` | `string` | `Astro.url.pathname` | Thread identifier |
| `pageTitle` | `string` | `document.title` | Page title for the thread |
| `pageUrl` | `string` | `Astro.url.href` | Canonical URL |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Theme mode |
| `containerId` | `string` | `'fora-comments'` | DOM container ID |
| `origin` | `string` | `'https://giga.mobile'` | Fora API origin |
| `features` | `string` | `''` | Comma-separated feature flags |
| `buildCount` | `boolean` | `false` | Fetch count at build time for SSR badge |
| `accent` | `string` | — | Accent color |
| `bg` | `string` | — | Background color |
| `surface` | `string` | — | Surface color |
| `text` | `string` | — | Text color |
| `font` | `string` | — | Font family |
| `radius` | `string` | — | Border radius |

## How It Works

1. Renders a `<div>` container with a build-time count badge (optional)
2. Loads `embed.js` from your Fora instance
3. The embed script bootstraps an iframe with the comment UI
4. On Astro View Transition navigations, automatically re-mounts

## License

MIT
