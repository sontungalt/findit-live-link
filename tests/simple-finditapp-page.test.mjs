import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const appPath = resolve('app.js');

test('uses the shared post collection for the SwiftUI-style tabs', () => {
  assert.equal(existsSync(appPath), true, 'browser app module must exist');

  const app = readFileSync(appPath, 'utf8');
  assert.match(app, /filterPosts/);
  assert.match(app, /newPost/);
  assert.match(app, /My stuff/);
  assert.match(app, /Settings Screen Content/);
  assert.match(app, /dialog/);
});
