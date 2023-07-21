import type { CollectionConfig } from '../../../../src/collections/config/types';
import { categorySlug } from '../Categories';

export const postsSlug = 'posts';

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: categorySlug,
    },
    {
      name: 'parentCategory',
      type: 'relationship',
      relationTo: categorySlug,
      hasMany: false,
      hooks: {
        beforeChange: [({ siblingData }) => {
          // eslint-disable-next-line
          delete siblingData.parentCategory;
        }],
        afterRead: [async ({ req, data }) => {
          if (!data.category) {
            return null;
          }

          const parent = await req.payload.find({
            collection: categorySlug,
            depth: 0,
            where: {
              subcategories: {
                in: data.category,
              },
            },
          });

          return parent.docs[0]?.id;
        }],
      },
    },
  ],
};
