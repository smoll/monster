import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'

import Contents from '../components/Contents'

const query = gql`query SearchContent($term: String!) {
  contents(term: $term) {
    pageInfo {
      endCursor
      hasPreviousPage
      hasNextPage
    }
    edges {
      node {
        id
        title
        imdb
      }
    }
  }
}
`
const queryOptions = {
  props: ({ ownProps, data: { error, loading, contents } }) => ({
    loading, // Mapping of `${propInComponent}: ${propFromRedux}`
    error,
    contents,
  }),
  options: ownProps => ({
    variables: {
      term: '',
    }
  })
}


export default graphql(query, queryOptions)(Contents)
