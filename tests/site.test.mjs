import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const pagePath = resolve('index.html');

test('publishes a usable FindIt starter page at the Pages root', () => {
  assert.equal(existsSync(pagePath), true, 'index.html must exist');

  const page = readFileSync(pagePath, 'utf8');
  assert.match(page, /FindIt/);
  assert.match(page, /This link is live/);
});
