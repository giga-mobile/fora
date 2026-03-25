/**
 * @fora/eleventy-plugin-fora
 *
 * Eleventy plugin for embedding Fora comments.
 *
 * Usage in .eleventy.js:
 *   const foraPlugin = require('@fora/eleventy-plugin-fora');
 *   eleventyConfig.addPlugin(fororaPlugin, { siteKey: 'your-site-key' });
 *
 * Usage in templates (Nunjucks/Liquid):
 *   {{ foraComments() }}
 *   {{ foraComments({ theme: 'dark', accent: '#8b5cf6' }) }}
 *
 * Shortcode usage:
 *   {% foraComments %}
 *   {% foraComments "dark" %}
 */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildForaEmbed(options) {
  const siteKey = options.siteKey || options.site_key || '';
  const pageId = options.pageId || options.page_id || '';
  const pageTitle = options.pageTitle || options.page_title || '';
  const theme = options.theme || 'auto';
  const containerId = options.containerId || options.container_id || 'fora-comments';
  const origin = options.origin || 'https://giga.mobile';
  const features = options.features || '';

  if (!siteKey) {
    return '<!-- Fora: siteKey is required -->';
  }

  let attrs = `data-site-key="${escapeHtml(siteKey)}"`;
  if (pageId) attrs += ` data-page-id="${escapeHtml(pageId)}"`;
  if (pageTitle) attrs += ` data-page-title="${escapeHtml(pageTitle)}"`;
  attrs += ` data-theme="${escapeHtml(theme)}"`;
  attrs += ` data-container-id="${escapeHtml(containerId)}"`;
  if (features) attrs += ` data-features="${escapeHtml(features)}"`;

  // Theming overrides
  const themeKeys = ['accent', 'bg', 'surface', 'text', 'font', 'radius'];
  for (const key of themeKeys) {
    const val = options[key];
    if (val) attrs += ` data-${key}="${escapeHtml(val)}"`;
  }

  return `<div id="${escapeHtml(containerId)}"></div>\n<script src="${escapeHtml(origin)}/embed.js" ${attrs}></script>`;
}

module.exports = function (eleventyConfig, pluginOptions = {}) {
  const defaultSiteKey = pluginOptions.siteKey || pluginOptions.site_key || '';
  const defaultOrigin = pluginOptions.origin || 'https://giga.mobile';

  // Nunjucks shortcode
  eleventyConfig.addNunjucksShortcode('foraComments', function (options = {}) {
    if (typeof options === 'string') {
      options = { theme: options };
    }
    return buildForaEmbed({
      siteKey: defaultSiteKey,
      origin: defaultOrigin,
      ...options
    });
  });

  // Liquid shortcode
  eleventyConfig.addLiquidShortcode('foraComments', function (theme) {
    return buildForaEmbed({
      siteKey: defaultSiteKey,
      origin: defaultOrigin,
      theme: typeof theme === 'string' ? theme : 'auto'
    });
  });

  // JavaScript template shortcode
  eleventyConfig.addJavaScriptFunction('foraComments', function (options = {}) {
    return buildForaEmbed({
      siteKey: defaultSiteKey,
      origin: defaultOrigin,
      ...options
    });
  });
};
