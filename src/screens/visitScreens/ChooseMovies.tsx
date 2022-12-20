import { Image, SafeAreaView, StyleSheet, FlatList, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Style } from '../../constants/Styles'
import { vmin, vmax, vw, vh, percentage } from 'rxn-units';
import { API, GetAllMoviesAPI } from '../../constants/Api';
import { GetAllMovies, RecentQuib } from '../../services/QuibAPIs';

interface props {
  navigation: any;
}
interface Movies {
  id: number,
  title: string,
  length: number,
  posterContentThumb: string,
  releaseYear: number,
  director: string,
  isActive: true
}
//33_Birdman
// require('../../assets/Thumbs/42_TheTerminator.jpg')
export default function ChooseMovies(props: props) {

  const [allMovieRes, setallMovieRes] = useState([]);
  const Recent = useRef([])
  useEffect(() => {
    RecentQuib().then(res => Recent.current = res)
    GetAllMovies().then(res => setallMovieRes(res));
  }, [])

  const MovieBanner = ({ item, index }: any) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate("Qplayer")}>
        <View style={{ margin: vw(2), }}>
          {/* bannner top */}
          <View key={index} style={styles.movieBanner}>
            <Image style={{ width: 45, height: 60, marginHorizontal: vw(2) }} source={{ uri: `${API}${item.posterContentThumb}` }} />
            <View>
              <Text style={[styles.title, styles.txt]}>{item.title}</Text>
              <Text style={[styles.year, styles.txt]}>{item.releaseYear}</Text>
              <Text style={[styles.director, styles.txt]}>{item.director}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

    )
  }
  return (
    <SafeAreaView>
      <View style={{ alignItems: 'center', margin: 10, }}>
        {/*Recents quib*/}
        <View>
          <View style={{ backgroundColor: Style.quibHeader, width: vw(100), height: vw(10), justifyContent: 'center', marginVertical: vw(1), paddingLeft: vw(8) }}>
            <Text style={{ color: Style.defaultRed, fontSize: 20, fontWeight: 'bold' }}>Recent Quib</Text>
          </View>
        </View>
        <View>
          <View style={{ backgroundColor: Style.quibHeader, width: vw(100), height: vw(10), justifyContent: 'center', marginVertical: vw(1), paddingLeft: vw(8) }}>
            <Text style={{ color: Style.defaultRed, fontSize: 20, fontWeight: 'bold' }}>Recent Quib</Text>
          </View>
          {/* <FlatList
            bounces={false}
            numColumns={0}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            data={Recent.current}
            renderItem={({ item, index }) => (MovieBanner({ item, index }))}
          /> */}
        </View>
        <View>
          <View style={{ backgroundColor: Style.quibHeader, width: vw(100), height: vw(10), justifyContent: 'center', marginVertical: vw(1), paddingLeft: vw(8) }}>
            <Text style={{ color: Style.defaultRed, fontSize: 20, fontWeight: 'bold' }}>Alphabetical order</Text>
          </View>
        </View>
        <FlatList
          bounces={false}
          numColumns={0}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          data={allMovieRes}
          renderItem={({ item, index }) => (MovieBanner({ item, index }))}
        />
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  movieBanner: {
    width: vw(80),
    height: vh(10),
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

