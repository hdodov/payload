import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import payload from '../../src';
import { initPayloadTest } from '../helpers/configHelpers';
import { devUser } from '../credentials';
import { postsSlug } from './collections/Posts';

require('isomorphic-fetch');

let apiUrl;
let jwt;

const headers = {
  'Content-Type': 'application/json',
};
const { email, password } = devUser;
describe('populating relationships in richtext fields', () => {
  beforeAll(async () => {
    const { serverURL } = await initPayloadTest({ __dirname, init: { local: false } });
    apiUrl = `${serverURL}/api`;

    const response = await fetch(`${apiUrl}/users/login`, {
      body: JSON.stringify({
        email,
        password,
      }),
      headers,
      method: 'post',
    });

    const data = await response.json();
    jwt = data.token;

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
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await payload.mongoMemoryServer.stop();
  });

  it('populates GraphQL query', async () => {
    const gql = String.raw;
    const query = gql`{
      Posts { docs { mediaUrl } }
    }`;

    const json = await fetch(`${apiUrl}/graphql?testHook=1`, {
      method: 'POST',
      headers: {
        ...headers,
        Authorization: `JWT ${jwt}`,
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());

    console.log('GraphQL JSON:', JSON.stringify(json, undefined, 2)); // eslint-disable-line
    expect(json.data.Posts.docs[0].mediaUrl).not.toBeNull();
  });

  it('populates REST query', async () => {
    const json = await fetch(`${apiUrl}/${postsSlug}?testHook=1`, {
      method: 'GET',
      headers: {
        ...headers,
        Authorization: `JWT ${jwt}`,
      },
    }).then((res) => res.json());

    console.log('REST JSON:', JSON.stringify(json, undefined, 2)); // eslint-disable-line
    expect(json.docs[0].mediaUrl).not.toBeUndefined();
  });
});
