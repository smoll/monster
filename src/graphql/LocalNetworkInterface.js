import { printAST, NetworkInterface, Request } from 'apollo-client'
import { GraphQLSchema, ExecutionResult, graphql } from 'graphql'

export class LocalNetworkInterface implements NetworkInterface {
  constructor(schema) {
    this.schema = schema
  }
  query(request) {
    const { query, variables } = request
    return graphql(
      this.schema,
      printAST(query),
      null,
      null,
      variables,
    )
  }
  getSchema() {
    return this.schema
  }
}

export function createLocalNetworkInterface(options) {
  const { schema } = options
  return new LocalNetworkInterface(schema)
}
