export const CATEGORIES = [
  'All',
  'Bottle',
  'Stationery',
  'Electronics',
  'Clothing',
  'Household',
  'Sporting Goods',
  'Other',
];

export const POST_CATEGORIES = CATEGORIES.filter((category) => category !== 'All');

export function filterPosts(posts, category) {
  return category === 'All' ? posts : posts.filter((post) => post.category === category);
}

export function canSavePost(post) {
  return Boolean(post?.title?.trim());
}

export function newPost(number) {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `post-${Date.now()}-${number}`,
    title: `New Found Item ${number}`,
    category: 'Other',
    foundLocation: 'Unknown location',
    foundDate: new Date().toISOString().slice(0, 10),
    description: 'Add a short description so the owner can identify it.',
  };
}
