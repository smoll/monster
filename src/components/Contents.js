import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, TextInput, View} from 'react-native'

const Contents = (props) => {
  const {loading, error, contents} = props

  return (
    <View style={styles.container}>
      <TextInput multiline={true} numberOfLines={20}>
        {JSON.stringify(props)}
      </TextInput>
    </View>
  )
}

Contents.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  contents: PropTypes.object,
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
})

export default Contents
