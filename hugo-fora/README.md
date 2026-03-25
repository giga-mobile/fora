# fora-hugo

Hugo partial templates for embedding [Fora](https://giga.mobile) comments — the fastest embeddable comment system, built on Cloudflare's edge.

## Install

### As a Hugo Module

```bash
hugo mod get github.com/giga-mobile/fora-hugo
```

### Manual

Copy `layouts/partials/fora/` into your project's `layouts/partials/` directory.

## Usage

### Basic

```html
{{ partial "fora/comments.html" (dict "siteKey" "your-site-key") }}
```

### With Options

```html
{{ partial "fora/comments.html" (dict
    "siteKey" "your-site-key"
    "pageId" .RelPermalink
    "pageTitle" .Title
    "theme" "auto"
) }}
```

### With Build-Time Count Badge

```html
{{ partial "fora/comments-with-count.html" (dict
    "siteKey" "your-site-key"
    "pageId" .RelPermalink
    "pageTitle" .Title
) }}
```

### In a Single Post Template

```html
{{ define "main" }}
<article>
  <h1>{{ .Title }}</h1>
  {{ .Content }}
</article>

{{ partial "fora/comments.html" (dict
    "siteKey" (index .Site.Params "foraSiteKey")
    "pageId" .RelPermalink
    "pageTitle" .Title
    "theme" "auto"
) }}
{{ end }}
```

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `siteKey` | ✅ | — | Your Fora site key |
| `pageId` | — | `""` | Thread identifier |
| `pageTitle` | — | `""` | Page title |
| `theme` | — | `"auto"` | Theme: `auto`, `light`, `dark` |
| `containerId` | — | `"fora-comments"` | DOM container ID |
| `origin` | — | `"https://giga.mobile"` | Fora API origin |
| `features` | — | `""` | Feature flags |
| `accent` | — | — | Accent color |
| `bg` | — | — | Background color |
| `surface` | — | — | Surface color |
| `text` | — | — | Text color |
| `font` | — | — | Font family |
| `radius` | — | — | Border radius |

## License

MIT
