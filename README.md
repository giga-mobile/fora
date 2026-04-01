# Fora Framework Adapters

Official framework integrations for [Fora](https://giga.mobile) — the fastest embeddable comment system, built on Cloudflare's edge.

## Available Adapters

| Framework | Package | Directory |
|-----------|---------|-----------|
| **Astro** | [`astro-fora`](https://npmjs.com/package/astro-fora) | [`astro-fora/`](./astro-fora/) |
| **Hugo** | Hugo Module / Partial | [`hugo-fora/`](./hugo-fora/) |
| **Jekyll** | [`jekyll-fora`](https://rubygems.org/gems/jekyll-fora) | [`jekyll-fora/`](./jekyll-fora/) |
| **Eleventy (11ty)** | [`@fora/eleventy-plugin-fora`](https://npmjs.com/package/@fora/eleventy-plugin-fora) | [`eleventy-fora/`](./eleventy-fora/) |
| **Any HTML** | `<script src="https://giga.mobile/embed.js">` | No adapter needed |

## Universal API

All adapters wrap the same core contract:

### Data Attributes (on the script tag)

| Attribute | Required | Description |
|-----------|----------|-------------|
| `data-site-key` | ✅ | Your Fora site key |
| `data-page-id` | — | Thread identifier (defaults to current path) |
| `data-page-url` | — | Canonical URL |
| `data-page-title` | — | Page title |
| `data-theme` | — | `auto`, `light`, `dark` |
| `data-container-id` | — | DOM mount point (default: `giga-fora-comments`) |
| `data-features` | — | Comma-separated feature flags |

### JavaScript API (`window.Fora`)

```js
// Mount to an element with explicit options
Fora.mount('#comments', {
  siteKey: 'your-site-key',
  pageId: '/blog/my-post',
  pageTitle: 'My Post',
  theme: 'auto'
});

// Update: tear down + remount with new options (for SPA navigation)
Fora.update('#comments', { pageId: '/blog/other-post' });

// Tear down an instance
Fora.unmount('#comments');

// Fetch comment count without rendering
Fora.count('your-site-key', '/blog/my-post').then(count => {
  console.log(count); // 47
});
```

### REST API

#### Count (SSR-safe)

```
GET /api/embed/count?site_key=X&page_id=Y
→ { "count": 47, "thread_id": "...", "site_key": "X", "page_id": "Y" }
```

Cacheable. Use at build time for static site generators.

#### Structured Data (SEO)

```
GET /api/embed/structured-data?site_key=X&page_id=Y&limit=5
→ { "jsonld": { "@type": "DiscussionForumPosting", ... } }
```

Returns JSON-LD `DiscussionForumPosting` with top comments. Inject into `<head>` for rich search results.

#### Webhooks

```
POST /api/tenant/sites/{siteId}/webhooks
{
  "url": "https://your-build-hook.com/trigger",
  "events": "comment.created",
  "secret": "optional-hmac-secret"
}
```

Fires on `comment.created` with HMAC-SHA256 signature (`X-Fora-Signature` header). Use for:

- **Netlify** build hooks
- **Vercel** deploy hooks
- **GitHub Actions** repository_dispatch
- **Cloudflare Pages** deploy hooks
- Any CI/CD webhook endpoint

### Webhook Payload

```json
{
  "event": "comment.created",
  "site_id": "...",
  "timestamp": 1711380000000,
  "data": {
    "thread_id": "...",
    "post_id": "...",
    "comment_id": "...",
    "page_identifier": "/blog/my-post",
    "page_title": "My Post",
    "author_name": "Anonymous Fox"
  }
}
```

## Publishing Status

| Package | Registry | Status |
|---------|----------|--------|
| `astro-fora` | npm | Ready to publish |
| `hugo-fora` | Hugo Modules | Ready to publish |
| `jekyll-fora` | RubyGems | Ready to publish |
| `@fora/eleventy-plugin-fora` | npm | Ready to publish |
| `emdash-fora` | npm | Ready to publish |

## Architecture

```
┌─────────────────────────────────────────────┐
│           FORA CORE (framework-neutral)      │
│                                              │
│  embed.js · bootstrap API · count endpoint   │
│  structured data · webhooks · Fora.* API     │
└──────────┬──────────┬──────────┬─────────────┘
           │          │          │
     ┌─────┴───┐ ┌───┴────┐ ┌──┴──────────┐
     │  Astro  │ │  Hugo  │ │ Jekyll/11ty │
     │ Island  │ │Partial │ │ Tag/Shortcode│
     └─────────┘ └────────┘ └─────────────┘
```

Each adapter is a **thin wrapper** (50-100 lines) translating framework conventions into the core API. The heavy lifting lives in one place.

## License

MIT
ore API. The heavy lifting lives in one place.

## License

MIT
