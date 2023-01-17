import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, useWindowDimensions, TouchableWithoutFeedback, StatusBar, Animated } from 'react-native'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { vh, vw } from 'rxn-units';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Style } from '../../constants/Styles';
import { quibPlayerStyles } from './QuibPlayerStyle';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useBottomSheetBackHandler } from '../../screens/visitScreens/useBottomSheetBack';
import QuibComposeTabView from './QuibComposeTabView';
import { SceneMap, TabView, NavigationState, SceneRendererProps } from 'react-native-tab-view';

type FD = {
  Quib: string;
  hours: number;
  min: number;
  sec: number;
}
interface props {
  hour: number,
  mins: number,
  secs: number,
}

type Route = {
  key: string;
  title: string;
  // icon: React.ComponentProps<typeof Ionicons>['name'];
};
type State = NavigationState<Route>;


function QuibCompose({ hour, mins, secs }: props) {
  const [QuibInput, setQuibInput] = useState<string>('');
  const [FlatData, setFlatData] = useState<any>([]);
  // const [isVisible, setIsVisible] = useState(true)
  // const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const DataRef = useRef<FD[]>([]);
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'My Stream' },
    { key: 'second', title: 'Saved Quib' },
    // { key: 'thrid', title: 'Followers' },

  ]);
  const MyStreamFlatlist = () => {
    return(
    <FlatList
      showsHorizontalScrollIndicator={false}
      style={{ alignSelf: 'center', marginHorizontal: vw(0),  }}
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
  const SavedQuib = ()  =>{
    return(
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

  // return (
      // <TabView
      //     style={{ marginTop: StatusBar.currentHeight, }}
      //     navigationState={{ index, routes }}
      //     renderScene={renderScene}
      //     renderTabBar={renderTabBar}
      //     onIndexChange={setIndex}
      //     initialLayout={{ width: layout.width }}
      // />
  // );



  // useEffect(() => {
  //   console.log('render');

  //   bottomSheetModalRef.current?.present();

  //   // return () => {
  //   //   second
  //   // }
  // }, [])


  const setData = () => {
    DataRef.current.push({
      Quib: QuibInput,
      hours: hour,
      min: mins,
      sec: secs
    })
    setFlatData([...DataRef.current]);
    // console.log(DataRef.current)
  }
  const Quibs = ({ item, index }: any) => {
    console.log(item);

    return (
      <View style={{ width: vw(100), }} key={index}>
        <ScrollView style={{ width: vw(80), height: vh(26), alignSelf: 'center', borderRadius:vw(4),backgroundColor: '#fff', borderWidth: 1, elevation: 4, shadowColor: 'black', borderColor: Style.borderColor, marginVertical: vw(2) }}>
          <View style={{ justifyContent: 'center', alignItems: 'center',  }}>
            <View style={[...[quibPlayerStyles.timer], { width: vw(14), height: vw(4), marginVertical: vw(1) }]}>
              <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(2.6), }}>{(item.hours < 10) ? `0${item.hours}` : `${item.hours}`}:{(item.min < 10) ? (`0${item.min}`) : `${item.min}`}:{(item.sec < 10) ? (`0${item.sec}`) : `${item.sec}`}</Text>
            </View>
          </View>
          <View style={{ width: vw(75), height: vh(17), alignSelf: 'center', borderWidth: 1, borderColor: Style.borderColor, padding: vw(2) }}>
            <Text style={{ color: Style.defaultTxtColor, textAlign: 'left' }}>{item.Quib}</Text>
          </View>
          <View style={{ justifyContent: 'space-around', flexDirection: 'row', }}>
            <TouchableOpacity style={{ paddingTop: vw(2) }} activeOpacity={.4} disabled={false} >
              <View style={[...[styles.button], { width: vw(16), height: vw(6) }]}>
                <Text style={styles.buttonTxt}>Delete</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingTop: vw(2) }} activeOpacity={.4} disabled={false} >
              <View style={[...[styles.button], { width: vw(16), height: vw(6) }]}>
                <Text style={styles.buttonTxt}>Post</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }


  return (
    // <BottomSheetModalProvider>

    <View style={{ flex: 1, alignItems: 'center', paddingTop: vw(0) }}>
      <View><Text style={{ fontSize: 20, fontWeight: '500', paddingBottom: vw(2) }}>Write a Quib</Text></View>
      <View style={{ backgroundColor: '#e2e2e2', borderWidth: 1, borderRadius: vw(4), borderColor: '#fff', width: vw(90), height: vw(35) }}>
        <TextInput placeholder='Write a Quib here..' multiline={true} style={{ paddingHorizontal: vw(3) }} onChange={({ nativeEvent: { text } }) => setQuibInput(text)} />
      </View>
      <TouchableOpacity style={{ paddingTop: vw(1), flexDirection: 'row', justifyContent: 'flex-end', width: vw(80) }} activeOpacity={.4} disabled={false} onPress={setData}>
        <View style={styles.button}>
          <Text style={styles.buttonTxt}>Save</Text>
        </View>
      </TouchableOpacity>
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
    height: vw(7),
    borderRadius: vw(2),
    marginBottom: 10,
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
    fontWeight: '500'
  },
  tabbar: {
    borderRadius:vw(1),
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
})

export default memo(QuibCompose);