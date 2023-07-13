import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Style } from '../../constants/Styles';
import { vmax, vw, vh } from 'rxn-units';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import IconMat from 'react-native-vector-icons/MaterialIcons';
import PageHeader from '../CustomHeader';
import Slider from '@react-native-community/slider';
// import { Slider } from '@miblanchard/react-native-slider';
import { API } from '../../constants/Api';
import FastImage from 'react-native-fast-image';
import {
  AddBump,
  getMovieLength,
  getMoviePoster,
  GetQuibsById,
  QuibByMovieAndUserId,
} from '../../services/QuibAPIs';
import { LocalSvg } from 'react-native-svg';
import QuibCarousel from './QuibCarousel';
import QuibCompose from './QuibCompose';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useBottomSheetBackHandler } from '../../screens/chooseMovieScreen/useBottomSheetBack';
import LinearGradient from 'react-native-linear-gradient';
import getFormattedTime from '../GetFormattedTime';
import Toast from 'react-native-toast-message';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import DropShadow from 'react-native-drop-shadow';
import { BlurView } from '@react-native-community/blur';
import { AuthContext } from '../../Auth';
import Modal from 'react-native-modal';
import QuibButton from '../QuibButton';
import Skeleton from './Skeleton';
import { style, stylesTab } from './PlayerStyles';
import { motify, MotiView, useDynamicAnimation } from 'moti';
import { Easing, interpolate } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

interface props {
  navigation: any;
  route: any;
}
interface BumpProp {
  quibId: number;
  movieId: number;
  userId: string;
}
const { width, height } = Dimensions.get('window');
const colors = {
  black: '#323F4E',
  red: '#F76A6A',
  text: '#ffffff',
};

interface Dimension {
  width: number;
  height: number;
}

const ITEM_SIZE = width * 0.38;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;
// const ITEM_SPACING = (width - ITEM_SIZE) / 2;

export default function QuibPlayer({ navigation, route }: props) {
  // const isMovieMove = useRef<boolean>(); //used for dualSync
  const QuibCarTimeRef = useRef<any>(0);
  const [Res, setRes] = useState<any>([]);
  const QuibScurbCarRef = useRef<Slider>(null);
  // const isQuibMove = useRef<boolean>(); //used for dualSync
  const [AllSync, setAllSync] = useState<boolean>(false)
  const [Active, setActive] = useState(false);
  const [MovieLen, setMovieLen] = useState<number>(0);
  const length = useRef<number>(0);
  const isActive = useRef(false);
  const isSync = useRef(true);
  const isTapped = useRef(false);
  const timer = useRef(0);
  const [MovieTime, setMovieTime] = useState(0);
  const [QuibTime, setQuibTime] = useState(0);
  const [PlayPause, setPlayPause] = useState('play-circle-outline');
  const { hours, mintues, seconds } = getFormattedTime(MovieTime);
  const [movieQuib, setMovieQuib] = useState<any[]>([]);
  const [IsLoading, setIsLoading] = useState(true);
  const flatRef = useRef<any>(null);
  const posterRef = useRef(String);
  const [isPoster, setIsPoster] = useState(Boolean);
  const MovieId = route.params;
  const quibTimeRef = useRef<number[]>([]);
  const [QuibTimeRef, setQuibTimeRef] = useState<number[]>([]);
  const quibPlayIndexRef = useRef<number>(0);
  const resMap = useRef<any[]>([]);
  const [isVisble, setIsVisble] = useState(false);
  const CarouselOnRef = useRef<boolean>(false);
  const [Time, setTime] = useState<number>(0);
  const TimeRef = useRef<number>(0);
  // const [isVisbleModal, setIsVisbleModal] = useState(false);
  const [BumpId, setBumpId] = useState<number>(0);
  const QuibCarRef = useRef<any>(null);
  const [Sync, setSync] = useState<boolean>(true); //used for dualSync
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { handleSheetPositionChange } =
    useBottomSheetBackHandler(bottomSheetModalRef);
  const Auth = React.useContext(AuthContext);
  const ScurbIndexCarRef = useRef(0);
  const [True, setTrue] = useState(0);
  const [BumpData, setBumpData] = useState<any[]>([]);
  const BumpDataRef = useRef<any[]>([]);
  const styles = Auth.DeviceType ? stylesTab : style;
  const scrollY = useRef(new Animated.Value(0)).current;
  const AnimatedSlider = motify(Slider)();
  const AnimatedIconMat = motify(IconMat)();
  const AnimatedIcon = motify(Icon)();
  const AnimatedBlurView = motify(BlurView)();
  const [StateWidth, setStateWidth] = useState<number>(0);
  const [StateHeight, setStateHeight] = useState<number>(0);
  const ScurbIndex = useRef<number>(0);
  // const [ITEM_SIZE, setITEM_SIZE] = useState(width * 0.38);
  // const [ITEM_SPACING, setITEM_SPACING] = useState((width - ITEM_SIZE) / 2);
  const [IsLand, setIsLand] = useState(true);
  const [IsCine, setIsCine] = useState(true);
  const [FlatTouch, setFlatTouch] = useState<boolean>(true);
  const TouchRef = React.useRef<boolean>(false);
  const AllSyncRef = useRef<boolean>(true)
  const onViewableItemsChangedMain = ({ viewableItems, changed }: any) => {

    if (TouchRef.current == true) {
      if (viewableItems[0]?.item.time == undefined) {
        return null;
      } else if (AllSyncRef.current == true) {
        console.log(`AllSyncRef ==> ${AllSyncRef.current}`)
        setMovieTime(viewableItems[0]?.item.time)
        setQuibTime(viewableItems[0]?.item.time);
      } else {
        console.log(`AllSyncRef ==> ${AllSyncRef.current}`)
        setQuibTime(viewableItems[0]?.item.time)
      }
    }
  }

  const BlurState = useDynamicAnimation(() => {
    return {
      scale: 1,
      translateY: vw(0),
      opacity: 1,
    };
  });
  const BlurStateRight = useDynamicAnimation(() => {
    return {
      scale: 1,
      translateX: vw(0),
      opacity: 1,
    };
  });
  const FlatWrap = useDynamicAnimation(() => {
    return {
      width: vw(76),
    };
  });
  // const animateSlider = useDynamicAnimation(() => {
  //   return {
  //     rotate: '90deg',
  //     scale: 1,
  //     translateY: vw(0),
  //     opacity: 1,
  //   };
  // });
  // const animateIconMatButton = useDynamicAnimation(() => {
  //   return {
  //     scale: 1,
  //     opacity: 1,
  //     translateY: vw(-2),
  //     translateX: vw(0)
  //   }
  // });
  // const animateIconButton = useDynamicAnimation(() => {
  //   return {
  //     scale: 1,
  //     opacity: 1,
  //     translateY: vw(2),
  //     translateX: vw(0)
  //   }
  // });
  //Api calls

  useEffect(() => {
    if (QuibTime == MovieTime) {
      setSync(true);
    }
    if (movieQuib.length != 0) {
      const Reduce = movieQuib.reduce((accumulator, current) => {
        return Math.abs(current.time - QuibTime) <
          Math.abs(accumulator.time - QuibTime)
          ? current
          : accumulator;
      });
      const ScurbIndex = movieQuib.findIndex((item, index) => {
        if (item.time == Reduce.time) {
          return index;
        }
      });
      if (ScurbIndex < 0) {
        flatRef.current?.scrollToOffset({
          animated: true,
          offset: 0,
        });
      } else {
        // toggle;
        flatRef.current?.scrollToIndex({
          animated: true,
          index: ScurbIndex,
        });
      }
      // +++++++++++Carousel on ++++++++++++++\\
      if (CarouselOnRef.current == false) {
        setIsVisble(false);
      }
    }
  }, [QuibTime]);

  useEffect(() => {
    const Abort = new AbortController();
    console.log(MovieTime)
    console.log(QuibTime)
    Promise.all([
      QuibByMovieAndUserId({
        MovieId: MovieId.MovieId,
        userId: Auth.userName,
      }).then((res: any) => {
        BumpDataRef.current = res;
        setBumpData(BumpData => (BumpData = res));
      }),
      getMoviePoster(MovieId.MovieId)
        .then(
          (res: any) =>
            (posterRef.current = res.map((res: any) => res.posterContent)),
        )
        .then(() => FileCheck()),
      GetQuibsById(MovieId).then((res: any) => {
        setRes(
          (Res: any) =>
            (Res = res.filter((item: any) => item.isScreenshot == true)),
        );
        setMovieQuib(res);
        setQuibTimeRef(res.map((res: any) => res.time));
        // Image.getSize(API + Res[1].body, (width, height) => { setState((State: { width: number; height: number; }) => State={ width: width, height: height }) });
      }),
      getMovieLength(MovieId).then((res: any) => {
        setMovieLen(res[0].length);
        length.current = res[0].length;
      }),
    ]).then(() => setIsLoading(false));
    // .then(() =>
    //   Image.getSize(`http://3.88.43.237` + Res[1].body, (width, height) => {
    //     // setStateWidth(StateWidth => StateWidth = width);
    //     // setStateHeight(StateHeight => StateHeight = height);
    //     // console.log('width: ', width, ' height: ', height);

    //     if (width / height < 1.8 && width / height > 1.6) {  //is Land
    //       console.log('valid')
    //       setITEM_SIZE((ITEM_SIZE) => ITEM_SIZE = (width * 0.38));
    //       setITEM_SPACING((ITEM_SPACING) => ITEM_SPACING = (width - ITEM_SIZE) / 2);
    //       return setIsCine(IsCine => IsCine = false);

    //     } else if (width / height < 1.6) {                    // is nothing
    //       console.log('valid else if')
    //       setITEM_SIZE((ITEM_SIZE) => ITEM_SIZE = (width * 0.38));
    //       setITEM_SPACING((ITEM_SPACING) => ITEM_SPACING = (width - ITEM_SIZE) / 2)
    //       setIsLand(IsLand => IsLand = false);
    //       return setIsCine(IsCine => IsCine = false);
    //     } else {                                              // is Cine
    //       console.log('valid else')
    //       setIsCine(true);
    //       return setIsLand(true)
    //     }
    //   }));
    return () => {
      Abort.abort();
    };
  }, []);

  // movie timer  stopwatch
  useEffect(() => {
    if (MovieTime == QuibTime) {
      if (isActive.current && MovieTime < MovieLen) {
        timer.current = setInterval(() => {
          setQuibTime(MovieTime);
          setMovieTime(MovieTime => MovieTime + 1);
        }, 1000);
      } else {
        clearInterval(timer.current);
        setPlayPause('play-circle-outline');
        isActive.current = false;
      }
    } else {
      if (isActive.current && MovieTime < MovieLen) {
        timer.current = setInterval(() => {
          // setQuibTime(MovieTime + 1);
          setMovieTime(MovieTime => MovieTime + 1);
        }, 1000);
      } else {
        clearInterval(timer.current);
        setPlayPause('play-circle-outline');
        isActive.current = false;
      }
    }
    return () => clearInterval(timer.current);
  }, [isActive.current, MovieTime]);

  //UseEffect use to scroll
  useEffect(() => {
    if (MovieTime == QuibTime && isSync.current == true) {
      if (QuibTimeRef[quibPlayIndexRef.current] == MovieTime) {
        // console.log('if')
        flatRef.current?.scrollToIndex({
          animated: true,
          index: quibPlayIndexRef.current,
        });
        quibPlayIndexRef.current = quibPlayIndexRef.current + 1;
      } else if (
        QuibTimeRef[quibPlayIndexRef.current] ==
        QuibTimeRef[quibPlayIndexRef.current - 1]
      ) {
        // console.log('else if')
        flatRef.current?.scrollToIndex({
          animated: true,
          index: quibPlayIndexRef.current,
        });
        quibPlayIndexRef.current = quibPlayIndexRef.current + 1;

        // console.log('add ' + QuibTimeRef[quibPlayIndexRef.current] + 'movie' + MovieTime)
      } else {
        let a = QuibTimeRef.findIndex((item, index) => {
          if (item == MovieTime) {
            quibPlayIndexRef.current = index;
            // return index;
          }
        });
        flatRef.current?.scrollToIndex({
          animated: true,
          index: a,
        });
      }
    }
    return () => { };
  }, [MovieTime]);

  // for sync operation //
  useEffect(() => {
    if (Res.length != 0) {
      const Reduce = Res.reduce(
        (accumulator: { time: number }, current: { time: number }) => {
          return Math.abs(current.time - QuibTime) <
            Math.abs(accumulator.time - QuibTime)
            ? current
            : accumulator;
        },
      );
      ScurbIndexCarRef.current = Res.findIndex(
        (item: { time: any }, index: any) => {
          if (item.time == Reduce.time) {
            return index;
          }
        },
      );
    }
  }, [QuibTime]);

  //==Animate==//
  useEffect(() => {
    if (isActive.current == true) {
      // Quibs.animateTo({
      //   scale: 1.25
      // });
      BlurState.animateTo({
        scale: 0.7,
        translateY: vw(2),
        opacity: 0.5,
      }),
        BlurStateRight.animateTo({
          scale: 0.7,
          translateX: vw(1.5),
          opacity: 0.5,
        }),
        FlatWrap.animateTo({
          width: vw(80),
        });
      // animateSlider.animateTo({
      //   rotate: '90deg',
      //   scale: .70,
      //   translateY: vw(2),
      //   opacity: .5,
      // });
      // animateIconButton.animateTo({
      //   scale: .70,
      //   opacity: .5,
      //   translateX: vw(2),
      //   translateY: vw(-4)
      // });
      // animateIconMatButton.animateTo({
      //   scale: .70,
      //   opacity: .5,
      //   translateX: vw(2),
      //   translateY: vw(4)
      // })
    } else {
      // Quibs.animateTo({
      //   scale: 1.25
      // });
      FlatWrap.animateTo({
        width: vw(76),
      });
      BlurState.animateTo({
        scale: 1,
        translateY: vw(0),
        opacity: 1,
      }),
        BlurStateRight.animateTo({
          scale: 1,
          translateX: vw(0),
          opacity: 1,
        });
      // animateSlider.animateTo({
      //   rotate: '90deg',
      //   scale: 1,
      //   translateY: vw(0),
      //   opacity: 1,
      // });
      // animateIconButton.animateTo({
      //   scale: 1,
      //   opacity: 1,
      //   translateX: vw(0),
      //   translateY: vw(0)
      // });
      // animateIconMatButton.animateTo({
      //   scale: 1,
      //   opacity: 1,
      //   translateX: vw(0),
      //   translateY: vw(0)
      // });
    }

    return () => { };
  }, [isActive.current]);

  //file check
  const FileCheck = () => {
    let FS = posterRef.current.toString().split('.').pop();

    if (FS == 'jpeg' || FS == 'jpg') {
      setIsPoster(true);
      return;
    } else setIsPoster(false);
  };

  //play button control
  const toggle = () => {
    if (isActive.current == false) {
      isActive.current = true;
      return setPlayPause('pause-circle-outline');
    } else {
      isActive.current = false;
      return setPlayPause('play-circle-outline');
    }
  };

  const CheckBump = (Bump: number) => {
    setBumpId(BumpId => (BumpId = Bump));
    let Index = BumpDataRef.current.findIndex(Id => Id.id == Bump);
    // console.log(Index)
    if (Index != -1) {
      setBumpId(bump => (bump = 0));
      return Toast.show({
        visibilityTime: 2000,
        autoHide: true,
        type: 'info',
        text1: 'Already Bumped',
        text2: 'Quib is already in  your stream.',
      });
    } else {
      return AddBump({
        quibId: Bump,
        MovieId: MovieId.MovieId,
        userId: Auth.userName,
      })
        .then(() =>
          Toast.show({
            visibilityTime: 3000,
            autoHide: true,
            type: 'success',
            text1: 'Bumped!',
            text2: 'Quib has been add to your stream successfully.',
          }),
        )
        .then(() => BumpDataRef.current.push({ id: Bump }))
        .then(() => bottomSheetModalRef.current?.expand());
    }
  };

  //Inc and dec on timer
  const IncSecond = () => {
    if (MovieTime < MovieLen) return setMovieTime(MovieTime => MovieTime + 1);
  };
  const DecSecond = () => {
    if (MovieTime > 0) return setMovieTime(MovieTime => MovieTime - 1);
  };

  // to sync the movie and quib scruber
  const SyncQuibTime = () => {
    // isMovieMove.current = false; //used for dualSync
    // isQuibMove.current = false;
    setSync(true);
    setQuibTime(Time => (Time = MovieTime));
    const Reduce = movieQuib.reduce(
      (accumulator, current) => {
        return Math.abs(current.time - MovieTime) <
          Math.abs(accumulator.time - MovieTime)
          ? current
          : accumulator;
      },
    );
    let Scurb: number = movieQuib.findIndex(
      (item, index) => {
        if (item.time == Reduce.time) {
          return index;
        }
      },
    );
    if (Scurb < 0) {
      flatRef.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
    } else {
      flatRef.current?.scrollToIndex({
        animated: true,
        index: Scurb,
      });
    }
  };
  //used for dualSync
  // const SyncMovieTime = () => {
  //     isMovieMove.current = false;
  //     isQuibMove.current = false;
  //     setMovieTime(QuibTime);
  // }

  const Profile = (userId: string) => {
    if (isActive.current == true) {
      isActive.current = false;
      return setPlayPause('play-circle-outline');
    }
    if (userId != Auth.userName) {
      return navigation.navigate('OtherProfile', { userId: userId });
    } else return navigation.navigate('Profile');
  };
  const HandlePress = (time: number) => {
    let Temp = Time;
    setTime(time);
    if (time == Temp) {
      HandlePressed(time);
      // bottomSheetModalRef.current?.present();
    } else {
      // setTime(Time => Time = time);
      HandlePressed(time);
    }
  };
  const HandlePressed = (time: number) => {
    TimeRef.current = time;
    bottomSheetModalRef.current?.present();
  };
  //Quib list quibs head in (profile image, name, timestamp and quib)
  const QuibHead = useCallback(
    ({
      hours,
      mintues,
      seconds,
      name,
      quibId,
      time,
      userId,
      image,
      index,
    }: any) => {
      let FS: any;
      if (image != null) {
        FS = image.split('.').pop();
      } else {
        FS = null;
      }
      // console.log(BumpData.includes(quibId))

      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: vw(1.5),
            marginBottom: vw(4),
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              // paddingVertical: vw(1.5),
              // alignItems: 'center',
              // alignSelf: 'center',
            }}>
            <View
              style={{
                flex: 1,
                left: 0,
                position: 'absolute',
              }}>
              {image != null ? (
                <TouchableOpacity
                  onPress={() =>
                    Auth.isGuest == true ? setActive(true) : Profile(userId)
                  }>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <FastImage
                      source={{
                        uri:
                          FS == 'jpeg' || FS == 'jpg' || FS == 'png'
                            ? `${API}Images/User256/${image}`
                            : `data:image/png;base64,${image}`,
                      }}
                      style={styles.avatar}
                    />
                    <Text
                      style={{
                        color: Style.defaultTxtColor,
                        fontSize: Auth.DeviceType ? vw(2.5) : vw(3.1),
                        fontWeight: 'bold',
                        textAlignVertical: 'center',
                        alignItems: 'center',
                      }}
                      numberOfLines={1}>
                      {name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
            <View
              style={{
                justifyContent: 'center',
                position: 'absolute',
                // left: '50%',
                right: '50%',
                marginRight: Auth.DeviceType ? vw(-9) : vw(-11),
              }}>
              <TouchableOpacity
                onPress={() =>
                  Auth.isGuest == true ? setActive(true) : HandlePress(time)
                }>
                <View
                  style={[
                    ...[styles.timer],
                    Auth.DeviceType
                      ? { width: vw(14), height: vw(3.5), marginBottom: vw(0) }
                      : { width: vw(16), height: vw(5), marginBottom: vw(0) },
                  ]}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#fff',
                      fontSize: Auth.DeviceType ? vw(2.5) : vw(3),
                    }}>
                    {hours < 10 ? `0${hours}` : `${hours}`}:
                    {mintues < 10 ? `0${mintues}` : `${mintues}`}:
                    {seconds < 10 ? `0${seconds}` : `${seconds}`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* Bump Api itegrated */}
            <View
              style={{
                right: vw(0),
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() =>
                  Auth.isGuest == true ? setActive(true) : CheckBump(quibId)
                }>
                <Icon
                  // name={"heart-outline"}
                  name={
                    BumpDataRef.current.findIndex(Id => Id.id == quibId) != -1
                      ? 'heart'
                      : 'heart-outline'
                  }
                  size={Auth.DeviceType ? vw(4) : vw(5)}
                  color={Style.defaultRed}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [movieQuib],
  );

  const QuibList = useCallback(
    ({ item, index }: any) => {
      let { hours, mintues, seconds } = getFormattedTime(item.time);
      // console.log(BumpData.includes())
      if (!item.isSeedQuib && !item.isScreenshot) {
        return (
          <TouchableWithoutFeedback
            delayLongPress={300}
            onLongPress={() => {
              setMovieTime(MovieTime => (MovieTime = item.time));
              setQuibTime(QuibTime => (QuibTime = item.time));
            }}>
            <View key={index} style={styles.flatlistContainer}>
              <QuibHead
                time={item.time}
                hours={hours}
                mintues={mintues}
                seconds={seconds}
                image={item.avatarBase32ImagePath}
                isSS={item.isScreenshot}
                name={item.displayName}
                quibId={item.id}
                userId={item.newUserId}
                index={index}
              />
              <View style={[styles.flatlistComps]}>
                <Text
                  style={
                    Auth.DeviceType
                      ? { fontSize: vw(2.5), color: Style.defaultTxtColor }
                      : { fontSize: vw(3.6), color: Style.defaultTxtColor }
                  }>
                  {item.body}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      } else if (item.isSeedQuib == true && !item.isScreenshot) {
        return (
          <TouchableWithoutFeedback
            delayLongPress={300}
            onLongPress={() => {
              setMovieTime(MovieTime => (MovieTime = item.time));
              setQuibTime(QuibTime => (QuibTime = item.time));
            }}>
            <View
              key={index}
              style={[
                ...[styles.flatlistContainer],
                { backgroundColor: Style.quibBlue },
              ]}>
              <QuibHead
                time={item.time}
                hours={hours}
                mintues={mintues}
                seconds={seconds}
                image={item.avatarBase32ImagePath}
                isSS={item.isScreenshot}
                name={item.displayName}
                quibId={item.id}
                userId={item.newUserId}
                index={index}
              />
              <View style={[styles.flatlistComps]}>
                <Text
                  style={
                    Auth.DeviceType
                      ? { fontSize: vw(2.5), color: 'white' }
                      : { fontSize: vw(3.6), color: 'white' }
                  }>
                  {item.body}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      } else {
        return (
          <TouchableWithoutFeedback
            delayLongPress={300}
            onLongPress={() => {
              setMovieTime(MovieTime => (MovieTime = item.time));
              setQuibTime(QuibTime => (QuibTime = item.time));
            }}>
            <View key={index} style={styles.flatlistContainer}>
              <QuibHead
                time={item.time}
                hours={hours}
                mintues={mintues}
                seconds={seconds}
                isSS={item.isScreenshot}
                image={null}
                name={null}
                quibId={item.id}
                userId={item.newUserId}
                index={index}
              />
              <View style={styles.flatlistComps}>
                <FastImage
                  source={{
                    uri: API + item.body,
                    cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{ width: vw(90), height: vw(36) }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      }
    },
    [movieQuib],
  );

  // intial Quib
  const InitialQuib = () => {
    return (
      // <DropShadow
      //   style={{
      //     shadowColor: '#000',
      //     shadowOffset: {
      //       width: 0,
      //       height: 0,
      //     },
      //     shadowOpacity: 0.5,
      //     shadowRadius: vw(1),
      //   }}>
      <MotiView
        style={{
          width: vw(90),
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Style.quibPlayerCardBack,
          marginTop: vw(3),
          marginBottom: vw(2),
          marginRight: vw(3),
          borderRadius: vw(1),
        }}>
        <View>
          <Text style={styles.heading}>Timeline quib for</Text>
        </View>
        <View>
          <FastImage
            style={styles.image}
            source={{
              // uri: `${API}${Poster}`,
              uri: isPoster
                ? `${API}${posterRef.current}`
                : `data:image/jpeg;base64,${posterRef.current}`,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode="contain"
          />
        </View>
      </MotiView>
      // </DropShadow>
    );
  };

  const Flash = useCallback(() => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollX = React.useRef(new Animated.Value(0)).current;

    const renderItem = ({ item, index }: any) => {
      const inputRange = [
        (index - 1) * ITEM_SIZE,
        index * ITEM_SIZE,
        (index + 1) * ITEM_SIZE,
      ];
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.4, 1, 0.4],
      });
      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.7, 1, 0.7],
      });
      return (
        <Animated.View
          style={{
            // flex: 1,
            // width: ITEM_SIZE,
            height: ITEM_SIZE,
            justifyContent: 'center',
            alignItems: 'center',
            // alignSelf:'center',
            opacity,
            transform: [{ scale }],
          }}>
          <QuibCarousel
            isCine={IsCine}
            isLand={IsLand}
            item={item}
            index={index}
            handlePresentModalPress={HandlePress}
            isGuest={Auth.isGuest}
            setActive={setActive}
            MovieId={MovieId.MovieId}
            userId={Auth.userName}
            device={Auth.DeviceType}
            ItemHeight={ITEM_SIZE}
            ItemSpace={ITEM_SPACING}
          />
        </Animated.View>
      );
    };
    return (
      <View
        style={[
          {
            // flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            top: ITEM_SIZE / 4,
            width: vw(100),
            // paddingTop: StatusBar.currentHeight,
          },
          { position: 'absolute' },
        ]}>
        <View
          style={{
            height: ITEM_SIZE * 3,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            // top: height / 3,
            // flex: 1,
            // position:'absolute'
          }}>
          <AnimatedFlashList
            data={Res}
            ref={QuibCarRef}
            onTouchStart={() => {
              if (TouchRef.current == false) {
                TouchRef.current = true;
              }
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={Skeleton}
            keyExtractor={(_, index) => index.toString()}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollX } } }],
              { useNativeDriver: false },
            )}
            bounces={false}
            contentContainerStyle={{
              paddingVertical: ITEM_SPACING,
              paddingHorizontal: ITEM_SPACING,
            }}
            estimatedItemSize={ITEM_SIZE * 6.5}
            viewabilityConfig={{
              viewAreaCoveragePercentThreshold: 10,
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            initialScrollIndex={ScurbIndexCarRef.current}
            snapToInterval={ITEM_SIZE}
            decelerationRate={'fast'}
            renderItem={renderItem}
          />
        </View>
      </View>
    );
  }, [Res]);

  //-========================
  const CarouselPress = () => {
    if (isVisble == false) {
      CarouselOnRef.current = true;
      setIsVisble(!isVisble);
    } else {
      CarouselOnRef.current = false;
      setIsVisble(!isVisble);
    }
  };

  const QuibCarouselModal = useCallback(() => {
    return (
      <Modal
        isVisible={isVisble}
        coverScreen={false}
        hasBackdrop={true}
        backdropColor="black"
        backdropOpacity={0.8}
        customBackdrop={
          <View
            style={{
              flex: 1,
              marginLeft: vw(-10),
              marginRight: vw(-10),
              backgroundColor: 'rgba(0,0,0,1)',
            }}></View>
        }
        onBackdropPress={() => setIsVisble(false)}
        onBackButtonPress={() => setIsVisble(false)}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        statusBarTranslucent={true}
        deviceHeight={deviceHeight}
        deviceWidth={deviceWidth}
        style={{ alignItems: 'center', marginTop: StatusBar.currentHeight }}>
        <Flash />
      </Modal>
    );
  }, [isVisble]);

  // ======== LOFIN MODAL==========
  const LoginModal = useCallback(() => {
    return (
      <Modal
        isVisible={Active}
        coverScreen={true}
        hasBackdrop={true}
        backdropColor="black"
        backdropOpacity={0.7}
        onBackdropPress={() => setActive(false)}
        onBackButtonPress={() => setActive(false)}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        statusBarTranslucent={true}
        deviceHeight={deviceHeight}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <Text style={{ color: '#fff', fontSize: vw(5), fontWeight: '400' }}>
            Please login to access this feature
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <QuibButton
              text={'Do it later'}
              onPressed={() => {
                setActive(false);
              }}
              viewStyle={[
                [styles.button],
                { backgroundColor: Style.defaultGrey },
              ]}
              textStyle={styles.buttonTxt}
            />
            <QuibButton
              text={'Ok, let dot it'}
              onPressed={() => {
                navigation.navigate('Login');
              }}
              viewStyle={styles.button}
              textStyle={styles.buttonTxt}
            />
          </View>
        </View>
      </Modal>
    );
  }, [Active]);

  // variables
  const snapPoints = useMemo(() => ['18%', '90%'], []);

  // Render BackDrop
  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      opacity={0.7}
      onPress={() => bottomSheetModalRef.current?.dismiss}
      pressBehavior="close"
    />
  );

  const QuibComposeModal = useCallback(() => {
    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        detached={false}
        snapPoints={snapPoints}
        // bottomInset={vh(18)}
        onChange={handleSheetPositionChange}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: Style.defaultRed,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
          elevation: 24,
        }}>
        <QuibCompose
          MovieId={MovieId.MovieId}
          userId={Auth.userName}
          time={TimeRef.current}
          // time={Time}
          bumpId={BumpId}
          device={Auth.DeviceType}
          movieLength={MovieLen}
        />
      </BottomSheetModal>
    );
  }, [true]);


  const onViewableItemsChangedMainNotSync = ({ viewableItems, changed }: any) => {
    console.log(AllSync + ' AllSync')
    if (TouchRef.current == true) {
      if (viewableItems[0]?.item.time == undefined) {
        return null;
      } else {
        setQuibTime(viewableItems[0]?.item.time);
      }
    }
  };
  const onViewableItemsChanged = ({ viewableItems, changed }: any) => {
    if (TouchRef.current == true) {
      // console.log(FlatTouch)
      if (viewableItems[0]?.item.time == undefined) {
        return null;
      } else {
        setQuibTime(viewableItems[0]?.item.time);
      }
    }
  };

  const RSide = () => {
    return (
      <View
        // state={animateSlider}
        style={{
          // flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: isActive.current ? vw(8) : vw(8),
          marginTop: Auth.DeviceType ? vw(0) : vw(0),
          // transform: [{ rotate: '-90deg' }]
          borderRadius: vw(5),
          zIndex: 100,
          overflow: 'hidden',
        }}>
        <MotiView
          state={BlurState}
          style={
            Auth.DeviceType
              ? {
                height: vh(16),
                borderRadius: vw(5),
                width: vw(10),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }
              : {
                height: vh(16),
                borderRadius: vw(5),
                width: vw(10),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }
          }>
          <LinearGradient
            colors={['#CCCC9985', Style.quibPlayColor, '#CCCC9985']}
            style={{
              flex: 1,
              width: vw(10),
              backgroundColor: '#00000000',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: vw(5),
            }}>
            <View
              style={{
                borderRadius: vw(6),
              }}>
              <TouchableOpacity
                hitSlop={{
                  top: vw(2),
                  bottom: vw(2),
                  left: vw(4),
                  right: vw(4),
                }}
                onPress={CarouselPress}>
                <AnimatedIconMat
                  // state={animateIconMatButton}
                  // transition={{
                  //   type: 'timing'
                  // }}
                  name="slideshow"
                  size={vw(7)}
                  color={Style.defaultRed}
                  style={{ paddingVertical: vw(2), borderRadius: vw(7) }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={{
                  top: vw(2),
                  bottom: vw(2),
                  left: vw(4),
                  right: vw(4),
                }}
                onPress={SyncQuibTime}
                disabled={Sync}>
                <AnimatedIcon
                  name="repeat"
                  size={vw(7)}
                  color={Sync ? Style.defaultGrey : Style.defaultRed}
                  style={{ paddingVertical: vw(2) }}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </MotiView>
      </View>
    );
  };
  function IsSync() {
    if (AllSync) {
      return false
    } else {
      return Sync
    }
  }

  return (
    <>
      <BottomSheetModalProvider>
        <SafeAreaView
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: Style.quibBackColor,
          }}>
          <View style={styles.container}>
            {/*========================================QUIB CAROUSEL=================================*/}
            <QuibCarouselModal />
            {/*========================================QUIB SCRUBBER==================================*/}
            <MotiView
              state={BlurState}
              style={{
                // flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                width: isActive.current ? vw(3) : vw(3),
                height: vh(60),
                marginTop: Auth.DeviceType ? vw(0) : vw(0),
                borderRadius: vw(8),
                zIndex: 100,
                overflow: 'hidden',
              }}>
              {/* <BlurView
                style={
                  Auth.DeviceType
                    ? {
                      height: vh(55),
                      borderRadius: vw(5),
                      width: vw(5),
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }
                    : {
                      height: vh(55),
                      borderRadius: vw(5),
                      width: vw(5),
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }
                }
                blurType="light"
                blurAmount={10}
                reducedTransparencyFallbackColor="#0000000"
                overlayColor="#00000000">
                <LinearGradient
                  colors={['#CCCC9985', Style.quibPlayColor, '#CCCC9985']}
                  style={{
                    flex: 1,
                    width: vw(5),
                    backgroundColor: '#00000000',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}> */}
              <View
                style={{
                  flex: 1,
                  width: vw(3),
                  backgroundColor: '#00000000',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}>
                <Slider
                  maximumValue={length.current}
                  minimumTrackTintColor={Style.defaultRed}
                  maximumTrackTintColor={Style.defaultTxtColor}
                  thumbTintColor={Style.defaultRed}
                  value={QuibTime}
                  onTouchStart={() => {
                    // TouchRef.current = false;
                  }}
                  style={{
                    width: vh(60),
                    height: vw(100),
                    borderRadius: vw(2),
                    transform: [{ rotate: '90deg' }],
                  }}
                  onSlidingStart={() => {
                    isActive.current = false;
                    isSync.current = false;
                    setSync(false);
                    // setIsVisble(true);
                  }}
                  onValueChange={value => {
                    value = Array.isArray(value) ? value[0] : value;
                    if (Res.length != 0) {
                      const Reduce = Res.reduce(
                        (
                          accumulator: { time: number },
                          current: { time: number },
                        ) => {
                          const val = Array.isArray(value)
                            ? value[0]
                            : value;
                          return Math.abs(current.time - val) <
                            Math.abs(accumulator.time - val)
                            ? current
                            : accumulator;
                        },
                      );
                      ScurbIndexCarRef.current = Res.findIndex(
                        (item: { time: any }, index: any) => {
                          if (item.time == Reduce.time) {
                            // quibScrubIndexRef.current = index;
                            return index;
                          }
                        },
                      );
                      if (ScurbIndexCarRef.current < 0) {
                        QuibCarRef.current?.scrollToOffset({
                          animated: true,
                          offset: 0,
                        });
                      } else {
                        // toggle;
                        QuibCarRef.current?.scrollToIndex({
                          animated: true,
                          index: ScurbIndexCarRef.current,
                        });
                      }
                    }
                  }}
                  step={1}
                  onSlidingComplete={value => {
                    setQuibTime(QuibTime => (QuibTime = value));
                  }}
                />
                {/* <TouchableOpacity
                      hitSlop={{
                        top: vw(2),
                        bottom: vw(2),
                        left: vw(4),
                        right: vw(4),
                      }}
                      onPress={CarouselPress}>
                      <IconMat
                        name="camera"
                        size={vw(4)}
                        color={Style.defaultRed}
                        style={{}}
                      />
                    </TouchableOpacity> */}
              </View>
              {/* </LinearGradient>
              </BlurView> */}
            </MotiView>

            {/*========================================Flatlist FOR QUIB LIST=========================== */}
            <View
              style={{ height: vh(100), width: vw(95), paddingBottom: vh(8) }}>
              <FlashList
                data={movieQuib}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={InitialQuib}
                keyExtractor={(_, index) => index.toString()}
                renderItem={QuibList}
                initialScrollIndex={0}
                viewabilityConfig={{
                  viewAreaCoveragePercentThreshold: 10,
                }}
                // viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                onViewableItemsChanged={AllSyncRef.current ? onViewableItemsChangedMain : onViewableItemsChangedMainNotSync}
                ref={flatRef}
                estimatedItemSize={vh(15)}
                contentContainerStyle={{ paddingHorizontal: vw(0) }}
                ListFooterComponent={<></>}
                onTouchStart={() => {
                  if (TouchRef.current == false) {
                    TouchRef.current = true;
                  }
                }}
              />
            </View>
          </View>
          {/*===========================================QUIB COMPOSE=================================*/}
          <QuibComposeModal />
          {/*===========================================Quib timeline====================================*/}
          <View style={styles.timelineRapper}>
            <BlurView
              style={
                Auth.DeviceType
                  ? {
                    height: vh(25),
                    width: vw(100),
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }
                  : {
                    height: vh(25),
                    width: vw(100),
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }
              }
              blurType="light"
              blurAmount={10}
              reducedTransparencyFallbackColor="#00000000"
              overlayColor="#00000000">
              <LinearGradient
                // colors={['#00000000', Style.quibHeaderGrad, '#00000000']}
                colors={['#00000000', Style.quibPlayColor, '#00000000']}
                style={{ flex: 1, width: vw(100), backgroundColor: '#00000000' }}>
                {/* handles the title for the movie */}
                <View
                  style={{
                    width: vw(100),
                    justifyContent: 'center',
                    alignSelf: 'center',
                    paddingHorizontal: vw(6),
                    marginBottom: vw(3),
                    marginTop: vw(3),
                    flex: 1,
                    flexDirection: 'column',
                  }}>
                  <PageHeader
                    leftNode={
                      <View>
                        <TouchableOpacity>
                          <FastImage
                            style={{
                              alignSelf: 'center',
                              width: Auth.DeviceType ? vw(10) : vw(15),
                              height: Auth.DeviceType ? vw(10) : vw(15),
                            }}
                            source={{
                              uri: isPoster
                                ? `${API}${posterRef.current}`
                                : `data:image/jpeg;base64,${posterRef.current}`,
                              cache: FastImage.cacheControl.immutable,
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </TouchableOpacity>
                      </View>
                    }
                    headerNode={
                      // <View
                      //   style={{
                      //     justifyContent: 'center',
                      //     alignSelf: 'center',
                      //   }}>
                      //   <View
                      //     style={{
                      //       flexDirection: 'row',
                      //     }}>
                      //     <View style={{ alignSelf: 'center' }}>
                      //       <TouchableOpacity
                      //         activeOpacity={0.5}
                      //         onPress={() =>
                      //           Auth.isGuest == true
                      //             ? setActive(true)
                      //             : HandlePress(MovieTime)
                      //         }>
                      //         <View
                      //           style={[...[styles.timer], { height: vw(7) }]}>
                      //           <Text
                      //             style={{
                      //               textAlign: 'center',
                      //               color: '#fff',
                      //               fontSize: Auth.DeviceType ? vw(3) : vw(4.1),
                      //               fontWeight: '500',
                      //             }}>
                      //             {hours < 10 ? `0${hours}` : `${hours}`}:
                      //             {mintues < 10 ? `0${mintues}` : `${mintues}`}:
                      //             {seconds < 10 ? `0${seconds}` : `${seconds}`}
                      //           </Text>
                      //         </View>
                      //       </TouchableOpacity>
                      //     </View>
                      //   </View>
                      // </View>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          marginLeft: vw(3)
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                          }}>
                          <TouchableOpacity
                            activeOpacity={0.5}
                            onLongPress={() => { setAllSync(!AllSync); AllSyncRef.current = !AllSyncRef.current }}>
                            {
                              AllSync ?
                                <Icon
                                  name="sync"
                                  size={Auth.DeviceType ? vw(6) : vw(12)}
                                  color={Style.quibBlue}
                                  style={{ transform: [{ rotate: '-45deg' }] }}
                                />
                                :
                                <TouchableOpacity
                                  onPress={SyncQuibTime}
                                  disabled={IsSync()}>
                                  <Icon
                                    name="sync"
                                    size={Auth.DeviceType ? vw(6) : vw(12)}
                                    color={Sync ? Style.defaultGrey : Style.defaultRed}
                                    style={{ transform: [{ rotate: '-45deg' }] }}
                                  />
                                </TouchableOpacity>
                            }
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() =>
                              Auth.isGuest == true
                                ? setActive(true)
                                : // : handlePresentModalPress()
                                HandlePress(MovieTime)
                            }>
                            <View style={[...[styles.timer], { height: vw(7) }]}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  color: '#fff',
                                  fontSize: Auth.DeviceType ? vw(3) : vw(4.1),
                                  fontWeight: '500',
                                }}>
                                {hours < 10 ? `0${hours}` : `${hours}`}:
                                {mintues < 10 ? `0${mintues}` : `${mintues}`}:
                                {seconds < 10 ? `0${seconds}` : `${seconds}`}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={1}>
                            <Icon
                              name="plus-circle-outline"
                              size={Auth.DeviceType ? vw(6) : vw(9.1)}
                              color={'transparent'}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    }
                    rightNode={
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => toggle()}>
                          <Icon
                            name={PlayPause}
                            size={Auth.DeviceType ? vw(10) : vw(16)}
                            color={Style.defaultRed}
                          />
                        </TouchableOpacity>
                      </View>
                    }
                  />
                </View>
              </LinearGradient>
            </BlurView>
          </View>
          {/*==========================================Login MODAL=====================================*/}
          <LoginModal />
        </SafeAreaView>
      </BottomSheetModalProvider>
      <Toast />
    </>
  );
}
