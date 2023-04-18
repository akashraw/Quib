// import { useNavigation } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core'
import { FlashList } from '@shopify/flash-list';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
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
import { AuthContext } from '../../Auth';
import QuibButton from '../../components/QuibButton';
import { API, image256API } from '../../constants/Api';
import { Style } from '../../constants/Styles';
import { getMovieByUserId, getFollowersByUserId, getFolloweeByUserId, UnFollowUser } from '../../services/QuibAPIs';
import MovieCard from '../chooseMovieScreen/MovieCard';

type Route = {
  total: number;
  key: string;
  title: string;
  // icon: React.ComponentProps<typeof Ionicons>['name'];
};
type Prop = {
  quib: Array<any>;
  followee: Array<any>;
  follower: Array<any>;
  navi: any;
  followerId: string;
  device: boolean;
}

type State = NavigationState<Route>;

export default function OtherProfileScreensTabViews({ quib, followee, follower, navi, followerId, device }: Prop) {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [Quib, setQuib] = useState<any[]>([])
  const [Followee, setFollowee] = useState<any[]>([]);
  const [Follower, setFollower] = useState<any[]>([]);
  const Auth = React.useContext(AuthContext);
  const styles = device ? stylesTab : style;

  useEffect(() => {
    Promise.all([
      setQuib(quib),
      setFollowee(followee),
      setFollower(follower),
    ])
  }, [])

  const [routes] = useState([
    { key: 'first', title: 'Quibbed', total: quib.length },
    { key: 'second', title: 'Following', total: followee.length },
    { key: 'thrid', title: 'Followers', total: follower.length },
  ]);

  const Profile = (userId: string) => {
    if (userId != Auth.userName) {
      return navigation.navigate('OtherProfile' as never, { userId: userId } as never);
    } else return navigation.navigate('Profile' as never);
  };

  const unFollowUser = ({ followeeId, index }: any) => {
    Promise.resolve(UnFollowUser({
      FollowerId: followerId,
      FolloweeId: followeeId
    }).then(() => handleUnFollow(index)))
  }

  const handleUnFollow = (index: any) => {
    let temp = [...Followee];
    temp.splice(index, 1);
    setFollowee(temp);
  }
  const Quibbed = React.useCallback(() => {

    return (
      <View style={{ flex: 1, paddingHorizontal: vw(2), alignSelf: 'center', width: vw(100), height: vh(100) }}>
        <FlashList
          initialScrollIndex={0}
          showsVerticalScrollIndicator={false}
          data={Quib}
          numColumns={3}
          estimatedItemSize={vw(40)}
          renderItem={({ item, index }: any) => (
            <View
              style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => { navigation.navigate('Stream' as never, { id: followerId, movieId: item.id, device: Auth.DeviceType  } as never) }}
              >
                <MovieCard
                  key={index}
                  title={item.title}
                  year={item.releaseYear}
                  director={item.director}
                  viewStyle={styles.viewStyle}
                  textStyle={styles.txtStyle}
                  linearGradStyle={undefined}
                  imgSrc={item.posterContentThumb}
                />
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={<></>}
          ListFooterComponentStyle={{ paddingBottom: vh(20) }}
        />
      </View>
    );
  }, [Quib]);

  //Following  user list
  const Following = React.useCallback(() => {

    const RenderItem = ({ item, index }: any) => {
      // let followeeId = item.newFolloweeId;
      return (
        <Shadow containerStyle={{ alignSelf: 'center', borderRadius: vw(2), marginVertical: vw(1), }} distance={5}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              borderRadius: vw(2),
            }}>
            {/* bannner top */}

            {/* <View style={{ flexDirection:'row' ,alignSelf:'center', justifyContent:'space-between', alignItems:'center'}}> */}
            <View style={styles.followFollowers}>
              <TouchableOpacity key={index} style={{ alignSelf: 'center', borderRadius: vw(1) }}>
                <View
                  style={{
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={
                      device ?
                        {
                          width: vw(8),
                          height: vw(8),
                          borderRadius: vw(4),
                          marginRight: vw(2),
                          resizeMode: 'contain',
                          alignSelf: 'center',
                        }
                        :
                        {
                          width: vw(14),
                          height: vw(14),
                          borderRadius: vw(8),
                          marginRight: vw(2),
                          resizeMode: 'contain',
                          alignSelf: 'center',
                        }}
                    //   resizeMode={FastImage.resizeMode.contain}
                    source={{ uri: `${image256API}${item.avatarBase256ImagePath}` }}

                  />
                  <View>
                    <Text style={[styles.title, styles.txt, { fontSize: vw(3.6) }]}>
                      {item.userName}
                    </Text>
                    <Text
                      style={[
                        styles.year,
                        styles.txt,
                        { fontSize: device ? vw(2.5) : vw(3.1), textAlign: 'center' },
                      ]}>
                      {item.firstName} {item.lastName}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity activeOpacity={.4} onPress={() => unFollowUser({ followeeId, index })}>
                <View style={styles.button}>
                  <Text style={styles.buttonTxt}>Unfollow</Text>
                </View>
              </TouchableOpacity> */}
            </View>
          </View>
          {/* </View> */}
        </Shadow>
      )
    }
    return (
      <View style={{ width: vw(100), }}>
        <FlashList
          data={Followee}
          initialScrollIndex={0}
          showsVerticalScrollIndicator={false}
          style={{height:vw(100)}}
          // keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }: any) => <RenderItem item={item} index={index} />}
          estimatedItemSize={20}
          ListFooterComponent={<></>}
          ListFooterComponentStyle={{ paddingBottom: vw(18) }}
        />
      </View>
    )
  }, [Followee]);


  const Followers = React.useCallback(() => {
    const RenderItem = ({ item, index }: any) => {
      return (
        <Shadow containerStyle={{ alignSelf: 'center', borderRadius: vw(2), marginVertical: vw(1), }} distance={5}>
          <TouchableOpacity onPress={() => Profile(item.newFollowerId)} key={index} style={{ alignSelf: 'center', borderRadius: vw(1) }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                borderRadius: vw(2),
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
                    style={
                      device ?
                        {
                          width: vw(8),
                          height: vw(8),
                          borderRadius: vw(4),
                          marginRight: vw(2),
                          resizeMode: 'contain',
                          alignSelf: 'center',
                        }
                        :
                        {
                          width: vw(14),
                          height: vw(14),
                          borderRadius: vw(8),
                          marginRight: vw(2),
                          resizeMode: 'contain',
                          alignSelf: 'center',
                        }}
                    //   resizeMode={FastImage.resizeMode.contain}
                    source={{ uri: `${image256API}${item.avatarBase256ImagePath}` }}

                  />

                  <View >
                    <Text style={[styles.title, styles.txt, { fontSize: device ? vw(3) : vw(3.6) }]}>
                      {item.userName}
                    </Text>
                    <Text
                      style={[
                        styles.year,
                        styles.txt,
                        { fontSize: device ? vw(2.5) : vw(3.1), textAlign: 'center' },
                      ]}>
                      {item.firstName} {item.lastName}
                    </Text>
                  </View>
                </View>
                {/* <QuibButton
                  text={'Unfollow'}
                  onPress={undefined}
                  viewStyle={styles.button}
                  textStyle={styles.buttonTxt}
                /> */}
              </View>
            </View>
            {/* </View> */}
          </TouchableOpacity>
        </Shadow>
      )
    }
    return (
      <View style={{ width: vw(100), height: vh(100) }}>
        <FlashList
          data={Follower}
          initialScrollIndex={0}
          showsVerticalScrollIndicator={false}
          // keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }: any) => <RenderItem item={item} index={index} />}
          estimatedItemSize={20}
          ListFooterComponent={<></>}
          ListFooterComponentStyle={{ paddingBottom: vw(18) }}
        />
      </View>
    );
  }, [Follower]);

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
              <Text style={[styles.label, styles.inactive]}>{route.total}</Text>
              <Text style={[...[styles.label, styles.inactive], { fontSize: device ? vw(3) : vw(3.6), paddingBottom:vw(1) }]}>{route.title}</Text>
            </Animated.View>
            <Animated.View style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}>
              <Text style={[styles.label, styles.active]}>{route.total}</Text>
              <Text style={[[styles.label, styles.active], { fontSize: device ? vw(3) : vw(3.6), paddingBottom:vw(1) }]}>{route.title}</Text>
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
      swipeEnabled={true}
      style={{ marginTop: StatusBar.currentHeight }}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
const style = StyleSheet.create({
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
    height: vw(6.5),
    width: vw(6.5),
  },
  label: {
    fontSize: vw(5.5),
    marginTop: vw(1),
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
    flexDirection: 'row',
    paddingTop: vw(0.5),
    // justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    // elevation: 2,
    zIndex: 2,
  },
  txt: {
    fontSize: vw(3.6),
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
    fontSize: vw(3.6),
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
  viewStyle: {
    width: vw(28),
    height: vw(40),
    borderColor: '#fff',
    borderRadius: vw(2)
  },
  txtStyle: {
    bottom: 0,
    fontSize: vw(3),
    // fontFamily: 'Roboto',
    // textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'transparent',
  }
});
const stylesTab = StyleSheet.create({
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
    height: vw(6.5),
    width: vw(6.5),
  },
  label: {
    fontSize: vw(3.6),
    marginTop: vw(1),
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  followFollowers: {
    paddingHorizontal: vw(3),
    // paddingTop:vw(1),
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: vw(95),
    height: vw(10),
    flexDirection: 'row',
    paddingTop: vw(0.5),
    // justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    // elevation: 2,
    zIndex: 2,
  },
  txt: {
    fontSize: vw(3.6),
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
    width: vw(18),
    height: vw(6),
    borderRadius: vw(2),
    // marginBottom: 10,
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: vw(3),
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
  viewStyle: {
    width: vw(28),
    height: vw(40),
    borderColor: '#fff',
    borderRadius: vw(2)
  },
  txtStyle: {
    bottom: 0,
    fontSize: vw(3),
    // fontFamily: 'Roboto',
    // textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'transparent',
  }
});
