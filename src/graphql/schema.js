import { GraphQLSchema } from 'graphql'

import QueryRoot from './QueryRoot'

export default new GraphQLSchema({
  description: 'offline monster database schema',
  query: QueryRoot
})
