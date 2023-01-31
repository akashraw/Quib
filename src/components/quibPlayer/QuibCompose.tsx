import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, useWindowDimensions, TouchableWithoutFeedback, StatusBar, Animated } from 'react-native'
import React, { memo, useEffect, useRef, useState } from 'react'
import { vh, vw } from 'rxn-units';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Style } from '../../constants/Styles';
import { quibPlayerStyles } from './QuibPlayerStyle';
import { SceneMap, TabView, NavigationState, SceneRendererProps } from 'react-native-tab-view';
import getFormattedTime from '../GetFormattedTime';
import FastImage from 'react-native-fast-image';
import { DeleteBump, AddQuib, QuibByMovieAndUserId, DeleteQuib } from '../../services/QuibAPIs';
import { API } from '../../constants/Api';
import { Shadow } from 'react-native-shadow-2';
import DropShadow from 'react-native-drop-shadow';

type FD = {
  Quib: string;
  time: number;
}
interface props {
  MovieId: number,
  hour: number,
  mins: number,
  secs: number,
  time: number,
}
type PostQuibProp = {
  MovieId: number,
  body: string,
  userId: string,
  time: number,
}

type Route = {
  key: string;
  title: string;
};
type State = NavigationState<Route>;


function QuibCompose({ MovieId, hour, mins, secs, time }: props) {
  const [QuibInput, setQuibInput] = useState<string>('');
  const [FlatData, setFlatData] = useState<any[]>([]);
  const DataRef = useRef<FD[]>([]);
  const layout = useWindowDimensions();
  const [Refresh, setRefresh] = useState(false);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'My Stream' },
    { key: 'second', title: 'Saved Quib' },

  ]);
  useEffect(() => {
    QuibByMovieAndUserId({ MovieId, userId: '' })
      .then((res: any) => setFlatData(res))

  }, [])

  const MyStreamFlatlist = () => {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{ alignSelf: 'center', marginHorizontal: vw(0), }}
        contentContainerStyle={{ justifyContent: 'center', alignSelf: 'center', marginHorizontal: vw(0) }}
        data={FlatData}
        extraData={FlatData}
        renderItem={({ item, index }) => < Quibs item={item} index={index} />}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={30}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialScrollIndex={0}
      />)
  }
  const SavedQuib = () => {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{ alignSelf: 'center', marginHorizontal: vw(0) }}
        contentContainerStyle={{ justifyContent: 'center', alignSelf: 'center', marginHorizontal: vw(0) }}
        data={FlatData}
        extraData={FlatData}
        renderItem={({ item, index }) => < Quibs item={item} index={index} />}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={30}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialScrollIndex={0}
      />
    )
  }
  const renderScene = SceneMap({
    first: MyStreamFlatlist,
    second: SavedQuib,
    // thrid: Followers,
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
              {/* <Ionicons
          name={route.icon}
          size={26}
          style={[styles.icon, styles.inactive]}
        /> */}
              <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
            </Animated.View>
            <Animated.View
              style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}
            >
              {/* <Ionicons
          name={route.icon}
          size={26}
          style={[styles.icon, styles.active]}
        /> */}
              <Text style={[styles.label, styles.active]}>{route.title}</Text>
            </Animated.View>
          </View>
        );
      };

  const renderTabBar = (
    props: SceneRendererProps & { navigationState: State }
  ) => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route: Route, index: number) => {
        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}
          >
            {renderItem(props)({ route, index })}
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  const setData = () => {
    AddQuib({ MovieId: MovieId, userId: '', time: time, body: QuibInput } as PostQuibProp).then(() => setRefresh(true));


    // DataRef.current.push({
    //   Quib: QuibInput,
    //   time:time
    // })
    // setFlatData([...DataRef.current]);
  }

  const deletePost = ({ id, movieId }: any) => {
    Promise.resolve(DeleteBump({ quibId: id, MovieId: movieId, userId: 'fe8288eb-5cfe-4b26-b676-9ce3bbb9e1c1' })
      .then(() => handleRemoveItem(index)))
  }

  const handleRemoveItem = (idx: number) => {
    // assigning the list to temp variable
    const temp = [...FlatData];

    // removing the element using splice
    temp.splice(idx, 1);

    // updating the list
    setFlatData(temp);
  }

  const Quibs = ({ item, index }: any) => {
    let { hours, mintues, seconds } = getFormattedTime(item.time)

    if (item.isSeedQuib == true && item.isScreenshot == false)
      return (
        <View style={{ width: vw(100), }} key={index}>
          <DropShadow
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: .5,
              shadowRadius: vw(.5),
            }}
          >
            <View style={styles.quibCard}>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: vw(1) }}>
                <FastImage source={{ uri: `data:image/png;base64,${item.avatarBase32ImagePath}` }} style={{ width: vw(2), height: vw(2), }} resizeMode='contain' />
                <View style={[...[quibPlayerStyles.timer], { width: vw(14), height: vw(4) }]}>
                  <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(2.6), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                </View>
              </View>
              <View style={styles.quibTxtBody}>
                <Text style={{ color: Style.defaultTxtColor, textAlign: 'left' }}> {item.body}</Text>
              </View>
              <View style={{ justifyContent: 'flex-start', flexDirection: 'row', paddingLeft: vw(8)}}>
                <TouchableOpacity activeOpacity={.4} disabled={false} onPress={() => deletePost({ id: item.id, movieId: item.movieId })}>
                  <View style={[...[styles.button], { width: vw(16), height: vw(6) }]}>
                    <Text style={[...[styles.buttonTxt], { fontSize: 12 }]}>Delete</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </DropShadow>
        </View>
      )
    if (item.isScreenshot == true)
      return (
        <View style={{ width: vw(100), }} key={index}>
          <DropShadow
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: .5,
              shadowRadius: vw(.5),
            }}
          >
            <View style={styles.quibCard}>
              <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <View style={[...[quibPlayerStyles.timer], { width: vw(14), height: vw(4), marginBottom: vw(1) }]}>
                  <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(2.6), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                </View>
              </View>
              <View style={{ width: vw(90), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}>
                {/* <Shadow distance={8} startColor='#00000020' endColor='#00000000' > */}
                <DropShadow
                  style={{
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0,
                    shadowRadius: vw(.5),
                  }}
                >
                  <FastImage
                    source={{
                      uri: API + item.body,
                      cache: FastImage.cacheControl.immutable,
                      priority: FastImage.priority.normal
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={{ width: vw(75), height: vw(32), marginVertical: vw(2) }}
                  />
                </DropShadow>
                {/* </Shadow> */}
              </View>
              <View style={{ justifyContent: 'flex-start', flexDirection: 'row',  paddingLeft: vw(8) }}>
                <TouchableOpacity activeOpacity={.4} disabled={false} onPress={() => deletePost({ id: item.id, movieId: item.movieId })}>
                  <View style={[...[styles.button], { width: vw(16), height: vw(6) }]}>
                    <Text style={[...[styles.buttonTxt], { fontSize: 12 }]}>Delete</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </DropShadow>
        </View>
      )
    else return (
      <View style={{ width: vw(100), }} key={index}>
        <DropShadow
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: .5,
            shadowRadius: vw(.5),
          }}
        >
          <View style={styles.quibCard}>
            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
              <View style={[...[quibPlayerStyles.timer], { width: vw(14), height: vw(4), marginBottom: vw(1) }]}>
                <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(2.6), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
              </View>
            </View>
            <View style={styles.quibTxtBody}>
              <Text style={{ color: Style.defaultTxtColor, textAlign: 'left' }}>{item.body}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal:vw(8) }}>
              <TouchableOpacity activeOpacity={.4} disabled={false} onPress={() => DeleteQuib(item.id)} >
                <View style={[...[styles.button], { width: vw(16), height: vw(6) }]}>
                  <Text style={[...[styles.buttonTxt], { fontSize: 12 }]}>Delete</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={.4} disabled={false} >
                <View style={[...[styles.button], { width: vw(16), height: vw(6) }]}>
                  <Text style={[...[styles.buttonTxt], { fontSize: 12 }]}>Post</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </DropShadow>
      </View>
    )
  }


  return (
    // <BottomSheetModalProvider>

    <View style={{ flex: 1, alignItems: 'center', paddingTop: vw(0) }}>
      <View><Text style={{ color: Style.defaultTxtColor, fontSize: 20, fontWeight: '500', paddingBottom: vw(1) }}>Write a Quib</Text></View>
      <View style={{ backgroundColor: '#e2e2e2', borderWidth: 1, borderRadius: vw(1), borderColor: '#fff', width: vw(90), height: vw(30) }}>
        <TextInput placeholderTextColor={Style.defaultTxtColor} placeholder='Write a Quib here..' multiline={true} style={{ paddingHorizontal: vw(3) }} onChange={({ nativeEvent: { text } }) => setQuibInput(text)} />
      </View>
      <View style={{ paddingTop: vw(1), flexDirection: 'row', justifyContent: 'space-around', width: vw(80), marginBottom: vw(-4) }}>
        <TouchableOpacity activeOpacity={.4} disabled={false} onPress={setData}>
          <View style={styles.button}>
            <Text style={styles.buttonTxt}>Save</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center', alignSelf: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row' }}>
        {/* <QuibComposeTabView /> */}
        <TabView
          style={{ marginTop: StatusBar.currentHeight, }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
        />

      </View>
    </View>
    // </BottomSheetModal>
    // {/* </BottomSheetModalProvider> */}
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf:'flex-end',
    backgroundColor: Style.defaultRed,
    width: vw(18),
    height: vw(6),
    borderRadius: vw(1),
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
    fontWeight: '500'
  },
  tabbar: {
    borderRadius: vw(1),
    marginHorizontal: vw(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
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
  label: {
    fontSize: 18,
    marginVertical: vw(1.5),
    backgroundColor: 'transparent',
    fontWeight: 'bold'
  },

  txt: {
    fontSize: 14,
    color: Style.defaultTxtColor,
    fontWeight: 'bold',
    // textAlign: 'center'
  },
  quibCard: {
    width: vw(95),
    alignSelf: 'center',
    borderRadius: vw(1),
    backgroundColor: '#fff',
    borderWidth: 0,
    // elevation: 4,
    shadowColor: 'black',
    borderColor: Style.borderColor,
    paddingVertical: vw(2),
    marginVertical: vw(4)
  },
  quibTxtBody: {
    width: vw(90),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Style.borderColor,
    borderRadius: vw(1),
    paddingHorizontal: vw(2),
    paddingVertical: vw(3),
    marginVertical:vw(1),
    marginBottom:vw(2)
  },
})

export default memo(QuibCompose);