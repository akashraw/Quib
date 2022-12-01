import { Image, SafeAreaView, StyleSheet, FlatList, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { Style } from '../../constants/Styles'
import { vmin, vmax, vw, vh, percentage } from 'rxn-units';
import GetAllMovies from '../../constants/datadb'
interface mov {
  id: number;
  title: string;
  year: string;
  director: string;
  thumb: string;
}
//33_Birdman
// require('../../assets/Thumbs/42_TheTerminator.jpg')
export default function ChooseMovies() {

  const MovieBanner = ({ item, index }: any) => {
    return (
      <View>
        {/* bannner top */}
        <View key={index} style={styles.movieBanner}>
          <View>
            <Image style={{width:55, height:70}} source={item.thumb} />
          </View>
          <View>
            <Text style={[styles.title, styles.txt]}>{item?.title}</Text>
            <Text style={[styles.year, styles.txt]}>{item?.year}</Text>
            <Text style={[styles.director, styles.txt]}>{item?.director}</Text>
          </View>
        </View>
        {/* banner bottom */}
        <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center',}}>
          <Text style={[styles.txt, {color:Style.defaultRed, fontWeight:'bold', textAlign:'center'}]}>Play Quibs</Text>
          <Icon name='caret-forward-outline' size={28} color={Style.defaultRed} />
        </View>
      </View>


    )
  }
  return (
    <SafeAreaView>
      <View style={{ alignItems: 'center' }}>
        <FlatList
          bounces={false}
          keyExtractor={(_, index) => index.toString()}
          pagingEnabled
          data={GetAllMovies}
          renderItem={({ item, index }) => (MovieBanner({ item, index }))}
        />
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  movieBanner: {
    width: vw(50),
    height: vh(15),
    flexDirection: 'row',
    backgroundColor: Style.defaultTxtColor,
    alignItems: 'center',
  },
  txt:{
    fontSize:16,
  },
  title:{},
  year: {},
  director: {},
})

