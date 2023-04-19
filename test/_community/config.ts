import nestedDocs from '@payloadcms/plugin-nested-docs';
import { buildConfig } from '../buildConfig';
import { PostsCollection, postsSlug } from './collections/Posts';
import { MenuGlobal } from './globals/Menu';
import { devUser } from '../credentials';
import { Post } from './payload-types';

export default buildConfig({
  // ...extend config here
  collections: [
    PostsCollection,
    // ...add more collections here
  ],
  globals: [
    MenuGlobal,
    // ...add more globals here
  ],
  plugins: [
    nestedDocs({
      collections: ['posts'],
      generateLabel: (_, doc) => (doc as any).text,
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
  ],

  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    });

    let prev: Post;

    for (let i = 0; i < 5; i += 1) {
      // eslint-disable-next-line
      const post = await payload.create({
        collection: postsSlug,
        data: {
          text: `post ${i}`,
          slug: `p${i}`,
          parent: prev ? prev.id : undefined,
        },
      });

      prev = post;
    }
  },
});
