import React from 'react'
import {connect, Provider} from 'react-redux'
import {ApolloProvider} from 'react-apollo'
import ApolloClient from 'apollo-client'

import '../global' // before importing join-monster!

import {createLocalNetworkInterface} from './graphql/LocalNetworkInterface'
import createStore from './redux'
import Content from './containers/Content'
import schema from './graphql/schema'

const store = createStore()
const networkInterface = createLocalNetworkInterface({schema})
const client = new ApolloClient({networkInterface})

const Main = () => (
  <ApolloProvider store={store} client={client}>
    <Content />
  </ApolloProvider>
)

export default Main
