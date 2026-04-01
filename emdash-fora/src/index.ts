/**
 * emdash-fora — Fora comments plugin for EmDash CMS.
 *
 * Provides a sandboxed plugin that injects Fora's embeddable comment system
 * into EmDash post pages. Runs in a Worker isolate with declared capabilities.
 *
 * Usage in emdash.config.ts:
 *
 *   import { definePlugin } from 'emdash';
 *   import { foraPlugin } from 'emdash-fora';
 *
 *   export default () => foraPlugin({
 *     siteKey: 'your-fora-site-key',
 *   });
 *
 * Or as part of a multi-plugin config:
 *
 *   import { definePlugin } from 'emdash';
 *   import { foraPlugin } from 'emdash-fora';
 *
 *   export default () => [
 *     foraPlugin({ siteKey: 'your-fora-site-key', theme: 'dark' }),
 *     // ...other plugins
 *   ];
 */

import { definePlugin } from 'emdash';

export interface ForaPluginOptions {
  /** Your Fora site key (required) */
  siteKey: string;
  /** Theme: 'auto' | 'light' | 'dark' — defaults to 'auto' */
  theme?: 'auto' | 'light' | 'dark';
  /** Fora API origin — defaults to https://giga.mobile */
  origin?: string;
  /** Comma-separated feature flags */
  features?: string;
  /** Accent color override (CSS value) */
  accent?: string;
  /** Background color override (CSS value) */
  bg?: string;
  /** Surface color override (CSS value) */
  surface?: string;
  /** Text color override (CSS value) */
  text?: string;
  /** Font family override */
  font?: string;
  /** Border radius override (CSS value) */
  radius?: string;
  /** Container element ID — defaults to 'fora-comments' */
  containerId?: string;
  /** Content collections to enable comments on — defaults to ['posts'] */
  collections?: string[];
}

export function foraPlugin(options: ForaPluginOptions) {
  const {
    siteKey,
    theme = 'auto',
    origin = 'https://giga.mobile',
    features = '',
    accent,
    bg,
    surface,
    text,
    font,
    radius,
    containerId = 'fora-comments',
    collections = ['posts'],
  } = options;

  if (!siteKey) {
    throw new Error('[emdash-fora] siteKey is required');
  }

  return definePlugin({
    id: 'fora-comments',
    version: '0.1.0',
    description: 'Fora embeddable comments for EmDash',

    capabilities: [
      'read:content',
      `network:${new URL(origin).hostname}`,
    ],

    settings: {
      siteKey: { type: 'string', default: siteKey, label: 'Fora Site Key' },
      theme: { type: 'select', default: theme, options: ['auto', 'light', 'dark'], label: 'Theme' },
      origin: { type: 'string', default: origin, label: 'Fora API Origin' },
      features: { type: 'string', default: features, label: 'Feature Flags' },
      accent: { type: 'string', default: accent || '', label: 'Accent Color' },
      bg: { type: 'string', default: bg || '', label: 'Background Color' },
      surface: { type: 'string', default: surface || '', label: 'Surface Color' },
      text: { type: 'string', default: text || '', label: 'Text Color' },
      font: { type: 'string', default: font || '', label: 'Font Family' },
      radius: { type: 'string', default: radius || '', label: 'Border Radius' },
    },

    hooks: {
      'content:afterRender': async (event, ctx) => {
        if (!collections.includes(event.collection)) return;

        const settings = await ctx.plugin.getSettings();

        const attrs: Record<string, string> = {
          'data-site-key': settings.siteKey || siteKey,
          'data-page-id': event.content.slug || event.content.id,
          'data-page-title': event.content.title || '',
          'data-page-url': event.content.url || '',
          'data-theme': settings.theme || theme,
          'data-container-id': containerId,
        };

        // Optional theming overrides
        const themeKeys = ['features', 'accent', 'bg', 'surface', 'text', 'font', 'radius'] as const;
        for (const key of themeKeys) {
          const val = settings[key] || options[key];
          if (val) attrs[`data-${key}`] = val;
        }

        const attrStr = Object.entries(attrs)
          .map(([k, v]) => `${k}="${escapeHtml(v)}"`)
          .join(' ');

        const scriptOrigin = settings.origin || origin;

        return {
          inject: {
            position: 'afterContent',
            html: `<div id="${containerId}"></div>\n<script src="${escapeHtml(scriptOrigin)}/embed.js" ${attrStr}></script>`,
          },
        };
      },
    },

    adminPages: [
      {
        id: 'fora-comments',
        label: 'Comments',
        icon: '💬',
        component: 'ForaDashboard',
      },
    ],

    dashboardWidgets: [
      {
        id: 'fora-comment-count',
        label: 'Recent Comments',
        size: 'small',
        async render(_ctx) {
          try {
            const res = await fetch(
              `${origin}/api/embed/count?site_key=${encodeURIComponent(siteKey)}`
            );
            if (res.ok) {
              const data = await res.json();
              return {
                html: `<div style="text-align:center;padding:1rem">
                  <div style="font-size:2.5rem;font-weight:700">${data.count ?? 0}</div>
                  <div style="opacity:0.6">Total Comments</div>
                  <a href="https://giga.mobile" target="_blank" style="font-size:0.8rem">Powered by Fora</a>
                </div>`,
              };
            }
          } catch {
            // Widget is best-effort
          }
          return { html: '<div style="text-align:center;padding:1rem;opacity:0.4">Comments unavailable</div>' };
        },
      },
    ],
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Re-export the Astro component for direct use
export { default as ForaComments } from './ForaComments.astro';
export type { Props as ForaCommentsProps } from './ForaComments.astro';
