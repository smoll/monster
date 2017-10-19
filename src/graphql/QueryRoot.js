import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'
import {
  fromGlobalId,
  globalIdField,
  connectionArgs,
  forwardConnectionArgs,
  connectionDefinitions,
  connectionFromArray
} from 'graphql-relay'

import joinMonster from 'join-monster'
import sqlite3Module from 'join-monster/dist/stringifiers/dialects/sqlite3'
import GeoPoint from 'geopoint'

import Attraction, {AttractionConnection} from './Attraction'
import Category, {CategoryConnection} from './Category'
import OfflineDatabase from './OfflineDatabase'
import { nodeField } from './Node'

const db = new OfflineDatabase()
const options = { dialectModule: sqlite3Module }

export default new GraphQLObjectType({
  description: 'global query object',
  name: 'Query',
  fields: () => ({
    version: {
      type: GraphQLString,
      resolve: () => joinMonster.version
    },
    // implement the Node type from Relay spec
    node: nodeField,
    attractions: {
      // Top-level connection is possible, cf. https://github.com/stems/join-monster/issues/102#issuecomment-289141770
      type: AttractionConnection,
      args: {
        ...connectionArgs,
        term: {
          description: "A search term to filter results by",
          type: new GraphQLNonNull(GraphQLString)
        },
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
        }
      },
      sortKey: {
        order: 'desc',
        key: 'id'
      },
      sqlPaginate: false,
      where: (attractionTable, args, context, sqlASTNode) => { // eslint-disable-line no-unused-vars
        // console.log('QueryRoot::sqlASTNode: ', sqlASTNode)
        let where = `UPPER(${attractionTable}.name) LIKE "%${args.term.toUpperCase()}%"`

        if (args.latitude && args.longitude) {
          const point = new GeoPoint(args.latitude, args.longitude)
          const box = point.boundingCoordinates(args.distance || 5)
          where = where.concat(` AND geocode.lat BETWEEN ${box[0]._degLat} AND ${box[1]._degLat} AND geocode.lng BETWEEN ${box[0]._degLon} AND ${box[1]._degLon}`)
        }

        console.log('QueryRoot:: final where clause =>', where)

        return where
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, context, sql => db.run(sql), options).then(data => connectionFromArray(data, args))
      }
    },
    attraction: {
      type: Attraction,
      args: {
        id: {
          description: "The attraction's ID",
          type: GraphQLID
        }
      },
      // this function generates the WHERE condition
      where: (attractionTable, args, context) => { // eslint-disable-line no-unused-vars
        if (args.id) {
          const { type, id } = fromGlobalId(args.id)
          return `${attractionTable}.id = ${id}`
        }
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, context, sql => db.run(sql), options)
      }
    },
    categories: {
      // Top-level connection is possible, cf. https://github.com/stems/join-monster/issues/102#issuecomment-289141770
      type: CategoryConnection,
      args: {
        ...connectionArgs,
        term: {
          description: "A search term to filter results by",
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      sortKey: {
        order: 'desc',
        key: 'id'
      },
      sqlPaginate: false,
      where: (categoryTable, args, context) => {
        if (args.term) return `UPPER(${categoryTable}.name) LIKE "%${args.term.toUpperCase()}%"`
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, context, sql => db.run(sql), options).then(data => connectionFromArray(data, args))
      }
    },
    category: {
      type: Category,
      args: {
        id: {
          description: "The category's ID",
          type: GraphQLID
        }
      },
      // this function generates the WHERE condition
      where: (categoryTable, args, context) => { // eslint-disable-line no-unused-vars
        if (args.id) {
          const { type, id } = fromGlobalId(args.id)
          return `${categoryTable}.id = ${id}`
        }
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, context, sql => db.run(sql), options)
      }
    },
  })
})
