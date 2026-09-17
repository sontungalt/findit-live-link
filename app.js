import { CATEGORIES, POST_CATEGORIES, canSavePost, filterPosts, newPost } from './lib/findit.js';

const screen = document.querySelector('#screen');
const tabs = [...document.querySelectorAll('[data-tab]')];
const dialog = document.querySelector('#post-dialog');
const form = document.querySelector('#post-form');
const saveButton = document.querySelector('#save-post');
const cancelButton = document.querySelector('#cancel-post');

const state = {
  activeTab: 'browse',
  selectedCategory: 'All',
  posts: [],
  editMode: false,
  editingId: null,
  draft: null,
};

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
})[character]);

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(`${date}T12:00:00`));
}

function emptyState(title, message) {
  return `<div class="empty-state"><strong>${title}</strong><span>${message}</span></div>`;
}

function postCard(post, { editable = false, showDelete = false } = {}) {
  const actions = showDelete
    ? `<div class="item-card__actions"><button class="button button--danger" type="button" data-action="delete" data-id="${post.id}">Delete</button></div>`
    : '';
  const content = `
    <div class="item-card__header"><span class="item-card__title">${escapeHtml(post.title)}</span></div>
    <p class="item-card__description">${escapeHtml(post.description)}</p>
    <div class="item-card__meta"><span>${escapeHtml(post.category)}</span><span class="meta-dot">${escapeHtml(post.foundLocation)}</span><span class="meta-dot">${formatDate(post.foundDate)}</span></div>${actions}`;

  return editable
    ? `<button class="item-card" type="button" data-action="edit" data-id="${post.id}">${content}</button>`
    : `<article class="item-card">${content}</article>`;
}

function renderBrowse() {
  const posts = filterPosts(state.posts, state.selectedCategory);
  return `
    <section aria-labelledby="browse-heading">
      <div class="screen-title-row"><h1 id="browse-heading">Browse</h1></div>
      <div class="category-scroller" aria-label="Filter by category">${CATEGORIES.map((category) => `
        <button class="chip" type="button" data-category="${category}" aria-pressed="${state.selectedCategory === category}">${category}</button>`).join('')}</div>
      <div class="list">${posts.length ? posts.map((post) => postCard(post)).join('') : emptyState('No found items yet', 'Be the first to post a found item.')}</div>
    </section>`;
}

function renderPost() {
  const controls = state.editMode
    ? `<button class="button button--secondary" type="button" data-action="toggle-edit">Done</button>`
    : `<button class="button button--secondary" type="button" data-action="toggle-edit">Edit</button>`;
  return `
    <section aria-labelledby="post-heading">
      <div class="screen-title-row"><h1 id="post-heading">Post/Found Items</h1><div class="toolbar">${controls}<button class="button" type="button" data-action="new-post">+ Add item</button></div></div>
      <div class="list">${state.posts.length
        ? state.posts.map((post) => postCard(post, { editable: !state.editMode, showDelete: state.editMode })).join('')
        : emptyState('No posts yet', 'Use Add item to create your first found-item post.')}</div>
    </section>`;
}

function renderMyStuff() {
  return `
    <section aria-labelledby="my-stuff-heading">
      <div class="screen-title-row"><h1 id="my-stuff-heading">My stuff</h1></div>
      <div class="list">${state.posts.length
        ? state.posts.map((post) => postCard(post, { editable: true })).join('')
        : emptyState('Nothing here yet', 'Posts you create appear in My stuff.')}</div>
    </section>`;
}

function renderSettings() {
  return `<section aria-labelledby="settings-heading"><div class="screen-title-row"><h1 id="settings-heading">Settings</h1></div><p class="settings-copy">Settings Screen Content</p></section>`;
}

function render() {
  const view = {
    browse: renderBrowse,
    post: renderPost,
    'my-stuff': renderMyStuff,
    settings: renderSettings,
  }[state.activeTab];
  screen.innerHTML = view();
  tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.tab === state.activeTab)));
}

function fillForm(post) {
  form.elements.title.value = post.title;
  form.elements.category.innerHTML = POST_CATEGORIES.map((category) => `<option value="${category}">${category}</option>`).join('');
  form.elements.category.value = post.category;
  form.elements.foundLocation.value = post.foundLocation;
  form.elements.foundDate.value = post.foundDate;
  form.elements.description.value = post.description;
  saveButton.disabled = !canSavePost(post);
}

function openPostDialog(post) {
  state.editingId = post?.id ?? null;
  state.draft = post ? { ...post } : newPost(state.posts.length + 1);
  document.querySelector('#post-dialog-title').textContent = post ? 'Details' : 'New Found Item';
  fillForm(state.draft);
  dialog.showModal();
  form.elements.title.focus();
}

function closePostDialog() {
  state.editingId = null;
  state.draft = null;
  dialog.close();
}

tabs.forEach((tab) => tab.addEventListener('click', () => {
  state.activeTab = tab.dataset.tab;
  render();
  screen.focus();
}));

screen.addEventListener('click', (event) => {
  const category = event.target.closest('[data-category]');
  if (category) {
    state.selectedCategory = category.dataset.category;
    render();
    return;
  }

  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const { action, id } = actionButton.dataset;

  if (action === 'new-post') openPostDialog();
  if (action === 'toggle-edit') {
    state.editMode = !state.editMode;
    render();
  }
  if (action === 'edit') openPostDialog(state.posts.find((post) => post.id === id));
  if (action === 'delete') {
    state.posts = state.posts.filter((post) => post.id !== id);
    render();
  }
});

form.addEventListener('input', () => {
  saveButton.disabled = !canSavePost({ title: form.elements.title.value });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  if (!canSavePost(values)) return;

  const post = { ...state.draft, ...values, title: values.title.trim() };
  state.posts = state.editingId
    ? state.posts.map((existingPost) => existingPost.id === state.editingId ? post : existingPost)
    : [...state.posts, post];
  closePostDialog();
  render();
});

cancelButton.addEventListener('click', closePostDialog);
render();
