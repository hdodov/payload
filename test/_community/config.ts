import { readFile } from 'fs/promises';
import { buildConfig } from '../buildConfig';
import { PostsCollection, postsSlug } from './collections/Posts';
import { MenuGlobal } from './globals/Menu';
import { devUser } from '../credentials';
import { MediaCollection } from './collections/Media';

export default buildConfig({
  // ...extend config here
  collections: [
    PostsCollection,
    MediaCollection,
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

    const buffer = await readFile(`${__dirname}/test.png`);

    const media = await payload.create({
      collection: 'media',
      file: {
        data: buffer,
        name: 'test.png',
        mimetype: 'image/png',
        size: buffer.byteLength,
      },
      data: {},
    });

    await payload.create({
      collection: postsSlug,
      data: {
        text: 'example post',
        content: [
          {
            children: [
              {
                text: '',
              },
            ],
            type: 'upload',
            value: {
              id: media.id,
            },
            relationTo: 'media',
          },
        ],
      },
    });

    (async () => {
      const gql = String.raw;
      const query = gql`{
        Posts { docs { content(depth: 1) } }
      }`;

      const res = await fetch('http://localhost:3000/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const json = await res.json();

      console.log('GraphQL result:', JSON.stringify(json, undefined, 2));
    })();
  },
});
