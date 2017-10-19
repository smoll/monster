import React from 'react'

import Main from './src/index'
import OfflineDatabase from './src/graphql/OfflineDatabase'

export default class App extends React.Component {
  async componentWillMount() {
    const db = new OfflineDatabase()
    await db.bootstrap()

    const result = await db.run(`select * from content`)
    console.log('res===', result)
  }

  render() {
    return (
      <Main />
    )
  }
}
