import { Image, SafeAreaView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
// import Icon from 'react-native-vector-icons/Ionicons'
import { vw } from 'rxn-units'
import { Style } from '../../constants/Styles'
import QuibButton from '../../components/QuibButton'
import { Shadow } from 'react-native-shadow-2'
const Today = [
  { key: 1, userId: 'simsim' },
  { key: 2, userId: 'akash' },
  { key: 3, userId: 'chandan' },
  { key: 4, userId: 'ranji' },
  { key: 5, userId: 'boss' },
  { key: 6, userId: 'toss' },
]
const ThisWeek = [
  { key: 1, userId: 'shiv' },
  { key: 2, userId: 'jeetu' },
  { key: 3, userId: 'robin' },
  { key: 4, userId: 'Ocean' },
  { key: 5, userId: 'sususuraj' },
  { key: 6, userId: 'tocrossss' },
]
export default function NotificationScreen() {
  const SectionHeading = (section: any) => {
    return (
      <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start' }}>
        <Text style={{ fontSize: vw(6), fontWeight: 'bold', color: Style.defaultLightGrey }}>{section.title}</Text>
      </View>
    )
  }
  const RenderItem = ({ item, index }: any) => {
    return (
      <View key={index} style={{
        flexDirection: 'row', width: vw(85), borderBottomColor: '#B2B2B2', height: vw(15), alignItems: 'center',
      }}>
        <TouchableOpacity style={{ flexDirection: 'row', width: vw(85), height: vw(15), alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            {/* <Icon name='book-outline' size={vw(6)} color={Style.defaultRed} /> */}
            <Shadow distance={2}>
              <Image
                style={{ height: vw(10), width: vw(10), borderRadius: vw(13) }}
                source={require('../../assets/Movie/arrival.jpeg')}
              />
            </Shadow>
            {/* <View style={{overflow:'hidden'}}> */}
            <Text style={{ fontSize: 14, paddingBottom: vw(.5), textAlignVertical: 'center', width: vw(55), paddingHorizontal: vw(2) }} numberOfLines={2}>
              <Text style={{ fontWeight: '500', color: Style.defaultGrey }}>{item.userId} </Text><Text style={{ color: Style.defaultGrey }}>has started following you</Text>
            </Text>
            {/* </View> */}
          </View>
          <QuibButton text={'Follow'} onPress={null} viewStyle={styles.button} textStyle={styles.buttonTxt} />
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, width: vw(100), alignSelf: 'center', paddingTop: vw(5), backgroundColor: '#E0DECA' }}>

      <View style={{ justifyContent: 'center', alignItems: 'center', width: vw(90), marginHorizontal: vw(5) }}>
        <SectionList
          bounces={true}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          sections={[
            { title: `Today's`, sort: false, data: Today, renderItem: ({ item, index }) => RenderItem({ index, item }) },
            { title: `This Week's`, sort: false, data: ThisWeek, renderItem: ({ item, index }) => RenderItem({ index, item }) },
            // { title: 'All Movies', sort: true, data: allMovieRes, renderItem: ({ item, index }) => MovieBanner({ item, index }) }
          ]}
          renderSectionHeader={({ section }) => SectionHeading(section)}
        />


      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Style.defaultRed,
    width: vw(20),
    height: vw(8),
    borderRadius: vw(2),
    // marginBottom: 10,
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
})