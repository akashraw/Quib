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
  import Carousel from "react-native-reanimated-carousel";
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
    width: number,
    height: number
  }
  
  const ITEM_SIZES = width * 0.38;
  // const ITEM_SPACING = (width - ITEM_SIZE) / 2;
  
  export default function QuibPlayer({ navigation, route }: props) {
    // const isMovieMove = useRef<boolean>(); //used for dualSync
    const QuibCarTimeRef = useRef<any>(0);
    const [Res, setRes] = useState<any>([])
    const QuibScurbCarRef = useRef<Slider>(null);
    // const isQuibMove = useRef<boolean>(); //used for dualSync
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
    // const [AllSync, setAllSync] = useState<boolean>(true); //used for dualSync
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { handleSheetPositionChange } =
      useBottomSheetBackHandler(bottomSheetModalRef);
    // const [MyStreamQuibs, setMyStreamQuibs] = useState<any[]>([]);
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
    const ScurbCompleteIndex = useRef<number>(0);
    const [ITEM_SIZE, setITEM_SIZE] = useState(width * 0.38);
    const [ITEM_SPACING, setITEM_SPACING] = useState((width - ITEM_SIZE) / 2);
    const [IsLand, setIsLand] = useState(true);
    const [IsCine, setIsCine] = useState(true);
    const BlurState = useDynamicAnimation(() => {
      return {
        scale: 1,
        translateY: vw(0),
        opacity: 1,
      }
    });
    const BlurStateRight = useDynamicAnimation(() => {
      return {
        scale: 1,
        translateX: vw(0),
        opacity: 1,
      }
    });
    const FlatWrap = useDynamicAnimation(() => {
      return {
        width: vw(76)
      }
    });
    const animateSlider = useDynamicAnimation(() => {
      return {
        rotate: '90deg',
        scale: 1,
        translateY: vw(0),
        opacity: 1,
      };
    });
    const animateIconMatButton = useDynamicAnimation(() => {
      return {
        scale: 1,
        opacity: 1,
        translateY: vw(-2),
        translateX: vw(0)
      }
    });
    const animateIconButton = useDynamicAnimation(() => {
      return {
        scale: 1,
        opacity: 1,
        translateY: vw(2),
        translateX: vw(0)
      }
    });
    //Api calls
  
    useEffect(() => {
      Promise.all([
        QuibByMovieAndUserId({
          MovieId: MovieId.MovieId,
          userId: Auth.userName,
        }).then((res: any) => { BumpDataRef.current = res; setBumpData((BumpData) => BumpData = res) }),
        getMoviePoster(MovieId.MovieId)
          .then(
            (res: any) =>
              (posterRef.current = res.map((res: any) => res.posterContent)),
          )
          .then(() => FileCheck()),
        GetQuibsById(MovieId).then((res: any) => {
          setMovieQuib(res);
          setQuibTimeRef(res.map((res: any) => res.time));
          // Res = a;
          setRes((Res: any) => (Res = res.filter(
            (item: any) => item.isScreenshot == true
          )))
  
          // Image.getSize(API + Res[1].body, (width, height) => { setState((State: { width: number; height: number; }) => State={ width: width, height: height }) });
        }),
        getMovieLength(MovieId).then((res: any) => {
          setMovieLen(res[0].length);
          length.current = res[0].length;
        }),
      ]).then(() => setIsLoading(false))
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
    }, []);
  
    // movie timer  stopwatch
    useEffect(() => {
      if (MovieTime == QuibTime) {
        if (isActive.current && MovieTime < MovieLen) {
          timer.current = setInterval(() => {
            setQuibTime(MovieTime + 1);
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
              return index;
            } else return;
          });
          flatRef.current?.scrollToIndex({
            animated: true,
            index: a,
          });
        }
      }
      return () => { };
    }, [isActive.current, MovieTime]);
  
    //==Animate==//
    useEffect(() => {
      if (isActive.current == true) {
        // Quibs.animateTo({
        //   scale: 1.25
        // });
        BlurState.animateTo({
          scale: .70,
          translateY: vw(2),
          opacity: .5,
        }),
          BlurStateRight.animateTo({
            scale: .70,
            translateX: vw(1.5),
            opacity: .5,
          }),
          FlatWrap.animateTo({
            width: vw(80)
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
          width: vw(76)
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
          })
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
  
      return () => {
  
      }
    }, [isActive.current])
  
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
      setQuibTime(Time => (Time = MovieTime));
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
      ({ hours, mintues, seconds, name, quibId, time, userId, image, index }: any) => {
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
                    name={"heart-outline"}
                    // name={BumpData[index].id == quibId ? "heart" : "heart-outline"}
                    size={Auth.DeviceType ? vw(4) : vw(5)}
                    color={Style.defaultRed}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      },
      [movieQuib, BumpData],
    );
  
    const QuibList = useCallback(
      ({ item, index }: any) => {
        let { hours, mintues, seconds } = getFormattedTime(item.time);
        // console.log(BumpData.includes())
        if (!item.isSeedQuib && !item.isScreenshot) {
          return (
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
          );
        } else if (item.isSeedQuib == true && !item.isScreenshot) {
          return (
            <View
              key={index}
              style={[
                ...[styles.flatlistContainer],
                { backgroundColor: '#B46060' },
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
                      ? { fontSize: vw(2.5), color: Style.defaultTxtColor }
                      : { fontSize: vw(3.6), color: Style.defaultTxtColor }
                  }>
                  {item.body}
                </Text>
              </View>
            </View>
          );
        } else {
          return (
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
                  style={{ width: vw(65), height: vw(25) }}
                />
              </View>
            </View>
          );
        }
      },
      [movieQuib],
    );
  
    // intial Quib
    const InitialQuib = () => {
      return (
        <DropShadow
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.5,
            shadowRadius: vw(1),
          }}>
          <MotiView
            style={{
              width: vw(75),
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Style.quibPlayerCardBack,
              marginTop: vw(3),
              marginBottom: vw(2),
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
        </DropShadow>
      );
    };
    const Flash = useCallback(({ scrollX, scrollY, }: any) => {
      return (
        <View style={[...[styles.container], { position: 'absolute' }]}>
          <View
            style={{
              height: ITEM_SIZE * 3,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              // top: height / 3,
              // flex: 1,
            }}>
            {/* <AnimatedFlashList
              data={Res}
              ref={QuibCarRef}
              // onViewableItemsChanged={onViewableItemsChanged}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={Skeleton}
              keyExtractor={(_, index) => index.toString()}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollX } } }],
                { useNativeDriver: false }
              )}
              bounces={false}
              contentContainerStyle={{
                paddingVertical: ITEM_SPACING,
                paddingHorizontal: ITEM_SPACING,
              }}
              estimatedItemSize={ITEM_SIZE * 6.5}
              viewabilityConfig={{
                viewAreaCoveragePercentThreshold: 10
              }}
              onViewableItemsChanged={onViewableItemsChanged}
              initialScrollIndex={ScurbIndexCarRef.current}
              snapToInterval={ITEM_SIZE}
              decelerationRate={'fast'}
              renderItem={({ item, index }) => {
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
              }}
            /> */}
              <FlashList
            // horizontal
            showsHorizontalScrollIndicator={false}
            data={Res}
            contentContainerStyle={{
              paddingVertical: ITEM_SPACING,
              paddingHorizontal: ITEM_SPACING,
            }}
            renderItem={({ item, index }) => (
              <QuibCarousel
                item={item}
                index={index}
                handlePresentModalPress={HandlePress}
                isGuest={Auth.isGuest}
                setActive={setActive}
                MovieId={MovieId.MovieId}
                userId={Auth.userName}
                device={Auth.DeviceType} ItemHeight={0} ItemSpace={0} isLand={false} isCine={false}            />
            )}
            ListEmptyComponent={Skeleton}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            initialScrollIndex={ScurbIndexCarRef.current}
            ref={QuibCarRef}
            snapToAlignment="start"
            estimatedItemSize={vw(90)}
          />
            {/* <Text style={styles.text}>1</Text> */}
          </View>
        </View>
      );
    }, [Res]);
  
    //-========================
    const CarouselPress = useCallback(() => {
  
      if (isVisble == false) {
        CarouselOnRef.current = true;
        setIsVisble(true);
      } else {
        CarouselOnRef.current = false;
        setIsVisble(false);
      }
  
    }, [isVisble]);
  
    const QuibCarouselModal = useCallback(() => {
      const scrollY = useRef(new Animated.Value(0)).current;
      const scrollX = React.useRef(new Animated.Value(0)).current;
  
  
      // useEffect(() => {
      //   Promise.all([Image.getSize(`http://3.88.43.237` + Res[1].body, (width, height) => { setStateWidth(StateWidth => StateWidth = width); setStateHeight(StateHeight => StateHeight = height) })
      //     .then(() => {
      //       if (StateWidth / StateHeight < 1.8 && StateWidth / StateHeight > 1.6) {
      //         setIsCine(false);
      //       } else if (StateWidth / StateHeight < 1.6) {
      //         setITEM_SIZE((ITEM_SIZE) => ITEM_SIZE = (width * 0.45));
      //         setITEM_SPACING((ITEM_SPACING) => ITEM_SPACING = (width - ITEM_SIZE) / 2)
      //         setIsLand(false);
      //         setIsCine(false);
      //       } else {
      //         setIsCine(true);
      //         setIsLand(true)
      //       }
      //     })])
      // }, [Res]);
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
          style={{ flex: 1, alignItems: "center", marginTop: StatusBar.currentHeight }}>
          <Flash scrollX={scrollX} scrollY={scrollY}  />
        </Modal>
      );
    }, [isVisble]);
  
  
    // ======== LOFIN MODAL==========
    const LoginModal = useCallback(() => {
      return (
        // <View style={styles.loadingActivity} >
        //     <View>
        //         <Text>Please log in to use this feature</Text>
        //     </View>
        // </View>
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
            backgroundColor: Style.quibBackColor,
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
            // hour={hours}
            // mins={mintues}
            // secs={seconds}
            time={TimeRef.current}
            // time={Time}
            bumpId={BumpId}
            device={Auth.DeviceType}
            movieLength={MovieLen}
          />
        </BottomSheetModal>
      );
    }, [true]);
  
    const onViewableItemsChanged = ({ viewableItems, changed }: any) => {
      if (viewableItems[0]?.item.time == undefined) {
        return null;
      } else {
        setQuibTime(QuibTime => (QuibTime = viewableItems[0]?.item.time));
      }
    };
  
  
    const LSide = () => {
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
            overflow: 'hidden'
          }}>
          <AnimatedBlurView
            state={BlurState}
            style={
              Auth.DeviceType
                ? { height: vh(55), borderRadius: vw(5), width: vw(10), justifyContent: 'center', alignItems: 'center', alignSelf: 'center', }
                : { height: vh(55), borderRadius: vw(5), width: vw(10), justifyContent: 'center', alignItems: 'center', alignSelf: 'center', }
            }
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="#0000000"
            overlayColor="#00000000">
            <LinearGradient
              colors={['#CCCC9985', Style.quibPlayColor, '#CCCC9985']}
              style={{ flex: 1, width: vw(10), backgroundColor: '#00000000', justifyContent: 'center', alignItems: 'center', borderRadius: vw(6) }}>
              <View style={{ borderRadius: vw(6) }}>
                <Slider
                  // state={animateSlider}
                  // transition={{
                  //   type: 'timing'
                  // }}
                  thumbTintColor={Style.defaultRed}
                  maximumValue={length.current}
                  minimumTrackTintColor={Style.defaultRed}
                  maximumTrackTintColor={Style.defaultTxtColor}
                  style={{ width: vh(50), height: vw(15), borderRadius: vw(2), transform: [{ rotate: '90deg' }] }}
                  step={1}
                  // tapToSeek={true}
                  value={QuibTime}
                  onSlidingStart={() => {
                    isActive.current = false;
                    isSync.current = false;
                    setIsVisble(true);
                    // CarouselOnRef.current = true;
                  }}
                  onValueChange={value => {
                    // value = Array.isArray(value) ? value[0] : value;
                    console.log(value)
                    if (Res.length != 0) {
                      const Reduce = Res.reduce(
                        (accumulator: { time: number; }, current: { time: number; }) => {
                          // const val = Array.isArray(value) ? value[0] : value;
                          return Math.abs(current.time - value) <
                            Math.abs(accumulator.time - value)
                            ? current
                            : accumulator;
                        },);
                      ScurbIndexCarRef.current = Res.findIndex(
                        (item: { time: any; }, index: any) => {
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
                        QuibCarRef.current?.scrollToIndex({
                          animated: true,
                          index: ScurbIndexCarRef.current,
                        });
                      }
                    }
                  }}
                  onSlidingComplete={value => {
                    value = Array.isArray(value) ? value[0] : value;
                    setQuibTime(value);
                    if (movieQuib.length != 0) {
                      const Reduce = movieQuib.reduce((accumulator, current) => {
                        return Math.abs(current.time - value) <
                          Math.abs(accumulator.time - value)
                          ? current
                          : accumulator;
                      });
                      ScurbCompleteIndex.current = movieQuib.findIndex((item, index) => {
                        if (item.time == Reduce.time) {
                          return index;
                        }
                      });
                      if (ScurbCompleteIndex.current < 0) {
                        flatRef.current?.scrollToOffset({
                          animated: true,
                          offset: 0,
                        });
                      } else {
                        toggle;
                        flatRef.current?.scrollToIndex({
                          animated: true,
                          index: ScurbCompleteIndex.current,
                        });
                      }
                    }
                    // +++++++++++Carousel on ++++++++++++++\\
                    if (CarouselOnRef.current == false) {
                      setIsVisble(false);
                    }
                  }}
                // hitSlop={{ left: vw(10), right: vw(10), top: vw(10), bottom: vw(10) }}
                />
              </View>
            </LinearGradient>
          </AnimatedBlurView>
        </View>
      )
    }
  
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
            overflow: 'hidden'
          }}>
          <MotiView
            state={BlurState}
            style={
              Auth.DeviceType
                ? { height: vh(16), borderRadius: vw(5), width: vw(10), justifyContent: 'center', alignItems: 'center', alignSelf: 'center', }
                : { height: vh(16), borderRadius: vw(5), width: vw(10), justifyContent: 'center', alignItems: 'center', alignSelf: 'center', }
            }>
            <LinearGradient
              colors={['#CCCC9985', Style.quibPlayColor, '#CCCC9985']}
              style={{ flex: 1, width: vw(10), backgroundColor: '#00000000', justifyContent: 'center', alignItems: 'center', borderRadius: vw(5), }}>
              <View
                style={{
                  borderRadius: vw(6),
                }}>
                <TouchableOpacity hitSlop={{
                  top: vw(2),
                  bottom: vw(2),
                  left: vw(4),
                  right: vw(4)
                }} onPress={CarouselPress}>
                  <AnimatedIconMat
                    // state={animateIconMatButton}
                    // transition={{
                    //   type: 'timing'
                    // }}
                    name='slideshow' size={vw(7)} color={Style.defaultRed} style={{ paddingVertical: vw(2), borderRadius: vw(7) }} />
                </TouchableOpacity>
                <AnimatedIcon
                  name='repeat' size={vw(7)} color={Style.defaultRed} style={{ paddingVertical: vw(2), }} />
              </View>
            </LinearGradient>
          </MotiView>
        </View>
      )
    }
  
    return (
      <>
        <BottomSheetModalProvider>
          <SafeAreaView
            style={{
              // paddingTop:StatusBar.currentHeight,
              flex: 1,
              alignItems: 'center',
              backgroundColor: Style.quibBackColor,
            }}>
            {/* <QuibComposeModal /> */}
            {/* Quibs flatlist */}
            {/* Quibs flatlist */}
            <View style={styles.container}>
              {/*modal*/}
              {/*modal*/}
              <QuibCarouselModal />
  
              {/* Quib List */}
              {/* Quib List */}
              {/* Quib List */}
              {/* Quib List */}
  
  
              <LSide />
  
              {/* <Flat/> */}
              <MotiView transition={{ type: 'timing', easing: Easing.linear }} style={{ height: vh(100), width: vw(80) }}>
                <FlashList
                  data={movieQuib}
                  // onScroll={onScroll}
                  // persistentScrollbar={true}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={InitialQuib}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={QuibList}
                  initialScrollIndex={0}
                  viewabilityConfig={{
                    viewAreaCoveragePercentThreshold: 10,
                  }}
                  ref={flatRef}
                  estimatedItemSize={vh(15)}
                  contentContainerStyle={{ paddingHorizontal: vw(0) }}
                  ListFooterComponent={<></>}
                  // onContentSizeChange={(_,h)=>setH2(h)}
                  // onLayout={(event) => setH1(event.nativeEvent.layout.height)}
                  onViewableItemsChanged={onViewableItemsChanged}
                // onScroll={Animated.event(
                //   [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                //   { useNativeDriver: false }
                // )}
                />
              </MotiView>
              <RSide />
            </View>
            <QuibComposeModal />
  
            {/* Quib timeline */}
            {/* Quib timeline */}
            <View style={styles.timelineRapper}>
              <BlurView
                style={
                  Auth.DeviceType
                    ? { height: vh(25), width: vw(100), justifyContent: 'center', alignItems: 'center', alignSelf: 'center', }
                    : { height: vh(25), width: vw(100), justifyContent: 'center', alignItems: 'center', alignSelf: 'center', }
                }
                blurType="light"
                blurAmount={10}
                reducedTransparencyFallbackColor="#00000000"
                overlayColor="#00000000">
                <LinearGradient
                  colors={['#00000020', Style.quibHeaderGrad, '#000000']}
                  style={{ flex: 1, width: vw(100), backgroundColor: '#00000000' }}>
                  {/* handles the title for the movie */}
                  {/* <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center' }}> */}
  
                  {/* new */}
                  {/* new */}
                  {/* new */}
                  {/* new */}
                  {/* new */}
                  {/* new */}
  
  
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
                          <TouchableOpacity >
                            <FastImage
                              style={{
                                alignSelf: 'center',
                                width: (Auth.DeviceType ? vw(10) : vw(15)),
                                height: (Auth.DeviceType ? vw(10) : vw(15))
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
                        //
  
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
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
                              onPress={DecSecond}>
                              <Icon
                                name="minus-circle-outline"
                                size={Auth.DeviceType ? vw(6) : vw(9.1)}
                                color={Style.defaultRed}
                              />
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                              activeOpacity={0.5}
                              onPress={() => toggle()}>
                              <Icon
                                name={PlayPause}
                                style={{ paddingHorizontal: vw(1) }}
                                size={Auth.DeviceType ? vw(12) : vw(18)}
                                color={Style.defaultRed}
                              />
                            </TouchableOpacity> */}
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
                              activeOpacity={0.5}
                              onPress={IncSecond}>
                              <Icon
                                name="plus-circle-outline"
                                size={Auth.DeviceType ? vw(6) : vw(9.1)}
                                color={Style.defaultRed}
                              />
                            </TouchableOpacity>
                          </View>
                          {/* <View
                            style={{ paddingBottom: vw(0), alignItems: 'center' }}>
                            
                          </View> */}
                        </View>
                      }
                      rightNode={
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                          }}>
                          {/* quib sunc butttons*/}
                          {/* <SyncButton isMovieMove={isMovieMove.current} isQuibMove={isQuibMove.current} movieTime={MovieTime} quibTime={QuibTime} isSync={AllSync} isMovieSync={false} syncMovie={SyncMovieTime} syncQuib={SyncQuibTime} toggleAllSync={() => { setAllSync(!AllSync); isMovieMove.current = false; isQuibMove.current = false; }} /> */}
                          {/* <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={SyncQuibTime}>
                            <IonIcon
                              name="sync-sharp"
                              size={Auth.DeviceType ? vw(12) : vw(18)}
                              color={Style.defaultRed}
                              style={{
                                textAlign: 'center',
                                transform: [{ rotate: '0deg' }],
                              }}
                            />
                          </TouchableOpacity> */}
                          <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => toggle()}>
                            <Icon
                              name={PlayPause}
                              style={{ paddingHorizontal: vw(1) }}
                              size={Auth.DeviceType ? vw(10) : vw(16)}
                              color={Style.defaultRed}
                            />
                          </TouchableOpacity>
                        </View>
                      }
                    />
                  </View>
  
                  {/* new */}
                  {/* new */}
                  {/* new */}
                  {/* new */}
  
                  {/* </View> */}
                </LinearGradient>
              </BlurView>
            </View>
            {/* </BlurView> */}
            {/* </View> */}
            <LoginModal />
          </SafeAreaView>
        </BottomSheetModalProvider>
        <Toast />
      </>
    );
  }
  