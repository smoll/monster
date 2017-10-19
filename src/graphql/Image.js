import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean
} from 'graphql'
import {
  globalIdField,
  connectionDefinitions
} from 'graphql-relay'

import { nodeInterface } from './Node'

export const Image = new GraphQLObjectType({
  description: 'An image',
  name: 'Image',
  // another table in SQL to map to
  sqlTable: 'images',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      description: 'The global ID for the Relay spec',
      ...globalIdField(),
      sqlDeps: [ 'id' ]
    },
    pk: {
      type: GraphQLInt,
      // specify the SQL column
      sqlColumn: 'id'
    },
    smThumbnailUrl: {
      description: 'A small thumbnail of the original image',
      // assumed to be "body"
      type: GraphQLString,
      sqlColumn: 'sm_thumbnail_url'
    }
  })
})

// create a connection type from the Image type
// this connection will also include a "total" so we know how many total comments there are
// this could be used to calculate page numbers
const { connectionType: ImageConnection } = connectionDefinitions({
  nodeType: Image,
  connectionFields: {
    total: { type: GraphQLInt }
  }
})

export { ImageConnection }
