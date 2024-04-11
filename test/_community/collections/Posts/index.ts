import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types'

import { mediaSlug } from '../Media'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  fields: [
    {
      name: 'text',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'text2',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'associatedMedia',
      access: {
        create: () => true,
        update: () => false,
      },
      relationTo: mediaSlug,
      type: 'upload',
    },
  ],
  versions: {
    maxPerDoc: 0,
    drafts: {
      autosave: true,
    },
  },
  slug: postsSlug,
}
