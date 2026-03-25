# @fora/eleventy-plugin-fora

Eleventy (11ty) plugin for embedding [Fora](https://giga.mobile) comments — the fastest embeddable comment system, built on Cloudflare's edge.

## Install

```bash
npm install @fora/eleventy-plugin-fora
```

## Setup

```js
// .eleventy.js
const foraPlugin = require('@fora/eleventy-plugin-fora');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(fororaPlugin, {
    siteKey: 'your-site-key'
  });
};
```

## Usage

### Nunjucks

```njk
{{ foraComments() }}
{{ foraComments({ theme: "dark" }) }}
{{ foraComments({ theme: "auto", accent: "#8b5cf6", radius: "8px" }) }}
```

### Liquid

```liquid
{% foraComments %}
{% foraComments "dark" %}
```

### JavaScript Templates (.11ty.js)

```js
module.exports = function (data) {
  return `
    <article><h1>${data.title}</h1>${data.content}</article>
    ${this.foraComments({ theme: 'auto' })}
  `;
};
```

### With Eleventy Data

```njk
{{ foraComments({ pageId: page.url, pageTitle: title }) }}
```

## Plugin Options

Set defaults in `.eleventy.js`:

```js
eleventyConfig.addPlugin(fororaPlugin, {
  siteKey: 'your-site-key',
  origin: 'https://giga.mobile'
});
```

## Per-Call Options

| Option | Default | Description |
|--------|---------|-------------|
| `siteKey` | plugin default | Fora site key |
| `pageId` | `""` | Thread identifier |
| `pageTitle` | `""` | Page title |
| `theme` | `auto` | `auto`, `light`, `dark` |
| `containerId` | `fora-comments` | DOM container ID |
| `origin` | `https://giga.mobile` | Fora API origin |
| `features` | `""` | Feature flags |
| `accent` | — | Accent color |
| `bg` | — | Background color |
| `surface` | — | Surface color |
| `text` | — | Text color |
| `font` | — | Font family |
| `radius` | — | Border radius |

## License

MIT
