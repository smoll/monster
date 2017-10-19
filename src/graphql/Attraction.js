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

import Category from './Category'
import Geocode from './Geocode'
import Image from './Image'
import { nodeInterface } from './Node'
import {ImageConnection} from './Image'
import {CategoryConnection} from './Category'

const Attraction = new GraphQLObjectType({
  description: 'an attraction or restaurant',
  name: 'Attraction',
  // tell join monster the expression for the table
  sqlTable: 'attractions',
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
    name: {
      // no `sqlColumn` and no `resolve`. assumed that the column name is the same as the field name: id
      type: GraphQLString,
    },
    address: {
      type: GraphQLString
    },
    rating: {
      type: GraphQLFloat
    },
    geocode: {
      description: 'Geolocated coordinates',
      // has another GraphQLObjectType as a field
      type: Geocode,
      // this is a one-to-one relation
      // this function tells join monster how to join these tables
      sqlJoin: (attractionTable, geocodeTable) => `${attractionTable}.geocode_id = ${geocodeTable}.id`,
      orderBy: 'id'
    },
    images: {
      description: 'A list of Images of the attraction',
      type: ImageConnection,
      args: connectionArgs,
      sortKey: {
        order: 'desc',
        key: 'id'
      },
      sqlPaginate: false,
      // this is a one-to-many relation
      // this function tells join monster how to join these tables
      sqlJoin: (attractionTable, imageTable) => `${attractionTable}.id = ${imageTable}.attraction_id`,
      resolve: (attraction, args) => {
        return connectionFromArray(attraction.images, args)
      },
    },
    categories: {
      // use an interface type
      type: CategoryConnection,
      args: connectionArgs,
      sortKey: {
        order: 'desc',
        key: 'id'
      },
      sqlPaginate: false,
      // this is a many-to-many relation
      junction: {
        sqlTable: 'attraction_categories',
        sqlJoins: [
          (attractionTable, unionTable) => `${attractionTable}.id = ${unionTable}.attraction_id`,
          (unionTable, categoryTable) => `${unionTable}.category_id = ${categoryTable}.id`
        ]
      },
      resolve: (attraction, args) => {
        return connectionFromArray(attraction.categories, args)
      },
    }
  })
})

const { connectionType: AttractionConnection } = connectionDefinitions({ nodeType: Attraction })

export { AttractionConnection }
export default Attraction
