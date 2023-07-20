import type { CollectionConfig } from '../../../../src/collections/config/types';

export const categorySlug = 'categories';

export const CategoriesCollection: CollectionConfig = {
  slug: categorySlug,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'subcategories',
      type: 'relationship',
      relationTo: categorySlug,
      hasMany: true,
    },
  ],
};
