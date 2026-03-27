#!/usr/bin/env node

/**
 * create-fora / fora CLI
 * Quickstart for embedding Fora comments on any site.
 *
 * Usage:
 *   npx create-fora              Instant (free, anonymous)
 *   npx create-fora --login      Authenticated setup
 *   npx fora login               Log in to your account
 *   npx fora status              Show account and site info
 */

const API_BASE = process.env.FORA_API || 'https://giga.mobile';
const TOKEN_FILE = '.fora-token';

import { createInterface } from 'node:readline';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

// ── Helpers ──

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, answer => { rl.close(); resolve(answer.trim()); }));
}

function promptSelect(question, options) {
  console.log(question);
  options.forEach((opt, i) => console.log(`  ${i + 1}) ${opt.label}`));
  return prompt('Choose (number): ').then(answer => {
    const idx = parseInt(answer, 10) - 1;
    return options[idx] || options[0];
  });
}

function getTokenPath() {
  return join(homedir(), '.fora-token');
}

function loadToken() {
  try {
    return readFileSync(getTokenPath(), 'utf8').trim();
  } catch {
    return null;
  }
}

function saveToken(token) {
  writeFileSync(getTokenPath(), token, { mode: 0o600 });
}

async function apiCall(path, options = {}) {
  const token = loadToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Cookie'] = `tenant_session=${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function detectFramework() {
  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (deps.astro) return 'astro';
    if (deps['@11ty/eleventy']) return '11ty';
    if (deps.next) return 'nextjs';
    if (deps.react && !deps.next) return 'react';
    if (deps.vue || deps.nuxt) return 'vue';
    if (deps.svelte || deps['@sveltejs/kit']) return 'svelte';
    if (deps.hugo) return 'hugo';
  } catch {}
  // Haskell/Hakyll detection
  try {
    if (existsSync('hakyll-site.cabal') || existsSync('stack.yaml')) return 'hakyll';
    const cabalFiles = readdirSync('.').filter(f => f.endsWith('.cabal'));
    if (cabalFiles.length > 0) return 'hakyll';
  } catch {}
  return 'html';
}

function frameworkLabel(fw) {
  const labels = {
    astro: 'Astro', nextjs: 'Next.js', hugo: 'Hugo', jekyll: 'Jekyll', hakyll: 'Hakyll',
    '11ty': 'Eleventy (11ty)', react: 'React', vue: 'Vue', svelte: 'Svelte', html: 'Plain HTML'
  };
  return labels[fw] || fw;
}

// ── Auth Commands ──

async function cmdLogin() {
  console.log('\n📮 Fora Login\n');

  const email = await prompt('Enter your email: ');
  if (!email || !email.includes('@')) {
    console.error('❌ Invalid email');
    process.exit(1);
  }

  const { ok, data } = await apiCall('/api/auth/magic-link/request', {
    method: 'POST',
    body: JSON.stringify({ email })
  });

  if (!ok) {
    console.error(`❌ ${data.error || 'Failed to send login link'}`);
    process.exit(1);
  }

  console.log(`\n✅ Login link sent to ${email}`);
  console.log('   Check your email and click the link.\n');

  const token = await prompt('Paste the session token from the link URL (or press Enter to skip): ');
  if (token) {
    saveToken(token);
    console.log('✅ Logged in!\n');
  } else {
    console.log('   Run `npx fora login` again after clicking the link.\n');
  }
}

// ── Quickstart: Anonymous (default — instant, no auth) ──

async function cmdQuickstartAnon() {
  console.log('\n🚀 Fora Quickstart\n');

  // Check if already logged in — give a hint
  const token = loadToken();
  if (token) {
    const { ok } = await apiCall('/api/auth/me');
    if (ok) {
      console.log('💡 Logged in. Using authenticated mode for multi-site management.\n');
      return cmdQuickstartAuth();
    }
  }

  // Detect framework from package.json
  const detected = detectFramework();
  const detectedLabel = detected !== 'html' ? ` (detected)` : '';

  // Prompts
  const name = await prompt('Site name (e.g. "My Blog"): ');
  if (!name || name.length < 2) {
    console.error('❌ Site name is required (min 2 chars)');
    process.exit(1);
  }

  const domain = await prompt('Domain (e.g. myblog.com): ');
  if (!domain) {
    console.error('❌ Domain is required');
    process.exit(1);
  }

  const frameworkOptions = [
    { label: `Astro${detected === 'astro' ? detectedLabel : ''}`, value: 'astro' },
    { label: `Next.js${detected === 'nextjs' ? detectedLabel : ''}`, value: 'nextjs' },
    { label: `Hugo${detected === 'hugo' ? detectedLabel : ''}`, value: 'hugo' },
    { label: `Jekyll${detected === 'jekyll' ? detectedLabel : ''}`, value: 'jekyll' },
    { label: `Eleventy${detected === '11ty' ? detectedLabel : ''}`, value: '11ty' },
    { label: `React${detected === 'react' ? detectedLabel : ''}`, value: 'react' },
    { label: `Vue${detected === 'vue' ? detectedLabel : ''}`, value: 'vue' },
    { label: `Svelte${detected === 'svelte' ? detectedLabel : ''}`, value: 'svelte' },
    { label: `Hakyll${detected === 'hakyll' ? detectedLabel : ''}`, value: 'hakyll' },
    { label: 'Plain HTML', value: 'html' }
  ];

  const frameworkChoice = await promptSelect('\nWhich framework?', frameworkOptions);

  // Create site (anonymous)
  console.log('\n⏳ Creating your site...\n');

  const { ok, data, status } = await apiCall('/api/embed/quickstart-anon', {
    method: 'POST',
    body: JSON.stringify({
      name,
      domain,
      framework: frameworkChoice.value
    })
  });

  if (!ok) {
    console.error(`❌ ${data.error || `Failed (${status})`}`);
    process.exit(1);
  }

  // Output
  console.log('━'.repeat(50));
  console.log(`\n✅ Site created: "${data.name}"`);
  console.log(`   Site Key: ${data.siteKey}`);
  console.log(`   Domain:   ${data.domain}`);
  console.log(`   Portal:   ${data.portalUrl}\n`);
  console.log('━'.repeat(50));
  console.log(`\n📋 Paste this into your ${frameworkLabel(frameworkChoice.value)} project:\n`);
  console.log(data.snippet);
  console.log('\n' + '━'.repeat(50));
  console.log('\n📖 Docs: https://giga.mobile/docs/hakyll');
  console.log('💡 Run "npx fora login" to enable multi-site management, billing, and team features.\n');
}

// ── Quickstart: Authenticated (for paid tiers / management) ──

async function cmdQuickstartAuth() {
  console.log('\n🚀 Fora Quickstart (Authenticated)\n');

  // Check auth
  let token = loadToken();
  if (!token) {
    console.log('First, let\'s log you in.\n');
    await cmdLogin();
    token = loadToken();
    if (!token) {
      console.error('❌ Not logged in. Run: npx fora login');
      process.exit(1);
    }
  }

  // Verify auth
  const authCheck = await apiCall('/api/auth/me');
  if (!authCheck.ok) {
    console.log('Session expired. Let\'s log in again.\n');
    await cmdLogin();
    token = loadToken();
    if (!token) {
      console.error('❌ Not logged in.');
      process.exit(1);
    }
  }

  const detected = detectFramework();

  // Gather info
  const name = await prompt('Site name (e.g. "My Blog"): ');
  if (!name || name.length < 2) {
    console.error('❌ Site name is required (min 2 chars)');
    process.exit(1);
  }

  const domain = await prompt('Domain (e.g. myblog.com): ');
  if (!domain) {
    console.error('❌ Domain is required');
    process.exit(1);
  }

  const frameworkChoice = await promptSelect('\nWhich framework?', [
    { label: `Astro${detected === 'astro' ? ' (detected)' : ''}`, value: 'astro' },
    { label: `Next.js${detected === 'nextjs' ? ' (detected)' : ''}`, value: 'nextjs' },
    { label: `Hugo${detected === 'hugo' ? ' (detected)' : ''}`, value: 'hugo' },
    { label: `Jekyll${detected === 'jekyll' ? ' (detected)' : ''}`, value: 'jekyll' },
    { label: `Eleventy${detected === '11ty' ? ' (detected)' : ''}`, value: '11ty' },
    { label: `React${detected === 'react' ? ' (detected)' : ''}`, value: 'react' },
    { label: `Vue${detected === 'vue' ? ' (detected)' : ''}`, value: 'vue' },
    { label: `Svelte${detected === 'svelte' ? ' (detected)' : ''}`, value: 'svelte' },
    { label: `Hakyll${detected === 'hakyll' ? ' (detected)' : ''}`, value: 'hakyll' },
    { label: 'Plain HTML', value: 'html' }
  ]);

  // Create site
  console.log('\n⏳ Creating your site...\n');

  const { ok, data, status } = await apiCall('/api/embed/quickstart', {
    method: 'POST',
    body: JSON.stringify({
      name,
      domain,
      framework: frameworkChoice.value
    })
  });

  if (!ok) {
    console.error(`❌ ${data.error || `Failed (${status})`}`);
    process.exit(1);
  }

  // Output
  console.log('━'.repeat(50));
  console.log(`\n✅ Site created: "${data.name}"`);
  console.log(`   Site Key: ${data.siteKey}`);
  console.log(`   Domain:   ${data.domain}`);
  console.log(`   Portal:   ${data.portalUrl}\n`);
  console.log('━'.repeat(50));
  console.log(`\n📋 Paste this into your ${frameworkLabel(frameworkChoice.value)} project:\n`);
  console.log(data.snippet);
  console.log('\n' + '━'.repeat(50));
  console.log('\n📖 Docs: https://giga.mobile/docs/hakyll');
}

// ── Status ──

async function cmdStatus() {
  const token = loadToken();
  if (!token) {
    console.log('\n❌ Not logged in. Run: npx fora login');
    console.log('   Or use a site_key to view a specific site: npx fora status <site_key>\n');
    return;
  }

  const { ok, data } = await apiCall('/api/auth/me');
  if (!ok) {
    console.log('❌ Session expired. Run: npx fora login');
    return;
  }

  console.log(`\n✅ Logged in as ${data.email || data.display_name || 'user'}`);

  const sites = await apiCall('/api/tenant/sites');
  if (sites.ok && Array.isArray(sites.data)) {
    console.log(`   Sites: ${sites.data.length}\n`);
    sites.data.forEach(s => {
      console.log(`   • ${s.name} (${s.public_key}) — ${s.plan || 'free'}`);
    });
    console.log('');
  }
}

// ── Main ──

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'init';

  switch (command) {
    case 'login':
      await cmdLogin();
      break;
    case 'init':
    case 'setup':
    case 'start':
      await cmdQuickstartAnon();
      break;
    case '--login':
    case '--auth':
      await cmdQuickstartAuth();
      break;
    case '--pro':
      console.log('\n💡 Pro setup requires payment. Run: npx fora login, then visit giga.mobile/publishers to upgrade.\n');
      await cmdQuickstartAuth();
      break;
    case 'status':
      await cmdStatus();
      break;
    case 'help':
    case '--help':
    case '-h':
      console.log(`
Fora CLI — Quickstart for embeddable comments

Usage:
  npx create-fora              Instant setup (free, anonymous)
  npx create-fora --login      Authenticated setup (for multi-site management)
  npx fora login               Log in to your account
  npx fora status              Show account and site info
  npx fora help                Show this help

Environment:
  FORA_API    API base URL (default: https://giga.mobile)
`);
      break;
    default:
      // If it starts with --, it might be a flag we don't handle
      if (command.startsWith('--')) {
        console.log(`Unknown flag: ${command}\nRun: npx fora help`);
      } else {
        console.log(`Unknown command: ${command}\nRun: npx fora help`);
      }
      process.exit(1);
  }
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
