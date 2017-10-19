import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'

import Contents from '../components/Contents'
import * as actionCreators from '../redux/modules/counter'

const mapStateToProps = state => ({
  count: state.counter.count
})
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actionCreators, dispatch),
  dispatch
})

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


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(query, queryOptions)
)(Contents)
