# create-fora

CLI quickstart for [Fora](https://giga.mobile) — embeddable comments. Zero config, no auth required.

## Quick Start

```bash
npx create-fora
```

That's it. Auto-detects your framework. No login, no signup — just paste and ship.

**What it does:**
1. Asks for your site name and domain
2. Auto-detects your framework (Astro, Hugo, Hakyll, etc.)
3. Creates an anonymous site (rate-limited to 3/hour)
4. Outputs a copy-paste snippet for your framework

**Need more?** Run `npx fora login` to enable billing, multi-site management, and team features.

## Commands

```bash
npx create-fora          # Instant setup (no auth)
npx create-fora --login  # Authenticated setup
npx fora status          # Show site info
npx fora login           # Log in with magic link
npx fora help            # Show help
```

## Supported Frameworks

| Framework | Package | Install |
|-----------|---------|---------|
| Astro | `astro-fora` | `npm install astro-fora` |
| Hugo | Hugo Module | `hugo mod get` |
| Jekyll | `jekyll-fora` | `gem install jekyll-fora` |
| Eleventy (11ty) | `fora-eleventy-plugin` | `npm install fora-eleventy-plugin` |
| Hakyll | [Template + Haskell module](https://giga.mobile/docs/hakyll) | Copy the template |
| Any HTML | `<script>` tag | No install needed |

## Example Output

```
✅ Site created: "My Blog"
   Site Key: anon_abc123def456
   Domain:   myblog.com

📋 Paste this into your Astro project:

import { ForaComments } from 'astro-fora';
<ForaComments siteKey="anon_abc123def456" />
```

## Documentation

- [Hugo integration guide](https://giga.mobile/docs/hugo)
- [Hakyll integration guide](https://giga.mobile/docs/hakyll)

## License

MIT
