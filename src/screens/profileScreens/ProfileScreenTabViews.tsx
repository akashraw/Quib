import * as React from 'react';
import {
  View,
  useWindowDimensions,
  Text,
  StatusBar,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlatList } from 'react-native-gesture-handler';
import { Shadow } from 'react-native-shadow-2';
import {
  TabView,
  SceneMap,
  SceneRendererProps,
  NavigationState,
} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import { vh, vw } from 'rxn-units';
import QuibButton from '../../components/QuibButton';
import { API } from '../../constants/Api';
import { Style } from '../../constants/Styles';
import MovieCard from '../visitScreens/MovieCard';

const Dummy = [
  { key: 1, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 2, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 3, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 4, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 5, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 6, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 7, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 8, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 9, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 10, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 11, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 12, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 13, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 14, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 15, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 16, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 17, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 18, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 19, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 20, title: 'Arrival', year: 2015, director: 'Test Testing' },
  { key: 21, title: 'Arrival', year: 2015, director: 'Test Testing 1' },
  { key: 22, title: 'Arrival', year: 2015, director: 'Test Testing asd' },
  { key: 23, title: 'Arrival', year: 2015, director: 'Test Testing asd' },
  { key: 24, title: 'Arrival', year: 2015, director: 'Test Testing asd' },
  { key: 25, title: 'Arrival', year: 2015, director: 'Test Testing asd' },
];

type Route = {
  key: string;
  title: string;
  // icon: React.ComponentProps<typeof Ionicons>['name'];
};

type State = NavigationState<Route>;

const Quibbed = () => {
  return (
    // <View style={{ backgroundColor: Style.quibHeader, width: vw(95), height: vw(10), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3), alignSelf: 'center', alignItems: 'center', marginTop: vw(3), paddingLeft: vw(3) }}>
    //     <Text style={{ color: Style.defaultRed, fontSize: 18, fontWeight: 'bold' }}>Quibbed</Text>
    //     <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
    //         <Text style={{ color: Style.defaultTxtColor, fontSize: 18, fontWeight: 'normal' }}>0</Text>
    //         <Icon name='chevron-right' color={Style.defaultTxtColor} size={18} style={{ paddingTop: vw(.6), paddingLeft: vw(4) }} />
    //     </View>
    // </View>
    <View style={{ flex: 1, paddingHorizontal: vw(2), alignSelf: 'center' }}>
      <FlatList
        initialScrollIndex={0}
        showsVerticalScrollIndicator={false}
        data={Dummy}
        numColumns={3}
        ListFooterComponent={<View style={{ height: vw(22) }} />}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }: any) => (
          <View
            style={{ justifyContent: 'center', alignItems: 'center' }}>
            <MovieCard
              key={index}
              title={item.title}
              year={item.year}
              director={item.director}
              viewStyle={undefined}
              textStyle={undefined}
              linearGradStyle={undefined}
            />
          </View>
        )}
      />
    </View>
  );
};
const Following = () => {
  return (
    <TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          //   alignItems: 'center',
          //   alignSelf: 'center',
        }}>
        {/* bannner top */}

        {/* <View style={{ flexDirection:'row' ,alignSelf:'center', justifyContent:'space-between', alignItems:'center'}}> */}
        <View style={styles.followFollowers}>
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: vw(14),
                height: vw(14),
                borderRadius: vw(8),
                marginRight: vw(2),
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
              //   resizeMode={FastImage.resizeMode.contain}
              source={require('../../assets/Movie/arrival.jpeg')}
            />
            <View>
              <Text style={[styles.title, styles.txt, { fontSize: 14 }]}>
                @itzTimmy
              </Text>
              <Text
                style={[
                  styles.year,
                  styles.txt,
                  { fontSize: 12, textAlign: 'center' },
                ]}>
                Timithoe
              </Text>
            </View>
          </View>
          <QuibButton
            text={'Unfollow'}
            onPress={undefined}
            viewStyle={styles.button}
            textStyle={styles.buttonTxt}
          />
        </View>
      </View>
      {/* </View> */}
    </TouchableOpacity>
  );
};
const Followers = () => {
  return (
    <Shadow containerStyle={{ alignSelf:'center'}} distance={5}>
      <TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            //   alignItems: 'center',
            //   alignSelf: 'center',
          }}>
          {/* bannner top */}

          {/* <View style={{ flexDirection:'row' ,alignSelf:'center', justifyContent:'space-between', alignItems:'center'}}> */}
          <View style={styles.followFollowers}>
            <View
              style={{
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: vw(14),
                  height: vw(14),
                  borderRadius: vw(8),
                  marginRight: vw(2),
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
                //   resizeMode={FastImage.resizeMode.contain}
                source={require('../../assets/Movie/arrival.jpeg')}
              />
              <View>
                <Text style={[styles.title, styles.txt, { fontSize: 14 }]}>
                  @itzTimmy
                </Text>
                <Text
                  style={[
                    styles.year,
                    styles.txt,
                    { fontSize: 12, textAlign: 'center' },
                  ]}>
                  Timithoe
                </Text>
              </View>
            </View>
            <QuibButton
              text={'Follow'}
              onPress={undefined}
              viewStyle={styles.button}
              textStyle={styles.buttonTxt}
            />
          </View>
        </View>
        {/* </View> */}
      </TouchableOpacity>
    </Shadow>

  );
};

export default function ProfileScreenTabViews() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Quibbed' },
    { key: 'second', title: 'Following' },
    { key: 'thrid', title: 'Followers' },
  ]);

  const renderScene = SceneMap({
    first: Quibbed,
    second: Following,
    thrid: Followers,
  });
  const renderItem =
    ({
      navigationState,
      position,
    }: {
      navigationState: State;
      position: Animated.AnimatedInterpolation<number>;
    }) =>
      ({ route, index }: { route: Route; index: number }) => {
        const inputRange = navigationState.routes.map((_, i) => i);

        const activeOpacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i: number) => (i === index ? 1 : 0)),
        });
        const inactiveOpacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i: number) => (i === index ? 0 : 1)),
        });

        return (
          <View style={styles.tab}>
            <Animated.View style={[styles.item, { opacity: inactiveOpacity }]}>
              <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
            </Animated.View>
            <Animated.View
              style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}>
              <Text style={[styles.label, styles.active]}>{route.title}</Text>
            </Animated.View>
          </View>
        );
      };

  const renderTabBar = (
    props: SceneRendererProps & { navigationState: State },
  ) => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route: Route, index: number) => {
        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}>
            {renderItem(props)({ route, index })}
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  return (
    <TabView
      swipeEnabled={false}
      style={{ marginTop: StatusBar.currentHeight }}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
const styles = StyleSheet.create({
  tabbar: {
    borderRadius: vw(1),
    marginBottom: vw(2),
    marginHorizontal: vw(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Style.quibPlayColor,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
      width: 0,
    },
    zIndex: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .2)',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
  },
  activeItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  active: {
    color: Style.defaultRed,
  },
  inactive: {
    color: '#939393',
  },
  icon: {
    height: 26,
    width: 26,
  },
  label: {
    fontSize: 18,
    marginVertical: vw(1.5),
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  followFollowers: {
    paddingHorizontal: vw(3),
    // paddingTop:vw(1),
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: vw(95),
    height: vw(18),
    borderRadius: vw(2),
    flexDirection: 'row',
    paddingTop: vw(0.5),
    // justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    // elevation: 2,
    zIndex: 2,
  },
  txt: {
    fontSize: 14,
    color: Style.defaultTxtColor,
    fontWeight: 'bold',
    // textAlign: 'center'
  },
  title: {},
  year: {},
  director: {},
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
  movieCardViewStyleProp: {
    width: vw(25),
    height: vw(32),
    borderColor: '#fff',
    borderRadius: vw(2),
  },
  movieCardGradStleProp: {
    width: vw(25),
    height: vw(16),
    justifyContent: 'flex-end',
    top: vw(16),
    borderRadius: vw(2),
  },
});
