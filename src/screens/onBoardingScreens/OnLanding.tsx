import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OnLandingButton from '../../components/OnLandingButton';
const width = Dimensions.get('screen').width;
interface props {
  navigation: any;
}
export default function OnLanding({navigation}: props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headWrap}>
        <Text style={styles.heading}>Share what you know and love about great movies
        </Text>
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          data={Slides}
          renderItem={({ item, index }) => (
            <View style={styles.flatList}>
              <Image key={index} source={item.img} style={styles.image} />
            </View>
          )}
        />

      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: 40, }}>
          <OnLandingButton text={"Join"}  onPress={()=>{navigation.navigate('Register')}} />
          <OnLandingButton text={"Visit"} onPress={()=>{navigation.navigate('Register')}} />
        </View>
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <OnLandingButton text={"Log In"} onPress={()=>{navigation.navigate('Login')}} />
        </View>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',

    flex: 1,
  },
  headWrap: {
    marginTop: 30,
  },
  heading: {
    color: '#990000',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',

  },
  flatList: {
    marginTop: 25,
  },
  image: {
    width: width,
    height: 250,
    resizeMode: 'contain',

  }
})

const Slides = [
  {
    key: 1,
    img: require('../../assets/onLanding/BirdmanQuib.png')
  },
  {
    key: 2,
    img: require('../../assets/onLanding/JawsQuibs.png')
  },
  {
    key: 3,
    img: require('../../assets/onLanding/TheConversationQuib.png')
  },
]