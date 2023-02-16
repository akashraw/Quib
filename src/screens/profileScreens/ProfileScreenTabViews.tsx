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
import { API } from '../../constants/Api';
import { Style } from '../../constants/Styles';
import { getMovieByUserId, getFollowersByUserId, getFolloweeByUserId, UnFollowUser } from '../../services/QuibAPIs';
import MovieCard from '../chooseMovieScreen/MovieCard';
import ProfileStream from './ProfileStream';

type Route = {
  key: string;
  title: string;
  // icon: React.ComponentProps<typeof Ionicons>['name'];
};

type State = NavigationState<Route>;

export default function ProfileScreenTabViews({ navi, followerId }: any) {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Quibbed' },
    { key: 'second', title: 'Following' },
    { key: 'thrid', title: 'Followers' },
  ]);
  const [QuibMovie, setQuibMovie] = useState<any[]>([]);
  const [Follower, setFollower] = useState<any[]>([]);
  const [Followee, setFollowee] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false)
  const Followings = useRef<any[]>([]);
  const Follow = useRef<any[]>([]);
  const QuibMovies = useRef<any[]>([]);
  const Auth = React.useContext(AuthContext);

  useEffect(() => {
    Promise.all([
      getMovieByUserId({ userId: '' }).then((res) => { setQuibMovie(res); QuibMovies.current = res }),
      getFollowersByUserId({ userId: '' }).then((res) => { setFollower(res); Follow.current = res }),
      getFolloweeByUserId({ userId: '' }).then((res) => { setFollowee(res); Followings.current = res }),
    ]).then(() => setIsLoaded(true))
    console.log(Follower);
  }, [])

  const Profile = (userId: string) => {
    if (userId != Auth.userName) {
      return navigation.navigate('OtherProfile' as never, { userId: userId } as never);
    } else return navigation.navigate('Profile' as never);
  };

  const unFollowUser = ({ followeeId, index }: any) => {
    Promise.resolve(UnFollowUser({
      FollowerId: followerId.followerId,
      FolloweeId: followeeId
    }).then(() => handleUnFollow(index)))
  }

  const handleUnFollow = (index: any) => {
    let temp = [...Followee];
    temp.splice(index, 1);
    setFollowee(temp);
  }
  const Quibbed = React.useCallback(() => {
    console.log('render');

    return (
      <View style={{ flex: 1, paddingHorizontal: vw(2), alignSelf: 'center', width: vw(100) }}>
        <FlashList
          initialScrollIndex={0}
          showsVerticalScrollIndicator={false}
          data={QuibMovies.current}
          numColumns={3}
          estimatedItemSize={vw(40)}
          // ListFooterComponent={<View style={{ height: vw(22) }} />}
          // keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }: any) => (
            <View
              style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => { navigation.navigate('Stream' as never, { id: followerId, movieId: item.id } as never) }}
              >
                <MovieCard
                  key={index}
                  title={item.title}
                  year={item.releaseYear}
                  director={item.director}
                  viewStyle={undefined}
                  textStyle={undefined}
                  linearGradStyle={undefined}
                  imgSrc={item.posterContentThumb}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  }, [QuibMovies.current]);

  //Following  user list
  const Following = () => {

    const RenderItem = ({ item, index }: any) => {
      let followeeId = item.newFolloweeId;
      return (
        <Shadow containerStyle={{ alignSelf: 'center', borderRadius: vw(2), marginVertical: vw(1), }} distance={5}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              //   alignItems: 'center',
              //   alignSelf: 'center',
              borderRadius: vw(2),
              // marginVertical:vw(2),
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
                      {item.userName}
                    </Text>
                    <Text
                      style={[
                        styles.year,
                        styles.txt,
                        { fontSize: 12, textAlign: 'center' },
                      ]}>
                      {item.firstName} {item.lastName}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={.4} onPress={() => unFollowUser({ followeeId, index })}>
                <View style={styles.button}>
                  <Text style={styles.buttonTxt}>Unfollow</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* </View> */}
        </Shadow>
      )
    }
    return (
      <View style={{ width: vw(100), height: vh(100) }}>
        <FlatList
          data={Followee}
          initialScrollIndex={0}
          showsVerticalScrollIndicator={false}
          // keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }: any) => <RenderItem item={item} index={index} />}
        // estimatedItemSize={20}
        />
      </View>
    )
  };


  const Followers = React.useCallback(() => {
    const RenderItem = ({ item, index }: any) => {
      return (
        <Shadow containerStyle={{ alignSelf: 'center', borderRadius: vw(2), marginVertical: vw(1), }} distance={5}>
          <TouchableOpacity onPress={()=>Profile(item.newFollowerId)}  key={index} style={{ alignSelf: 'center', borderRadius: vw(1) }}>
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
                      {item.userName}
                    </Text>
                    <Text
                      style={[
                        styles.year,
                        styles.txt,
                        { fontSize: 12, textAlign: 'center' },
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
          data={Follow.current}
          initialScrollIndex={0}
          showsVerticalScrollIndicator={false}
          // keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }: any) => <RenderItem item={item} index={index} />}
          estimatedItemSize={20}
        />
      </View>
    );
  }, [Follow.current]);

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
