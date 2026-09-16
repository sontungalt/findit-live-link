import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const qrPath = resolve('qr/findit-live-link.svg');

test('provides an SVG QR source asset for the permanent live link', () => {
  assert.equal(existsSync(qrPath), true, 'QR SVG must exist');

  const svg = readFileSync(qrPath, 'utf8');
  assert.match(svg, /<svg/);
  assert.match(svg, /viewBox=/);
});
