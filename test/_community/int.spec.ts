import mongoose from 'mongoose';
import payload from '../../src';
import { initPayloadTest } from '../helpers/configHelpers';
import { devUser } from '../credentials';
import { postsSlug } from './collections/Posts';

require('isomorphic-fetch');

let apiUrl;
let jwt;
let postId;
let parentCategoryId;

const headers = {
  'Content-Type': 'application/json',
};
const { email, password } = devUser;
describe('_Community Tests', () => {
  // --__--__--__--__--__--__--__--__--__
  // Boilerplate test setup/teardown
  // --__--__--__--__--__--__--__--__--__
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

    const childCategory = await payload.create({
      collection: 'categories',
      data: {
        title: 'Child Category',
      },
    });

    const parentCategory = await payload.create({
      collection: 'categories',
      data: {
        title: 'Parent Category',
        subcategories: [childCategory.id],
      },
    });

    const post = await payload.create({
      collection: postsSlug,
      data: {
        text: 'example post',
        category: childCategory.id,
      },
    });

    postId = post.id;
    parentCategoryId = parentCategory.id;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await payload.mongoMemoryServer.stop();
  });

  // --__--__--__--__--__--__--__--__--__
  // You can run tests against the local API or the REST API
  // use the tests below as a guide
  // --__--__--__--__--__--__--__--__--__

  it('populates category in REST query', async () => {
    const post = await fetch(`${apiUrl}/${postsSlug}/${postId}`, {
      method: 'GET',
      headers: {
        ...headers,
        Authorization: `JWT ${jwt}`,
      },
    }).then((res) => res.json());

    console.log('REST response JSON:', JSON.stringify(post, undefined, 2)); // eslint-disable-line
    expect(post.parentCategory?.id).toEqual(parentCategoryId);
  });

  it('populates category in GraphQL query', async () => {
    const gql = String.raw;
    const query = gql`{
      Post(id: "${postId}") {
        parentCategory {
          id
          title
        }
      }
    }`;

    const result = await fetch(`${apiUrl}/graphql`, {
      method: 'POST',
      headers: {
        ...headers,
        Authorization: `JWT ${jwt}`,
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());

    console.log('GraphQL response JSON:', JSON.stringify(result, undefined, 2)); // eslint-disable-line
    expect(result.data.Post.parentCategory?.id).toEqual(parentCategoryId);
  });
});
