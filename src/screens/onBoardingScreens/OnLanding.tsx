import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import QuibButton from '../../components/QuibButton';
import {StringData} from '../../constants/Constant';
import {vh, vw} from 'rxn-units';
import {ScalingDot} from 'react-native-animated-pagination-dots';
import {Style} from '../../constants/Styles';
//for width
// const width = Dimensions.get('screen').width;
const DOT_SIZE = 8;
const DOT_SPACING = 8;
//for prop
interface props {
  navigation: any;
}

export default function OnLanding({navigation}: props) {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.headWrap}> */}
      <View style={styles.headWrap}>
        <Image
          style={{ width: vw(35), height: vw(20), justifyContent: 'center', alignSelf: 'center', marginBottom: vw(2) }}
          resizeMode={'contain'}
          source={require('../../assets/logo.png')}
        />
        <Text style={styles.heading}>{StringData.onLandingHead}</Text>
        <FlatList
          horizontal
          contentContainerStyle={{justifyContent:'center'}}
          snapToAlignment='center'
          decelerationRate="fast"
          pagingEnabled
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {
              useNativeDriver: false,
            },
          )}
          data={Slides}
          renderItem={({item, index}) => (
            <View key={index} style={styles.flatList}>
              <Image key={index} source={item.img} style={styles.image} />
            </View>
          )}
        />
        {/* Pagination */}
        <View style={{marginTop: vw(8)}}>
          <ScalingDot
            data={Slides}
            // expandingDotWidth={30}
            scrollX={scrollX}
            inActiveDotOpacity={0.6}
            activeDotColor={Style.defaultTxtColor}
            inActiveDotColor={Style.defaultTxtColor}
            dotStyle={{
              width: vw(2),
              height: vw(2),
              backgroundColor: '#347af0',
              borderRadius: 5,
              marginHorizontal: 5,
            }}
            containerStyle={styles.pagination}
          />
        </View>
      </View>

      {/* <View style={styles.pagination}>
        {Slides.map((_, index) => {
          return <View key={index} style={styles.dot} />;
        })}
      </View> */}

      {/*Button*/}
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 40,
          }}>
          <QuibButton
            text={'Join'}
            onPress="Register"
            viewStyle={styles.button}
            textStyle={styles.buttonTxt}
          />
          <QuibButton
            text={'Visit'}
            onPress="Bottom"
            viewStyle={styles.button}
            textStyle={styles.buttonTxt}
          />
        </View>
        <View style={{marginTop: 20, alignItems: 'center'}}>
          <QuibButton
            text={'Log In'}
            onPress="Login"
            viewStyle={styles.button}
            textStyle={styles.buttonTxt}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Style.quibBackColor,
    // paddingHorizontal:vw(1),
    flex: 1,
  },
  headWrap: {
    marginTop: vw(10),
  },
  heading: {
    paddingHorizontal: vw(1),
    color: '#990000',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  flatList: {
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    width:vw(100),
    marginTop: 25,
    // paddingHorizontal: vw(1),
  },
  image: {
    width: vw(95),
    height: vh(35),
    resizeMode: 'contain',
    // marginHorizontal:vw(1)
  },
  pagination: {
    bottom: 20,
    justifyContent: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE,
    backgroundColor: '#333',
    marginLeft: DOT_SPACING,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Style.defaultRed,
    width: vw(30),
    height: vw(10),
    borderRadius: vw(2),
    marginBottom: 10,
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

const Slides = [
  {
    key: 1,
    img: require('../../assets/onLanding/BirdmanQuib.png'),
  },
  {
    key: 2,
    img: require('../../assets/onLanding/TheConversationQuib.png'),
  },
  {
    key: 3,
    img: require('../../assets/onLanding/JawsQuibs.png'),
  },
];
