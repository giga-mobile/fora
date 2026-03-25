#!/usr/bin/env node

/**
 * create-fora / fora CLI
 * Quickstart for embedding Fora comments on any site.
 *
 * Usage:
 *   npx create-fora
 *   npx create-fora@latest
 *   npx fora login
 *   npx fora init
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

// ── Commands ──

async function cmdLogin() {
  console.log('\n📮 Fora Login\n');

  const email = await prompt('Enter your email: ');
  if (!email || !email.includes('@')) {
    console.error('❌ Invalid email');
    process.exit(1);
  }

  // Request magic link
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

async function cmdInit() {
  console.log('\n🚀 Fora Quickstart\n');

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
  }

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
    { label: 'Astro', value: 'astro' },
    { label: 'Next.js', value: 'nextjs' },
    { label: 'Hugo', value: 'hugo' },
    { label: 'Jekyll', value: 'jekyll' },
    { label: 'Eleventy (11ty)', value: '11ty' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
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
  console.log(`\n📋 Paste this into your ${frameworkChoice.label} project:\n`);
  console.log(data.snippet);
  console.log('\n━'.repeat(50));
  console.log('\n📖 Docs: https://giga.mobile/docs');
  console.log('💬 Support: https://discord.gg/fora\n');
}

async function cmdStatus() {
  const token = loadToken();
  if (!token) {
    console.log('❌ Not logged in. Run: npx fora login');
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
      console.log(`   • ${s.name} (${s.public_key})`);
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
      await cmdInit();
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
  npx create-fora        Create a new site + get embed snippet
  npx fora login         Log in to your Fora account
  npx fora status        Show account and site info
  npx fora help          Show this help

Environment:
  FORA_API    API base URL (default: https://giga.mobile)
`);
      break;
    default:
      console.log(`Unknown command: ${command}\nRun: npx fora help`);
      process.exit(1);
  }
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
