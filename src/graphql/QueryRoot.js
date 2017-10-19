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

import Content, {ContentConnection} from './Content'
import OfflineDatabase from './OfflineDatabase'
import {nodeField} from './Node'

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
    contents: {
      // Top-level connection is possible, cf. https://github.com/stems/join-monster/issues/102#issuecomment-289141770
      type: ContentConnection,
      args: {
        ...connectionArgs,
        term: {
          description: "A search term to filter results by",
          type: new GraphQLNonNull(GraphQLString)
        },
      },
      sortKey: {
        order: 'desc',
        key: 'id'
      },
      sqlPaginate: false,
      where: (contentTable, args, context, sqlASTNode) => { // eslint-disable-line no-unused-vars
        console.log('QueryRoot::sqlASTNode: ', sqlASTNode)
        return `UPPER(${contentTable}.title) LIKE "%${args.term.toUpperCase()}%"`
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, context, sql => db.run(sql), options).then(data => connectionFromArray(data, args))
      }
    },
    content: {
      type: Content,
      args: {
        id: {
          description: "The content's ID",
          type: GraphQLID
        }
      },
      // this function generates the WHERE condition
      where: (contentTable, args, context) => { // eslint-disable-line no-unused-vars
        if (args.id) {
          const { type, id } = fromGlobalId(args.id)
          return `${contentTable}.id = ${id}`
        }
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, context, sql => db.run(sql), options)
      }
    },
  })
})
