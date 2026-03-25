# create-fora

CLI quickstart for [Fora](https://giga.mobile) — the fastest embeddable comment system, built on Cloudflare's edge.

## Quick Start

```bash
npx create-fora@latest
```

This will:
1. Log you in (magic link to your email)
2. Ask for your site name, domain, and framework
3. Create a site and generate a siteKey
4. Output a copy-paste snippet for your framework

## Commands

```bash
npx create-fora          # Interactive setup
npx fora login           # Log in with magic link
npx fora status          # Show account and site info
npx fora help            # Show help
```

## Supported Frameworks

- Astro
- Next.js
- Hugo
- Jekyll
- Eleventy (11ty)
- React
- Vue
- Svelte
- Plain HTML

## Example Output

```
✅ Site created: "My Blog"
   Site Key: site_abc123def456
   Domain:   myblog.com

📋 Paste this into your Astro project:

import { ForaComments } from 'astro-fora';
<ForaComments siteKey="site_abc123def456" />
```

## Framework Packages

| Framework | Package | Install |
|-----------|---------|---------|
| Astro | `astro-fora` | `npm install astro-fora` |
| Hugo | Hugo Module | `hugo mod get` |
| Jekyll | `jekyll-fora` | `gem install jekyll-fora` |
| Eleventy | `fora-eleventy-plugin` | `npm install fora-eleventy-plugin` |
| Any HTML | `<script>` tag | No install needed |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `FORA_API` | `https://giga.mobile` | API base URL |

## License

MIT
