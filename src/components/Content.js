import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, TextInput, View} from 'react-native'

const Content = (props) => {
  const {loading, error, content} = props

  return (
    <View style={styles.container}>
      <TextInput multiline={true} numberOfLines={20}>
        {JSON.stringify(props)}
      </TextInput>
    </View>
  )
}

Content.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  content: PropTypes.object,
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
})

export default Content
