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
  connectionArgs,
  forwardConnectionArgs,
  connectionDefinitions,
  connectionFromArray
} from 'graphql-relay'

import { nodeInterface } from './Node'
import {AttractionConnection} from './Attraction'

export const Category = new GraphQLObjectType({
  description: 'A category',
  name: 'Category',
  // another table in SQL to map to
  sqlTable: 'categories',
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
    name: {
      // SQL column assumed to be "name"
      type: GraphQLString
    },
    attractions: {
      // use an interface type
      type: AttractionConnection,
      args: {
        ...connectionArgs,
        latitude: {
          description: "Limit search based on this latitude",
          type: GraphQLFloat
        },
        longitude: {
          description: "Limit search based on this longitude",
          type: GraphQLFloat
        },
        distance: {
          description: "Limit search based on this distance",
          type: GraphQLInt
        },
      },
      sortKey: {
        order: 'desc',
        key: 'id'
      },
      sqlPaginate: false,
      // this is a many-to-many relation
      junction: {
        sqlTable: 'attraction_categories',
        sqlJoins: [
          (categoryTable, unionTable) => `${categoryTable}.id = ${unionTable}.category_id`,
          (unionTable, attractionTable) => `${unionTable}.attraction_id = ${attractionTable}.id`
        ]
      },
      resolve: (category, args) => {
        return connectionFromArray(category.attractions, args)
      },
    }
  })
})

// create a connection type from the Category type
// this connection will also include a "total" so we know how many total comments there are
// this could be used to calculate page numbers
const { connectionType: CategoryConnection } = connectionDefinitions({
  nodeType: Category,
  connectionFields: {
    total: { type: GraphQLInt }
  }
})

export { CategoryConnection }
export default Category
