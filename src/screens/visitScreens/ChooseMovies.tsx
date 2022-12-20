import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, SectionList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Style } from '../../constants/Styles'
import { vmin, vmax, vw, vh, percentage } from 'rxn-units';
import { API } from '../../constants/Api';
import { getAllMovies, getMostActiveMovies, getRecentMovies } from '../../services/QuibAPIs';
import { Pulse } from 'react-native-animated-spinkit'

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
  const para = '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'
  const [allMovieRes, setallMovieRes] = useState([]);
  const [RecentMovies, setRecentMovies] = useState([]);
  const [ActiveMovies, setActiveMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getRecentMovies().then(res => setRecentMovies(res)),
    getAllMovies().then(res => setallMovieRes(res)),
    getMostActiveMovies().then(res => setActiveMovies(res))
    ]).then(() => setIsLoading(false))
    // getRecentMovies().then(res => setRecentMovies(res));
    // getAllMovies().then(res => setallMovieRes(res));
    // getMostActiveMovies().then(res => setActiveMovies(res));
  }, [])

  const MovieBanner = ({ item, index }: any) => {
    const check: string = item.posterContentThumb;
    let FS = check.split('.').pop();
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate("Qplayer")}>
        <View style={{ margin: vw(2), flexDirection: 'row', justifyContent: 'center' }}>
          {/* bannner top */}
          <View key={index} style={styles.movieBanner}>
            <Image style={{ width: 45, height: 60, marginHorizontal: vw(2) }}
              source={{ uri: ((FS == 'jpeg' || FS == 'jpg') ? `${API}${item.posterContentThumb}` : `data:image/png;base64,${para}`) }} />
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
      return (
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
          <Pulse size={45} color={Style.defaultRed} />
        </View>
      )
    } else return(
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

