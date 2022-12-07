import { Image, SafeAreaView, StyleSheet, FlatList, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Style } from '../../constants/Styles'
import { vmin, vmax, vw, vh, percentage } from 'rxn-units';
import GetAllMovies from '../../constants/datadb'

interface props {
  navigation: any;
}
//33_Birdman
// require('../../assets/Thumbs/42_TheTerminator.jpg')
export default function ChooseMovies(props: props) {

  const MovieBanner = ({ item, index }: any) => {
    return (
      <TouchableOpacity onPress={()=>props.navigation.push("Qplayer")}>
        <View style={{ margin: 5, }}>
          {/* bannner top */}
          <View key={index} style={styles.movieBanner}>
            <View style={{ padding: 5 }}>
              <Image style={{ width: 40, height: 55 }} source={item.thumb} />
            </View>
            <View>
              <Text style={[styles.title, styles.txt]}>{item?.title}</Text>
              <Text style={[styles.year, styles.txt]}>{item?.year}</Text>
              <Text style={[styles.director, styles.txt]}>{item?.director}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

    )
  }
  return (
    <SafeAreaView>
      <View style={{ alignItems: 'center', margin: 10, }}>
        <FlatList
          bounces={false}
          numColumns={0}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          data={GetAllMovies}
          renderItem={({ item, index }) => (MovieBanner({ item, index }))}
        />
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  movieBanner: {
    width: vw(85),
    height: vh(9),
    flexDirection: 'row',
    backgroundColor: Style.quibColor,
    alignItems: 'center',
  },
  txt: {
    fontSize: 14,
    color: Style.quibText,
    fontWeight: 'bold'
  },
  title: {},
  year: {},
  director: {},
})

