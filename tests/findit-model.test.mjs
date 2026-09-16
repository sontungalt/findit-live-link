import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const modelPath = resolve('lib/findit.js');

test('filters posts by the selected SwiftUI category', async () => {
  assert.equal(existsSync(modelPath), true, 'FindIt model must exist');

  const { filterPosts } = await import('../lib/findit.js');
  const posts = [
    { id: 'bottle', category: 'Bottle' },
    { id: 'other', category: 'Other' },
  ];

  assert.deepEqual(filterPosts(posts, 'Bottle'), [posts[0]]);
  assert.deepEqual(filterPosts(posts, 'All'), posts);
});

test('creates the SwiftUI default and rejects an empty title', async () => {
  assert.equal(existsSync(modelPath), true, 'FindIt model must exist');

  const { canSavePost, newPost } = await import('../lib/findit.js');

  assert.equal(newPost(3).title, 'New Found Item 3');
  assert.equal(newPost(3).category, 'Other');
  assert.equal(canSavePost({ title: '  ' }), false);
  assert.equal(canSavePost({ title: 'Blue water bottle' }), true);
});
