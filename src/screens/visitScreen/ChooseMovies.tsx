import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Style } from '../../constants/Styles'
//33_Birdman

export default function ChooseMovies() {
  const MovieBanner = () => {
    return (
      <View style={styles.movieBanner}>
        <Text style={styles.title}>The Terminator</Text>
        <Text style={styles.year}>2002</Text>
        <Text style={styles.director}>Director</Text>
        <View >
          <Text>Play Quibs</Text>
          <Icon name='caret-forward-circle-outline' size={14} color={Style.defaultRed} />
        </View>
      </View>
    )
  }
  return (
    <SafeAreaView>
      <View>
        <MovieBanner />
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  movieBanner: {
    width:'80%',
    height:'50%',
    backgroundColor:Style.defaultTxtColor,
  },
  title: {},
  year: {},
  director: {},
})

