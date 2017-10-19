import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'

import Content from '../components/Content'

const query = gql`
query GetContent($id: ID!) {
  content(id: $id) {
    id
    title
    imdb
  }
}
`

const queryOptions = {
  props: ({ ownProps, data: { error, loading, content } }) => ({
    loading, // Mapping of `${propInComponent}: ${propFromRedux}`
    error,
    content,
  }),
  options: ownProps => ({
    variables: {
      id: 'Q29udGVudDoy',
    }
  })
}


export default graphql(query, queryOptions)(Content)
