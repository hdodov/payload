import type { CollectionConfig } from '../../../../src/collections/config/types';

export const postsSlug = 'posts';

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  versions: {
    maxPerDoc: 0,
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: 'content',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
    },
  ],
};
