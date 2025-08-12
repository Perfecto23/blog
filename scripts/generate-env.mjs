#!/usr/bin/env node
/*
 * Generate .env templates after pnpm install
 * - Always (re)write .env.example with the latest required keys
 * - Create .env.local if missing by copying the example
 * - If .env.local exists, append any missing keys without overwriting existing values
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const ENV_EXAMPLE = resolve(ROOT, '.env.example');
const ENV_LOCAL = resolve(ROOT, '.env.local');

const REQUIRED_KEYS = [
  'FEISHU_APP_ID',
  'FEISHU_APP_SECRET',
  'FEISHU_SPACE_ID',
  'ARK_API_KEY',
  'NEXT_PUBLIC_GA_ID',
  'NEXT_PUBLIC_SITE_URL',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'FORCE_UPSTASH',
];

const TEMPLATE_HEADER = `# .env template for local development\n# Fill in all required keys. Do NOT commit real secrets.\n`;
const TEMPLATE_BODY = [
  `\n# Public base URL (must match your production domain, e.g., via Cloudflare)`,
  `NEXT_PUBLIC_SITE_URL=`,
  `\n# AI summary (Volcengine Ark)`,
  `ARK_API_KEY=`,
  `\n# Google Analytics (GA4 measurement ID)`,
  `NEXT_PUBLIC_GA_ID=`,
  `\n# Upstash Redis (required in production)`,
  `UPSTASH_REDIS_REST_URL=`,
  `UPSTASH_REDIS_REST_TOKEN=`,
  `\n# Feishu (used by GitHub Actions; local is optional)`,
  `FEISHU_APP_ID=`,
  `FEISHU_APP_SECRET=`,
  `FEISHU_SPACE_ID=`,
  `# Force using Upstash in local dev (default off)`,
  `FORCE_UPSTASH=`,
].join('\n');

const EXAMPLE_CONTENT = `${TEMPLATE_HEADER}${TEMPLATE_BODY}\n`;

function parseEnv(content) {
  const map = new Map();
  content
    .split(/\r?\n/)
    .map(line => line.trim())
    .forEach(line => {
      if (!line || line.startsWith('#')) return;
      const clean = line.startsWith('export ') ? line.slice(7) : line;
      const eq = clean.indexOf('=');
      if (eq === -1) return;
      const key = clean.slice(0, eq).trim();
      const value = clean.slice(eq + 1);
      if (key) map.set(key, value);
    });
  return map;
}

function ensureDir(filePath) {
  const dir = dirname(filePath);
  mkdirSync(dir, { recursive: true });
}

function writeExample() {
  ensureDir(ENV_EXAMPLE);
  writeFileSync(ENV_EXAMPLE, EXAMPLE_CONTENT, 'utf8');
  console.log('[env] Wrote .env.example');
}

function createOrUpdateLocal() {
  if (!existsSync(ENV_LOCAL)) {
    writeFileSync(ENV_LOCAL, EXAMPLE_CONTENT, 'utf8');
    console.log('[env] Created .env.local from template');
    return;
  }
  const existing = readFileSync(ENV_LOCAL, 'utf8');
  const map = parseEnv(existing);
  const missing = REQUIRED_KEYS.filter(k => !map.has(k));
  if (missing.length === 0) {
    console.log('[env] .env.local exists with all required keys');
    return;
  }
  const appendLines = ['\n# Added missing keys'];
  for (const key of missing) appendLines.push(`${key}=`);
  writeFileSync(ENV_LOCAL, existing + '\n' + appendLines.join('\n') + '\n', 'utf8');
  console.log(`[env] Appended missing keys to .env.local: ${missing.join(', ')}`);
}

try {
  writeExample();
  createOrUpdateLocal();
} catch (err) {
  console.error('[env] Failed to generate env templates:', err?.message || err);
  // Do not fail installation on CI/local if file ops fail
}
