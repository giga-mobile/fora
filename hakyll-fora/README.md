# Fora for Hakyll

Add comments to your Hakyll static site in two lines.

## Quick Start

### 1. Get your site key

```bash
npx create-fora
```

No login. No signup. Just paste and ship.

### 2. Add the template

Copy `fora-comments.html` to your templates directory:

```
cp fora-comments.html my-site/templates/
```

### 3. Include in your post template

In `templates/post.html` (or wherever you want comments):

```html
<article>
  <h1>$title$</h1>
  $body$
</article>

<!-- Fora comments -->
$partial("templates/fora-comments.html")$
```

### 4. Set your site key in site.hs

```haskell
import Hakyll

main :: IO ()
main = hakyll $ do
  match "posts/*" $ do
    route $ setExtension "html"
    compile $ pandocCompiler
      >>= loadAndApplyTemplate "templates/post.html" postContext
      >>= loadAndApplyTemplate "templates/default.html" defaultContext

postContext :: Context String
postContext =
  constField "fora-site-key" "YOUR_SITE_KEY" <>
  constField "fora-origin" "https://giga.mobile" <>
  defaultContext
```

## Programmatic Usage

For more control, use the `Fora` module:

```haskell
import Fora

postContext :: Context String
postContext =
  foraComments "YOUR_SITE_KEY" <>
  defaultContext

-- Or with custom origin and page ID:
postContext' path =
  foraCommentsWith "YOUR_SITE_KEY" "https://giga.mobile" (Just path) <>
  defaultContext
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `fora-site-key` | *(required)* | Your site key from `npx create-fora` |
| `fora-origin` | `https://giga.mobile` | Fora server URL |

## Theming

Fora auto-detects light/dark mode from your site. To override, add `data-theme` to the script tag:

```html
<script src="https://giga.mobile/embed.js"
  data-site-key="YOUR_SITE_KEY"
  data-theme="dark"
></script>
```

## License

MIT
