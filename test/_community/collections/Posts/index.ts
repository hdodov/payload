import type { CollectionConfig } from '../../../../src/collections/config/types';

export const postsSlug = 'posts';

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
    },
  ],
  hooks: {
    afterRead: [
      function ({ req, doc }) {
        if (!req.query?.testHook) {
          return doc;
        }

        const mediaUrl = doc.content[0].value.url;
        if (!mediaUrl) {
          console.log('Media URL missing:', JSON.stringify(doc, undefined, 2));
        }
        return {
          content: [
            {
              mediaUrl,
            },
          ],
        };
      },
    ],
  },
};
