import type { CollectionConfig } from '../../../../src/collections/config/types';
import { mediaSlug } from '../Media';

export const postsSlug = 'posts';

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
};
