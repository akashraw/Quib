import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import OnLandingButton from '../../components/OnLandingButton';
import {StringData} from '../../constants/Constant';

//for width
const width = Dimensions.get('screen').width;
const DOT_SIZE = 8;
const DOT_SPACING = 8;
//for prop
interface props {
  navigation: any;
}

export default function OnLanding({navigation}: props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headWrap}>
        <Text style={styles.heading}>{StringData.onLandingHead}</Text>
        <FlatList
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          pagingEnabled
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          data={Slides}
          renderItem={({item, index}) => (
            <View style={styles.flatList}>
              <Image key={index} source={item.img} style={styles.image} />
            </View>
          )}
        />
        
      </View>
      <View style={styles.pagination}>
          {Slides.map((_, index) => {
            return <View key={index} style={styles.dot} />;
          })}
        </View>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 40,
          }}>
          <OnLandingButton
            text={'Join'}
            onPress="Register"
          />
          <OnLandingButton
            text={'Visit'}
            onPress="null"
          />
        </View>
        <View style={{marginTop: 20, alignItems: 'center'}}>
          <OnLandingButton
            text={'Log In'}
            onPress="Login"
          />
        </View>
      </View>
    </SafeAreaView>
  );
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
  },
  pagination: {
    flexDirection:'row',
    left: width/2.3,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE,
    backgroundColor: '#333',
    marginLeft: DOT_SPACING,
  },
});

const Slides = [
  {
    key: 1,
    img: require('../../assets/onLanding/BirdmanQuib.png'),
  },
  {
    key: 2,
    img: require('../../assets/onLanding/JawsQuibs.png'),
  },
  {
    key: 3,
    img: require('../../assets/onLanding/TheConversationQuib.png'),
  },
];
