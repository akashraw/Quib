import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, SectionList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Style } from '../../constants/Styles'
import { vmin, vmax, vw, vh, percentage } from 'rxn-units';
import { API } from '../../constants/Api';
import { getAllMovies, getMostActiveMovies, getRecentMovies } from '../../services/QuibAPIs';
import { Bounce, CircleFade, Pulse, Wave } from 'react-native-animated-spinkit'
import FastImage from 'react-native-fast-image';

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

export default function ChooseMovies(props: props) {
  const [allMovieRes, setallMovieRes] = useState([]);
  const [RecentMovies, setRecentMovies] = useState([]);
  const [ActiveMovies, setActiveMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      Promise.all([getRecentMovies().then(res => setRecentMovies(res)),
      getAllMovies().then(res => setallMovieRes(res)),
      getMostActiveMovies().then(res => setActiveMovies(res))
      ]).then(() => setIsLoading(false))
    }, 1000)

    // getRecentMovies().then(res => setRecentMovies(res));
    // getAllMovies().then(res => setallMovieRes(res));
    // getMostActiveMovies().then(res => setActiveMovies(res));
  }, [])

  const MovieBanner = ({ item, index }: any) => {
    const check: string = item.posterContentThumb;
    let FS = check.split('.').pop();
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate("Qplayer", { MovieId: item.id, Movietitle: item.title})}>
        <View style={{ margin: vw(2), flexDirection: 'row', justifyContent: 'center' }}>
          {/* bannner top */}
          <View key={index} style={styles.movieBanner}>
            <FastImage
              style={{ width: 45, height: 60, marginHorizontal: vw(2) }}
              resizeMode={FastImage.resizeMode.contain}
              source={{
                uri: ((FS == 'jpeg' || FS == 'jpg') ? `${API}${item.posterContentThumb}` : `data:image/png;base64,${item.posterContentThumb}`),
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable
              }} />
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
  const SectionHeading = (section: any) => {
    return (
      <View style={{ backgroundColor: Style.quibHeader, width: vw(95), height: vw(10), justifyContent: 'center', marginTop: vw(3), paddingLeft: vw(8) }}>
        <Text style={{ color: Style.defaultRed, fontSize: 20, fontWeight: 'bold' }}>{section.title}</Text>
      </View>
    )
  }

  const Loaded = () => {
    if (isLoading) {
      return (<View style={{ top: vw(50), }}>
        <Wave size={65} color={Style.defaultRed} animating={isLoading} />
      </View>)

    } else return (
      <SectionList
        bounces={false}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        sections={[
          { title: 'Recent Quib', data: RecentMovies, renderItem: ({ item, index }) => MovieBanner({ item, index }) },
          { title: 'Most Quib', data: ActiveMovies, renderItem: ({ item, index }) => MovieBanner({ item, index }) },
          { title: 'Alhpabetical Order', data: allMovieRes, renderItem: ({ item, index }) => MovieBanner({ item, index }) }
        ]}
        renderSectionHeader={({ section }) => SectionHeading(section)}
      />
    )
  }

  return (
    <SafeAreaView>
      <View style={{ alignItems: 'center', }}>
        <Loaded/>
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

