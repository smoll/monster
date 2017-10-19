import React from 'react'

import Main from './src/index'
import OfflineDatabase from './src/graphql/OfflineDatabase'

export default class App extends React.Component {
  componentWillMount() {
    const db = new OfflineDatabase()
    db.bootstrap()
  }

  render() {
    return (
      <Main />
    )
  }
}
