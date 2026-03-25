# jekyll-fora

Jekyll plugin for embedding [Fora](https://giga.mobile) comments — the fastest embeddable comment system, built on Cloudflare's edge.

## Install

### Via Gemfile

```ruby
gem "jekyll-fora"
```

Then add to `_config.yml`:

```yaml
plugins:
  - jekyll-fora
```

### Manual

Copy `lib/jekyll-fora.rb` into your project's `_plugins/` directory.

## Usage

### Set your site key in `_config.yml`

```yaml
fora_site_key: "your-site-key"
```

### Add comments to any post or page

```liquid
{% fora_comments %}
```

### Override per-post

```liquid
{% fora_comments site_key="other-site-key" theme="dark" %}
```

### With theming

```liquid
{% fora_comments accent="#8b5cf6" bg="#0a0a0a" surface="#18181b" text="#e4e4e7" radius="8px" %}
```

### In a layout

```html
<article>
  {{ content }}
</article>

{% if page.comments != false %}
  {% fora_comments %}
{% endif %}
```

## Parameters

| Parameter | Config key | Default | Description |
|-----------|-----------|---------|-------------|
| `site_key` | `fora_site_key` | — | Your Fora site key |
| `page_id` | — | page URL | Thread identifier |
| `page_title` | — | page title | Page title |
| `theme` | — | `auto` | Theme: `auto`, `light`, `dark` |
| `container_id` | — | `fora-comments` | DOM container ID |
| `origin` | — | `https://giga.mobile` | Fora API origin |
| `features` | — | `""` | Feature flags |
| `accent` | — | — | Accent color |
| `bg` | — | — | Background color |
| `surface` | — | — | Surface color |
| `text` | — | — | Text color |
| `font` | — | — | Font family |
| `radius` | — | — | Border radius |

## License

MIT
