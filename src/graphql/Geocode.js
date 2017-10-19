import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean
} from 'graphql'
import { globalIdField } from 'graphql-relay'

import Attraction from './Attraction'

export default new GraphQLObjectType({
  description: 'Geolocated coordinates',
  name: 'Geocode',
  // another table in SQL to map to
  sqlTable: 'geocodes',
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
    attraction: {
      description: 'The attraction that is geocoded',
      type: Attraction,
      sqlJoin: (geocodeTable, attractionTable) => `${geocodeTable}.id = ${attractionTable}.geocode_id`
    },
    lat: {
      description: 'The latitude',
      type: GraphQLFloat
    },
    lng: {
      description: 'The longitude',
      type: GraphQLFloat
    },
  })
})
