import { buildConfig } from '../buildConfig';
import { PostsCollection, postsSlug } from './collections/Posts';
import { MenuGlobal } from './globals/Menu';
import { devUser } from '../credentials';
import { CategoriesCollection } from './collections/Categories';

export default buildConfig({
  // ...extend config here
  collections: [
    CategoriesCollection,
    PostsCollection,
    // ...add more collections here
  ],
  globals: [
    MenuGlobal,
    // ...add more globals here
  ],
  graphQL: {
    schemaOutputFile: './test/_community/schema.graphql',
  },

  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    });

    const childCategory = await payload.create({
      collection: 'categories',
      data: {
        title: 'Child Category',
      },
    });

    await payload.create({
      collection: 'categories',
      data: {
        title: 'Parent Category',
        subcategories: [childCategory.id],
      },
    });

    await payload.create({
      collection: postsSlug,
      data: {
        text: 'example post',
        category: childCategory.id,
      },
    });
  },
});
