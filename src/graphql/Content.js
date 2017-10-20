import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat
} from 'graphql'
import {
  globalIdField,
  connectionArgs,
  forwardConnectionArgs,
  connectionDefinitions,
  connectionFromArray
} from 'graphql-relay'

import {nodeInterface} from './Node'

const Content = new GraphQLObjectType({
  description: 'a piece of content',
  name: 'Content',
  // tell join monster the expression for the table
  sqlTable: 'content',
  // one of the columns must be unique for deduplication purposes
  uniqueKey: 'id',
  // This implements the node interface
  interfaces: [ nodeInterface ],
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
    title: {
      // no `sqlColumn` and no `resolve`. assumed that the column name is the same as the field name: id
      type: GraphQLString,
    },
    imdb: {
      type: GraphQLFloat
    },
  })
})

// create a connection type from the Content type
// this connection will also include a "total" so we know how many total pieces of content there are
// this could be used to calculate page numbers
const { connectionType: ContentConnection } = connectionDefinitions({
  nodeType: Content,
  connectionFields: {
    total: { type: GraphQLInt }
  }
})

export { ContentConnection }
export default Content
