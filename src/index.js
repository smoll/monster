import React from 'react'
import {ScrollView, StyleSheet} from 'react-native'
import {connect, Provider} from 'react-redux'
import {ApolloProvider} from 'react-apollo'
import ApolloClient from 'apollo-client'

import './globals' // before importing join-monster!

import {createLocalNetworkInterface} from './graphql/LocalNetworkInterface'
import createStore from './redux'
import schema from './graphql/schema'

import Content from './containers/Content'
import Contents from './containers/Contents'

const networkInterface = createLocalNetworkInterface({schema})
const client = new ApolloClient({networkInterface})
const store = createStore(client)

const Main = () => (
  <ApolloProvider store={store} client={client}>
    <ScrollView style={styles.container}>
      <Content />
      <Contents />
    </ScrollView>
  </ApolloProvider>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
})

export default Main
