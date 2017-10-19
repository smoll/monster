import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, TextInput} from 'react-native'

const Content = (props) => {
  const {loading, error, contents} = props

  return <TextInput multiline={true} numberOfLines={10}>{JSON.stringify(props)}</TextInput>
}

Content.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  // contents: PropTypes.object,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Content
