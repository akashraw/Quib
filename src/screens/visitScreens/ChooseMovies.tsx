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
      <View style={{margin:5,}}>
        {/* bannner top */}
        <View key={index} style={styles.movieBanner}>
          <View style={{padding:5}}>
            <Image style={{width:40, height:55}} source={item.thumb} />
          </View>
          <View>
            <Text style={[styles.title, styles.txt]}>{item?.title}</Text>
            <Text style={[styles.year, styles.txt]}>{item?.year}</Text>
            <Text style={[styles.director, styles.txt]}>{item?.director}</Text>
          </View>
        </View>
        {/* banner bottom */}
        {/* <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center', backgroundColor:'#CCCC99',}}>
          <Text style={[styles.txt, {color:Style.defaultRed, fontWeight:'bold', textAlign:'center'}]}>PLAY QUIB</Text>
          <Icon name='caret-forward-outline' size={28} color={Style.defaultRed} />
        </View> */}
      </View>


    )
  }
  return (
    <SafeAreaView>
      <View style={{ alignItems: 'center', margin:10,}}>
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
  txt:{
    fontSize:14,
    color:Style.quibText,
    fontWeight:'bold'
  },
  title:{},
  year: {},
  director: {},
})

