#!/usr/bin/env node
/**
 * Installs the lowest version of every required peer dependency allowed by
 * package.json, without saving, so `npm run typecheck` then proves the
 * library compiles against the oldest setup it claims to support.
 *
 * The dev dependencies (Jest and Babel presets, react-dom) stay pinned to the
 * newest React Native, so their peer ranges cannot be satisfied at the same
 * time: this one install opts out of strict peer resolution. The `native`
 * Jest project is not run on the minimum, because `@react-native/jest-preset`
 * is only published from React Native 0.85.
 *
 * Usage (CI, or a throwaway checkout): node scripts/install-min-peers.mjs
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { minimumPeerSpecs } from './shared/peerRanges.mjs';

const { peerDependencies, peerDependenciesMeta } = JSON.parse(readFileSync('package.json', 'utf8'));
const specs = minimumPeerSpecs(peerDependencies, peerDependenciesMeta);
/* npm is a .cmd shim on Windows; execFileSync without a shell needs the full name. */
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

console.log(`Installing minimum peers: ${specs.join(', ')}`);
execFileSync(NPM, ['install', '--no-save', '--legacy-peer-deps', ...specs], { stdio: 'inherit' });
