import type { CollectionConfig } from '../../../../src/collections/config/types';

export const postsSlug = 'posts';

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  fields: [
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'mediaUrl',
      type: 'text',
    },
  ],
  hooks: {
    afterRead: [
      ({ req, doc }) => {
        if (!req.query?.testHook) {
          return doc;
        }

        // eslint-disable-next-line
        console.log('Doc JSON in hook:', JSON.stringify(doc, undefined, 2));

        const mediaUrl = doc.content[0].value.url;

        return {
          ...doc,
          mediaUrl,
        };
      },
    ],
  },
};
