import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const pagePath = resolve('index.html');

test('publishes the recovered simple FindItApp at the Pages root', () => {
  assert.equal(existsSync(pagePath), true, 'index.html must exist');

  const page = readFileSync(pagePath, 'utf8');
  assert.match(page, /FindIt/);
  assert.match(page, /Browse/);
  assert.match(page, /Post/);
  assert.match(page, /My stuff/);
  assert.match(page, /Settings/);
  assert.match(page, /New Found Item/);
});
