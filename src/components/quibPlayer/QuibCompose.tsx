import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  TouchableWithoutFeedback,
  StatusBar,
  Animated,
  Alert,
  Dimensions,
  Keyboard,
} from 'react-native';
import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {vh, vw} from 'rxn-units';
import {FlatList} from 'react-native-gesture-handler';
import {Style} from '../../constants/Styles';
import {quibPlayerStyles} from './QuibPlayerStyle';
import {Divider} from '@rneui/themed';
import {
  SceneMap,
  TabView,
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';
import getFormattedTime, {getTotalTime} from '../GetFormattedTime';
import FastImage from 'react-native-fast-image';
import {
  DeleteBump,
  AddQuib,
  QuibByMovieAndUserId,
  DeleteQuib,
  PostQuib,
} from '../../services/QuibAPIs';
import {API, PostQuibAPI} from '../../constants/Api';
import DropShadow from 'react-native-drop-shadow';
import Modal from 'react-native-modal';
import {Button} from 'react-native-paper';
import NumberPlease from 'digicard-react-native-number-please';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

import {stylesCompTab} from './QuibComposeStyle';

const deviceHeight = Dimensions.get('screen').height;

type FD = {
  Quib: string;
  time: number;
};
interface props {
  movieLength: number;
  MovieId: number;
  // hour: number,
  // mins: number,
  bumpId: number;
  time: number;
  device: boolean;
  userId: string;
}
type PostQuibProp = {
  MovieId: number;
  body: string;
  userId: string;
  time: number;
};

type Route = {
  key: string;
  title: string;
};
type State = NavigationState<Route>;

function QuibCompose({
  MovieId,
  time,
  movieLength,
  userId,
  device,
  bumpId,
}: props) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [QuibInput, setQuibInput] = useState<string>('');
  const [FlatData, setFlatData] = useState<any[]>([]);
  const [FD, setFD] = useState<any[]>([]);
  const layout = useWindowDimensions();
  const [Refresh, setRefresh] = useState(false);
  const [index, setIndex] = React.useState(0);
  const initialQuibTime = {hours: 0, minutes: 0, seconds: 0};
  const [Times, setTimes] = useState(0);
  const MyStreamFlatlistRef = useRef<any>(null);
  const SavedFlatlistRef = useRef<any>(null);
  const [routes] = React.useState([
    {key: 'first', title: 'My Stream'},
    {key: 'second', title: 'Saved Quib'},
  ]);
  const Input = useRef<TextInput>(null);
  const styles = device ? stylesCompTab : style;
  // const [isModalVisible, setModalVisible] = useState(false);

  const CountDown = [
    {id: 'hours', label: 'hr', min: 0, max: 24},
    {id: 'minutes', label: 'min', min: 0, max: 60},
    {id: 'seconds', label: 'sec', min: 0, max: 60},
  ];

  useEffect(() => {
    setTimes(time);
    QuibByMovieAndUserId({MovieId, userId}).then((res: any) => {
      setFlatData(res.filter((item: any) => item.newUserId == userId));
      setFD(res);
    });
  }, []);
  useEffect(() => {
    console.log(bumpId);
  }, []);
  // const hideDatePicker = () => {
  //   setDatePickerVisibility(false);
  // };

  // const handleConfirm = (date: any) => {
  //   console.warn('A date has been picked: ', date);
  //   hideDatePicker();
  // };

  function Timer() {
    let {hours, mintues, seconds} = getFormattedTime(Times);
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = (QT: any) => {
      const a = getTotalTime(QT);
      if (a > movieLength) {
        Alert.alert('Error', 'Time entered does not exist', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        return;
      } else {
        setTimes(a);
        return setModalVisible(!isModalVisible);
      }
    };
    function TimeModal() {
      const [quibTime, setQuibTime] = useState(initialQuibTime);

      return (
        <Modal
          isVisible={isModalVisible}
          coverScreen={true}
          hasBackdrop={true}
          backdropColor="black"
          backdropOpacity={0.7}
          onBackdropPress={() => setModalVisible(false)}
          onBackButtonPress={() => setModalVisible(false)}
          useNativeDriver={true}
          useNativeDriverForBackdrop={true}
          statusBarTranslucent={true}
          deviceHeight={deviceHeight}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Style.quibBackColor,
              height: vh(20),
              borderRadius: vw(2),
            }}>
            <Text>Select time(HH:MM:SS)</Text>
            <NumberPlease
              pickers={CountDown}
              values={quibTime}
              onChange={values => setQuibTime(values)}
            />
            <Button
              mode="contained"
              onPress={() => toggleModal(quibTime)}
              buttonColor={Style.defaultRed}>
              Submit
            </Button>
          </View>
        </Modal>
      );
    }
    return (
      <View>
        <TimeModal />
        <TouchableOpacity onPress={toggleModal}>
          <View style={styles.button}>
            <Text style={styles.buttonTxt}>
              {hours < 10 ? `0${hours}` : `${hours}`}:
              {mintues < 10 ? `0${mintues}` : `${mintues}`}:
              {seconds < 10 ? `0${seconds}` : `${seconds}`}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  const MyStreamFlatlist = () => {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        style={{alignSelf: 'center', marginHorizontal: vw(0)}}
        contentContainerStyle={{
          justifyContent: 'center',
          alignSelf: 'center',
          marginHorizontal: vw(0),
        }}
        data={FlatData}
        extraData={FlatData}
        renderItem={({item, index}) => (
          <MyStreamQuibs item={item} index={index} heart={false} />
        )}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={30}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialScrollIndex={0}
        ref={MyStreamFlatlistRef}
        // onRefresh={}
      />
    );
  };
  const SavedQuib = () => {
    return (
      <FlatList
        ref={SavedFlatlistRef}
        showsHorizontalScrollIndicator={false}
        style={{alignSelf: 'center', marginHorizontal: vw(0)}}
        contentContainerStyle={{
          justifyContent: 'center',
          alignSelf: 'center',
          marginHorizontal: vw(0),
        }}
        data={FD}
        extraData={FD}
        renderItem={({item, index}) => (
          <SavedQuibs item={item} index={index} heart={true} />
        )}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={30}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        initialScrollIndex={0}
      />
    );
  };
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
    ({route, index}: {route: Route; index: number}) => {
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
          <Animated.View style={[styles.item, {opacity: inactiveOpacity}]}>
            {/* <Ionicons
          name={route.icon}
          size={26}
          style={[styles.icon, styles.inactive]}
        /> */}
            <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
          </Animated.View>
          <Animated.View
            style={[styles.item, styles.activeItem, {opacity: activeOpacity}]}>
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
    props: SceneRendererProps & {navigationState: State},
  ) => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route: Route, index: number) => {
        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}>
            {renderItem(props)({route, index})}
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  const setData = () => {
    Keyboard.dismiss();
    if (QuibInput == '') {
      return Toast.show({
        visibilityTime: 5000,
        autoHide: true,
        type: 'error',
        text1: 'Empty field',
        text2: 'Please write a Quib before saving it.',
      });
    } else if (Times == 0) {
      return Toast.show({
        visibilityTime: 5000,
        autoHide: true,
        type: 'error',
        text1: 'Timer is at zero',
        text2: 'Please enter a correct time.',
      });
    } else
      AddQuib({
        MovieId: MovieId,
        userId: userId,
        time: Times,
        body: QuibInput,
      } as PostQuibProp)
        .then(() => setRefresh(true))
        .then(() => Input.current?.clear())
        .then(() =>
          Toast.show({
            visibilityTime: 3000,
            autoHide: true,
            type: 'success',
            text1: 'Quib Added',
            text2: 'Quib is added to your stream',
          }),
        )
        .then(() =>
          QuibByMovieAndUserId({MovieId, userId}).then((res: any) => {
            setFlatData(res.filter((item: any) => item.newUserId == userId));
          }),
        );
  };
  async function Post({quibId, time, body}: any) {
    const headerOptions = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    };
    try {
      let response = await fetch(
        `${PostQuibAPI}?body=${body}&QuibId=${quibId}&Time=${time}`,
        headerOptions,
      );
      if (response.status == 200) {
        return QuibByMovieAndUserId({MovieId, userId})
          .then((res: any) => {
            setFlatData(res.filter((item: any) => item.newUserId == userId));
          })
          .then(() =>
            Toast.show({
              visibilityTime: 3000,
              autoHide: true,
              type: 'success',
              text1: 'Quib Posted',
              text2: 'Quib is successfully posted.',
            }),
          );
      }
    } catch (error) {
      console.log('AddQuib API error: ' + error);
    }
  }

  const deleteBump = ({id, movieId, index}: any) => {
    console.log('bump');
    Promise.resolve(DeleteBump({quibId: id, MovieId: movieId, userId: userId}))
      .then(() => handleRemoveBumpItem(index))
      .then(() => console.log('deleted'));
  };
  const deletePost = ({id, index}: any) => {
    console.log('post' + id);
    Promise.resolve(DeleteQuib(id)).then(() => handleRemovePostItem(index));
  };

  const handleRemovePostItem = (idx: number) => {
    // assigning the list to temp variable
    const temp = [...FlatData];

    // removing the element using splice
    temp.splice(idx, 1);

    // updating the list
    setFlatData(temp);
  };
  const handleRemoveBumpItem = (idx: number) => {
    // assigning the list to temp variable
    const temp = [...FD];

    // removing the element using splice
    temp.splice(idx, 1);

    // updating the list
    setFD(temp);
  };
  const MyStreamQuibs = ({item, index, heart}: any) => {
    let {hours, mintues, seconds} = getFormattedTime(item.time);
    const [Edit, setEdit] = useState<string>(item.body);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [Trash, setTrash] = useState(false);
    const [Pencil, setPencil] = useState(false);
    const [Plane, setPlane] = useState(false);
    const [Save, setSave] = useState(false);
    const [isSave, setIsSave] = useState(false);

    if (item.isPosted == true && item.isScreenshot == false)
      return (
        <View style={{width: vw(100)}} key={index}>
          <DropShadow
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.5,
              shadowRadius: vw(0.5),
            }}>
            <View style={styles.quibCard}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: vw(1),
                }}>
                <View
                  style={[
                    ...[quibPlayerStyles.timer],
                    {width: vw(14), height: vw(4)},
                  ]}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      fontSize: vw(2.6),
                    }}>
                    {hours < 10 ? `0${hours}` : `${hours}`}:
                    {mintues < 10 ? `0${mintues}` : `${mintues}`}:
                    {seconds < 10 ? `0${seconds}` : `${seconds}`}
                  </Text>
                </View>
                {heart == true ? (
                  <View style={{right: vw(3), position: 'absolute'}}>
                    <Icon name="heart" size={vw(5)} color={Style.defaultRed} />
                  </View>
                ) : null}
              </View>
              <View style={styles.quibTxtBody}>
                <Text
                  style={{
                    color: Style.defaultTxtColor,
                    fontSize: device ? vw(2.5) : vw(3.6),
                    textAlign: 'left',
                  }}>
                  {/* {' '} */}
                  {item.body}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  paddingLeft: vw(8),
                }}>
                {/* <TouchableOpacity
                  activeOpacity={0.4}
                  disabled={false}
                  onPress={() =>
                    deleteBump({
                      id: item.id,
                      movieId: item.movieId,
                      index: index,
                    })
                  }>
                  <View
                    style={[
                      ...[styles.button],
                      { width: vw(16), height: vw(6) },
                    ]}>
                    <Text style={[...[styles.buttonTxt], { fontSize: vw(3.5) }]}>
                      Delete
                    </Text>
                  </View>
                </TouchableOpacity> */}
              </View>
            </View>
          </DropShadow>
        </View>
      );
    else if (item.isPosted == true && item.isScreenshot == true) {
      return (
        // <View style={{width: vw(100)}} key={index}>
        //   <DropShadow
        //     style={{
        //       shadowColor: '#000',
        //       shadowOffset: {
        //         width: 0,
        //         height: 0,
        //       },
        //       shadowOpacity: 0.5,
        //       shadowRadius: vw(0.5),
        //     }}>
        //     <View style={styles.quibCard}>
        //       <View style={{justifyContent: 'center', alignItems: 'center'}}>
        //         <View
        //           style={[
        //             ...[quibPlayerStyles.timer],
        //             {width: vw(14), height: vw(4), marginBottom: vw(1)},
        //           ]}>
        //           <Text
        //             style={{
        //               textAlign: 'center',
        //               color: '#fff',
        //               fontSize: vw(2.6),
        //             }}>
        //             {hours < 10 ? `0${hours}` : `${hours}`}:
        //             {mintues < 10 ? `0${mintues}` : `${mintues}`}:
        //             {seconds < 10 ? `0${seconds}` : `${seconds}`}
        //           </Text>
        //         </View>
        //         {heart == true ? (
        //           <View style={{right: vw(3), position: 'absolute'}}>
        //             <Icon name="heart" size={vw(5)} color={Style.defaultRed} />
        //           </View>
        //         ) : null}
        //       </View>
        //       <View
        //         style={{
        //           width: vw(90),
        //           alignSelf: 'center',
        //           justifyContent: 'center',
        //           alignItems: 'center',
        //         }}>
        //         {/* <Shadow distance={8} startColor='#00000020' endColor='#00000000' > */}
        //         <DropShadow
        //           style={{
        //             shadowColor: '#000',
        //             shadowOffset: {
        //               width: 0,
        //               height: 0,
        //             },
        //             shadowOpacity: 5,
        //             shadowRadius: vw(1),
        //           }}>
        //           <FastImage
        //             source={{
        //               uri: API + item.body,
        //               cache: FastImage.cacheControl.immutable,
        //               priority: FastImage.priority.normal,
        //             }}
        //             resizeMode={FastImage.resizeMode.cover}
        //             style={{
        //               width: vw(75),
        //               height: vw(32),
        //               marginVertical: vw(2),
        //             }}
        //           />
        //         </DropShadow>
        //         {/* </Shadow> */}
        //       </View>
        //       {/* <View
        //         style={{
        //           justifyContent: 'flex-start',
        //           flexDirection: 'row',
        //           paddingLeft: vw(8),
        //         }}>
        //         <TouchableOpacity
        //           activeOpacity={0.4}
        //           disabled={false}
        //           onPress={() =>
        //             deleteBump({ id: item.id, movieId: item.movieId, index })
        //           }>
        //           <View
        //             style={[
        //               ...[styles.button],
        //               device ? { width: vw(14), height: vw(5) } : { width: vw(16), height: vw(6) },
        //             ]}>
        //             <Text style={[...[styles.buttonTxt]]}>
        //               Delete
        //             </Text>
        //           </View>
        //         </TouchableOpacity>
        //       </View> */}
        //     </View>
        //   </DropShadow>
        // </View>
        null
      );
    } else
      return (
        <View style={{width: vw(100)}} key={index}>
          <DropShadow
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.5,
              shadowRadius: vw(0.5),
            }}>
            <View style={styles.quibCard}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View
                  style={[
                    ...[quibPlayerStyles.timer],
                    {width: vw(14), height: vw(4), marginBottom: vw(1)},
                  ]}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      fontSize: vw(2.6),
                    }}>
                    {hours < 10 ? `0${hours}` : `${hours}`}:
                    {mintues < 10 ? `0${mintues}` : `${mintues}`}:
                    {seconds < 10 ? `0${seconds}` : `${seconds}`}
                  </Text>
                </View>
                {heart == true ? (
                  <View style={{right: vw(3), position: 'absolute'}}>
                    <Icon name="heart" size={vw(5)} color={Style.defaultRed} />
                  </View>
                ) : null}
              </View>
              {isEdit ? (
                <TextInput
                  placeholder={item.body}
                  value={Edit}
                  placeholderTextColor={Style.defaultTxtColor}
                  multiline={true}
                  style={{
                    paddingHorizontal: vw(3),
                    backgroundColor: Style.quibPlayerCardBack,
                    borderWidth: 1,
                    borderRadius: vw(1),
                    fontSize: device ? vw(3) : vw(3.6),
                    borderColor: Style.borderColor,
                    width: vw(90),
                    height: device ? vh(10) : vh(14),
                    marginBottom: vw(1),
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    color: 'black',
                    alignSelf: 'center',
                  }}
                  onChange={({nativeEvent: {text}}) => {
                    setIsSave(!Save);
                    setEdit(text);
                  }}
                />
              ) : (
                <View style={styles.quibTxtBody}>
                  <Text
                    style={{
                      color: Style.defaultTxtColor,
                      fontSize: device ? vw(2.5) : vw(3.6),
                      textAlign: 'left',
                    }}>
                    {item.body}
                  </Text>
                </View>
              )}
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  paddingHorizontal: vw(0),
                }}>
                {/* <TouchableOpacity
                  activeOpacity={0.4}
                  disabled={false}
                  onPress={() => deletePost({id: item.id, index})}>
                  <View
                    style={[
                      ...[styles.button],
                      device
                        ? {width: vw(14), height: vw(5)}
                        : {width: vw(16), height: vw(6)},
                    ]}>
                    <Text style={[...[styles.buttonTxt]]}>Delete</Text>
                  </View>
                </TouchableOpacity> */}
                {/* new button */}
                <View
                  style={[
                    ...[styles.button],
                    device
                      ? {width: vw(28), height: vw(5), borderRadius: vw(7)}
                      : {width: vw(32), height: vw(6), borderRadius: vw(8)},
                  ]}>
                  {/* <Divider orientation="vertical" color="white" /> */}
                  <TouchableOpacity
                    activeOpacity={0.4}
                    disabled={false}
                    onPress={() => {
                      setTrash(Trash => (Trash = !Trash));
                      deletePost({id: item.id, index});
                    }}>
                    <View
                      style={{
                        width: vw(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: vw(6),
                      }}>
                      <IonIcon
                        name={Trash ? 'trash' : 'trash-outline'}
                        size={device ? vw(3) : vw(4)}
                        color={'white'}
                      />
                    </View>
                  </TouchableOpacity>

                  <Divider orientation="vertical" color="white" />

                  <TouchableOpacity
                    activeOpacity={0.4}
                    disabled={false}
                    onPress={() => {
                      if (isSave) {
                        setPencil(Pencil => (Pencil = !Pencil));
                        setIsSave(!isSave);
                        setIsEdit(!isEdit);
                      } else {
                        setPencil(Pencil => (Pencil = !Pencil));
                        setIsEdit(!isEdit);
                      }
                    }}>
                    <View
                      style={{
                        // borderLeftWidth: 1,
                        // borderRightWidth: 1,
                        width: vw(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: vw(6),
                      }}>
                      {isSave ? (
                        <IonIcon
                          name={Save ? 'save' : 'save-outline'}
                          size={device ? vw(3) : vw(4)}
                          color={'white'}
                        />
                      ) : (
                        <Icon
                          name={Pencil ? 'pencil' : 'pencil-outline'}
                          size={device ? vw(3) : vw(4)}
                          color={'white'}
                        />
                      )}
                    </View>
                  </TouchableOpacity>

                  <Divider orientation="vertical" color="white" />

                  <TouchableOpacity
                    activeOpacity={0.4}
                    disabled={false}
                    onPress={() =>
                      Post({
                        quibId: item.id,
                        body: item.body,
                        time: item.time,
                      })
                    }>
                    <View
                      style={{
                        width: vw(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: vw(6),
                      }}>
                      <IonIcon
                        name={Plane ? 'paper-plane' : 'paper-plane-outline'}
                        size={device ? vw(3) : vw(4)}
                        color={'white'}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                {/*  */}

                {/* <TouchableOpacity
                  activeOpacity={0.4}
                  disabled={false}
                  onPress={() =>
                    Post({quibId: item.id, body: item.body, time: item.time})
                  }>
                  <View
                    style={[
                      ...[styles.button],
                      device
                        ? {width: vw(14), height: vw(5)}
                        : {width: vw(16), height: vw(6)},
                    ]}>
                    <Text style={[...[styles.buttonTxt]]}>Post</Text>
                  </View>
                </TouchableOpacity> */}
              </View>
            </View>
          </DropShadow>
        </View>
      );
  };
  const SavedQuibs = ({item, index, heart}: any) => {
    let {hours, mintues, seconds} = getFormattedTime(item.time);

    if (item.isSeedQuib == true && item.isScreenshot == false)
      return (
        <View style={{width: vw(100)}} key={index}>
          <DropShadow
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.5,
              shadowRadius: vw(0.5),
            }}>
            <View style={styles.quibCard}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: vw(1),
                }}>
                <View
                  style={[
                    ...[quibPlayerStyles.timer],
                    {width: vw(14), height: vw(4)},
                  ]}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      fontSize: vw(2.6),
                    }}>
                    {hours < 10 ? `0${hours}` : `${hours}`}:
                    {mintues < 10 ? `0${mintues}` : `${mintues}`}:
                    {seconds < 10 ? `0${seconds}` : `${seconds}`}
                  </Text>
                </View>
                {heart == true ? (
                  <View style={{right: vw(3), position: 'absolute'}}>
                    <Icon name="heart" size={vw(5)} color={Style.defaultRed} />
                  </View>
                ) : null}
              </View>
              <View style={styles.quibTxtBody}>
                <Text
                  style={{
                    color: Style.defaultTxtColor,
                    fontSize: device ? vw(2.5) : vw(3.6),
                    textAlign: 'left',
                  }}>
                  {/* {' '} */}
                  {item.body}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  paddingLeft: vw(8),
                }}>
                <TouchableOpacity
                  activeOpacity={0.4}
                  disabled={false}
                  onPress={() =>
                    deleteBump({
                      id: item.id,
                      movieId: item.movieId,
                      index: index,
                    })
                  }>
                  <View
                    style={[
                      ...[styles.button],
                      device
                        ? {width: vw(14), height: vw(5)}
                        : {width: vw(16), height: vw(6)},
                    ]}>
                    <Text style={[...[styles.buttonTxt]]}>Delete</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </DropShadow>
        </View>
      );
    if (item.isScreenshot == true)
      return (
        <View style={{width: vw(100)}} key={index}>
          <DropShadow
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.5,
              shadowRadius: vw(0.5),
            }}>
            <View style={styles.quibCard}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View
                  style={[
                    ...[quibPlayerStyles.timer],
                    {width: vw(14), height: vw(4), marginBottom: vw(1)},
                  ]}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      fontSize: vw(2.6),
                    }}>
                    {hours < 10 ? `0${hours}` : `${hours}`}:
                    {mintues < 10 ? `0${mintues}` : `${mintues}`}:
                    {seconds < 10 ? `0${seconds}` : `${seconds}`}
                  </Text>
                </View>
                {heart == true ? (
                  <View style={{right: vw(3), position: 'absolute'}}>
                    <Icon name="heart" size={vw(5)} color={Style.defaultRed} />
                  </View>
                ) : null}
              </View>
              <View
                style={{
                  width: vw(90),
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <Shadow distance={8} startColor='#00000020' endColor='#00000000' > */}
                <DropShadow
                  style={{
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 5,
                    shadowRadius: vw(1),
                  }}>
                  <FastImage
                    source={{
                      uri: API + item.body,
                      cache: FastImage.cacheControl.immutable,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={{
                      width: vw(75),
                      height: vw(32),
                      marginVertical: vw(2),
                    }}
                  />
                </DropShadow>
                {/* </Shadow> */}
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  paddingLeft: vw(8),
                }}>
                <TouchableOpacity
                  activeOpacity={0.4}
                  disabled={false}
                  onPress={() =>
                    deleteBump({id: item.id, movieId: item.movieId, index})
                  }>
                  <View
                    style={[
                      ...[styles.button],
                      device
                        ? {width: vw(14), height: vw(5)}
                        : {width: vw(16), height: vw(6)},
                    ]}>
                    <Text style={[...[styles.buttonTxt]]}>Delete</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </DropShadow>
        </View>
      );
    else
      return (
        <View style={{width: vw(100)}} key={index}>
          <DropShadow
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.5,
              shadowRadius: vw(0.5),
            }}>
            <View style={styles.quibCard}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View
                  style={[
                    ...[quibPlayerStyles.timer],
                    {width: vw(14), height: vw(4), marginBottom: vw(1)},
                  ]}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      fontSize: vw(2.6),
                    }}>
                    {hours < 10 ? `0${hours}` : `${hours}`}:
                    {mintues < 10 ? `0${mintues}` : `${mintues}`}:
                    {seconds < 10 ? `0${seconds}` : `${seconds}`}
                  </Text>
                </View>
                {heart == true ? (
                  <View style={{right: vw(3), position: 'absolute'}}>
                    <Icon name="heart" size={vw(5)} color={Style.defaultRed} />
                  </View>
                ) : null}
              </View>
              <View style={styles.quibTxtBody}>
                <Text
                  style={{
                    color: Style.defaultTxtColor,
                    fontSize: device ? vw(2.5) : vw(3.6),
                    textAlign: 'left',
                  }}>
                  {item.body}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  paddingHorizontal: vw(8),
                }}>
                <TouchableOpacity
                  activeOpacity={0.4}
                  disabled={false}
                  onPress={() =>
                    deleteBump({id: item.id, movieId: item.movieId, index})
                  }>
                  <View
                    style={[
                      ...[styles.button],
                      device
                        ? {width: vw(14), height: vw(5)}
                        : {width: vw(16), height: vw(6)},
                    ]}>
                    <Text style={[...[styles.buttonTxt]]}>Delete</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </DropShadow>
        </View>
      );
  };

  return (
    // <BottomSheetModalProvider>

    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingTop: vw(0),
        backgroundColor: Style.quibBackColor,
      }}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            color: Style.defaultTxtColor,
            fontSize: device ? vw(4) : vw(5.1),
            fontWeight: '500',
            paddingBottom: vw(1),
          }}>
          Write a Quib
        </Text>
      </View>
      {/* <View style={{ backgroundColor: Style.quibPlayerCardBack, borderWidth: 1, borderRadius: vw(1), borderColor: '#fff', width: vw(90), height: vw(30), marginBottom: vw(1), flexDirection:'row', alignItems: 'flex-start', justifyContent: 'flex-start' }}> */}
      {/* <BottomSheetTextInput placeholderTextColor={Style.defaultTxtColor} placeholder='Write a Quib here..' multiline={true} style={{ paddingHorizontal: vw(3) }} onChange={({ nativeEvent: { text } }) => setQuibInput(text)} /> */}
      <TextInput
        ref={Input}
        placeholderTextColor={Style.defaultTxtColor}
        placeholder="Write a Quib here.."
        multiline={true}
        style={{
          paddingHorizontal: vw(3),
          backgroundColor: Style.quibPlayerCardBack,
          borderWidth: 1,
          borderRadius: vw(1),
          fontSize: device ? vw(3) : vw(3.6),
          borderColor: '#fff',
          width: vw(90),
          height: device ? vh(10) : vh(14),
          marginBottom: vw(1),
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          color: 'black',
        }}
        onChange={({nativeEvent: {text}}) => setQuibInput(text)}
      />
      {/* </View> */}
      <View
        style={{
          paddingTop: vw(1),
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: vw(80),
          marginBottom: vw(2),
        }}>
        <Timer />
        <TouchableOpacity
          activeOpacity={0.4}
          disabled={false}
          onPress={setData}>
          <View style={styles.button}>
            <Text style={styles.buttonTxt}>Save</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          flex: 1,
          flexDirection: 'row',
        }}>
        {/* <QuibComposeTabView /> */}
        <TabView
          style={{marginTop: StatusBar.currentHeight}}
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      </View>
      {/* <Toast /> */}
    </View>
    // </BottomSheetModal>
    // {/* </BottomSheetModalProvider> */}
  );
}

const style = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // alignSelf:'flex-end',
    backgroundColor: Style.defaultRed,
    width: vw(18),
    height: vw(6),
    borderRadius: vw(1),
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: vw(3.5),
    color: '#fff',
    fontWeight: '500',
  },
  tabbar: {
    borderRadius: vw(1),
    marginHorizontal: vw(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Style.quibPlayerCardBack,
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
    fontSize: vw(4.6),
    marginVertical: vw(1.5),
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },

  txt: {
    fontSize: vw(3.6),
    color: Style.defaultTxtColor,
    fontWeight: 'bold',
    // textAlign: 'center'
  },
  quibCard: {
    width: vw(95),
    alignSelf: 'center',
    borderRadius: vw(1),
    backgroundColor: Style.quibPlayerCardBack,
    borderWidth: 0,
    // elevation: 4,
    shadowColor: 'black',
    borderColor: Style.borderColor,
    paddingVertical: vw(2),
    marginVertical: vw(4),
  },
  quibTxtBody: {
    width: vw(90),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Style.borderColor,
    borderRadius: vw(1),
    paddingHorizontal: vw(2),
    paddingVertical: vw(3),
    marginVertical: vw(1),
    marginBottom: vw(2),
  },
});

export default memo(QuibCompose);
