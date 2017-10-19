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
  description: 'an attraction or restaurant',
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
    rating: {
      type: GraphQLFloat
    },
  })
})

const { connectionType: ContentConnection } = connectionDefinitions({ nodeType: Content })

export { ContentConnection }
export default Content
