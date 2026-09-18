# Simple FindItApp Web Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the public landing page with a browser implementation of the recovered simple SwiftUI FindItApp.

**Architecture:** Model the recovered SwiftUI app’s in-memory lost-and-found posts with small dependency-free JavaScript helpers, then render Browse, Post, My Stuff, and Settings from a single responsive static page. Posts are deliberately browser-local, matching the native app’s `@State`-only storage; there is no login or shared backend to invent.

**Tech Stack:** HTML, CSS, browser-native ES modules, Node’s built-in test runner, GitHub Pages.

### Task 1: Define the post model and filtering rules

**Files:**
- Create: `lib/findit.js`
- Create: `tests/findit-model.test.mjs`

**Step 1: Write the failing test**

```js
assert.deepEqual(filterPosts(posts, 'Bottle'), [posts[0]]);
assert.equal(newPost(3).title, 'New Found Item 3');
assert.equal(canSavePost({ title: '  ' }), false);
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/findit-model.test.mjs`

Expected: FAIL because `lib/findit.js` does not exist.

**Step 3: Write minimal implementation**

Export the categories from the SwiftUI app, a category filter, `newPost(number)`, and title validation.

**Step 4: Run test to verify it passes**

Run: `node --test tests/findit-model.test.mjs`

Expected: PASS.

**Step 5: Commit**

```bash
git add lib/findit.js tests/findit-model.test.mjs
git commit -m "feat: add FindIt post model"
```

### Task 2: Replace the landing page with the simple FindItApp UI

**Files:**
- Modify: `index.html`
- Create: `app.js`
- Modify: `tests/site.test.mjs`
- Create: `tests/simple-finditapp-page.test.mjs`

**Step 1: Write the failing tests**

```js
assert.match(page, /Browse/);
assert.match(page, /Post/);
assert.match(page, /My stuff/);
assert.match(page, /Settings/);
assert.match(page, /New Found Item/);
assert.match(readFileSync(resolve('app.js'), 'utf8'), /filterPosts/);
```

**Step 2: Run tests to verify they fail**

Run: `node --test tests/site.test.mjs tests/simple-finditapp-page.test.mjs`

Expected: FAIL because the landing page does not contain the app’s controls and `app.js` does not exist.

**Step 3: Write minimal implementation**

Build accessible, responsive four-tab browser UI that mirrors the SwiftUI source:

- Browse category chips and list filtering
- Post list, add-item dialog, validation, editing, and deletion
- My Stuff using the same post collection
- Settings placeholder text

Keep posts only in page memory, matching the original app’s `@State` lifecycle.

**Step 4: Run tests to verify they pass**

Run: `node --test tests/site.test.mjs tests/simple-finditapp-page.test.mjs`

Expected: PASS.

**Step 5: Commit**

```bash
git add index.html app.js tests/site.test.mjs tests/simple-finditapp-page.test.mjs
git commit -m "feat: port simple FindItApp to web"
```

### Task 3: Publish and verify the actual app

**Files:**
- Modify: `README.md`

**Step 1: Document app behavior**

Explain that the deployed browser app matches the recovered SwiftUI tabs and that a browser refresh clears posts, just as the Xcode app starts with empty `@State`.

**Step 2: Run full verification**

Run: `node --test tests/*.test.mjs`

Expected: PASS.

**Step 3: Deploy**

Fast-forward `feat/simple-findit-web` into `live`, push `live`, and confirm the GitHub Pages build reports `built`.

**Step 4: Commit**

```bash
git add README.md docs/plans/2026-09-16-simple-finditapp-web.md
git commit -m "docs: describe simple FindItApp web version"
```
