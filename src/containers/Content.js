import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'

import Content from '../components/Content'
import * as actionCreators from '../redux/modules/counter'

const mapStateToProps = state => ({
  count: state.counter.count
})
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(actionCreators, dispatch),
  dispatch
})

const query = gql`
query SearchCategories($term: String!) {
  contents(term: $term, first: 10) {
    pageInfo {
      endCursor
      hasPreviousPage
      hasNextPage
    }
    edges {
      node {
        id
        title
      }
    }
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
      term: 'a',
    }
  })
}


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(query, queryOptions)
)(Content)
