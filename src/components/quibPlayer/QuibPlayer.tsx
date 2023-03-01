import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Style } from '../../constants/Styles';
import { vmax, vw, vh } from 'rxn-units';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import PageHeader from '../CustomHeader';
import { Slider } from '@miblanchard/react-native-slider';
import { API } from '../../constants/Api';
import FastImage from 'react-native-fast-image';
import {
  AddBump,
  getMovieLength,
  getMoviePoster,
  GetQuibsById,
} from '../../services/QuibAPIs';
import { LocalSvg } from 'react-native-svg';
import QuibCarousel from './QuibCarousel';
import QuibCompose from './QuibCompose';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { useBottomSheetBackHandler } from '../../screens/chooseMovieScreen/useBottomSheetBack';
import LinearGradient from 'react-native-linear-gradient';
import getFormattedTime from '../GetFormattedTime';
import Toast from 'react-native-toast-message';
import { FlashList } from '@shopify/flash-list';
import DropShadow from 'react-native-drop-shadow';
import { BlurView } from '@react-native-community/blur';
import { AuthContext } from '../../Auth';
import Modal from 'react-native-modal';
import QuibButton from '../QuibButton';
import Skeleton from './Skeleton';

const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

interface props {
  navigation: any;
  route: any;
}

export default function QuibPlayer({ navigation, route }: props) {
  // const isMovieMove = useRef<boolean>(); //used for dualSync
  const QuibCarTimeRef = useRef<any>(0);
  const QuibScurbCarRef = useRef<Slider>(null);
  // const isQuibMove = useRef<boolean>(); //used for dualSync
  const [Active, setActive] = useState(false);
  const MovieLen = useRef(0);
  const isActive = useRef(false);
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
  const TimeRefer = useRef(0);
  const QuibCarRef = useRef<any>(null);
  // const [AllSync, setAllSync] = useState<boolean>(true); //used for dualSync
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { handleSheetPositionChange } =
    useBottomSheetBackHandler(bottomSheetModalRef);
  // const [MyStreamQuibs, setMyStreamQuibs] = useState<any[]>([]);
  const Auth = React.useContext(AuthContext);
  const ScurbIndexCarRef = useRef(0);
  const [True, setTrue] = useState(false)

  //Api calls

  useEffect(() => {
    Promise.all([
      getMoviePoster(MovieId.MovieId)
        .then(
          (res: any) =>
            (posterRef.current = res.map((res: any) => res.posterContent)),
        )
        .then(() => FileCheck()),
      GetQuibsById(MovieId).then((res: any) => {
        setMovieQuib(res);
        setQuibTimeRef(res.map((res: any) => res.time));
        resMap.current = res.filter(
          (item: any) => item.isScreenshot == true || item.isSeedQuib,
        );
      }),
      getMovieLength(MovieId).then(
        (res: any) => (MovieLen.current = res.map((res: any) => res.length)),
      ),
    ]).then(() => setIsLoading(false));
  }, []);

  //UseEffect use to scroll
  useEffect(() => {
    if (isActive.current && MovieTime < MovieLen.current) {
      timer.current = setInterval(() => {
        setQuibTime(MovieTime + 1);
        setMovieTime(MovieTime => MovieTime + 1);
        // quibPlayIndexRef.current = MovieTime;
      }, 1000);
    } else {
      clearInterval(timer.current);
      setPlayPause('play-circle-outline');
      isActive.current = false;
    }

    return () => clearInterval(timer.current);
  }, [isActive.current, MovieTime]);

  // movie timer  stopwatch
  useEffect(() => {
    // console.log('index: ' + quibPlayIndexRef.current + ' Quib: ' + QuibTimeRef[quibPlayIndexRef.current] + ' movie: ' + MovieTime)
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
      // console.log('else')
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
    return () => { };
  }, [isActive.current, MovieTime]);

  useEffect(() => {
    console.log(Time)
    // bottomSheetModalRef.current?.present();
  }, [True]);

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

  //Inc and dec on timer
  const IncSecond = () => {
    if (MovieTime < MovieLen.current)
      return setMovieTime(MovieTime => MovieTime + 1);
  };
  const DecSecond = () => {
    if (MovieTime > 0) return setMovieTime(MovieTime => MovieTime - 1);
  };

  // to sync the movie and quib scruber
  const SyncQuibTime = () => {
    // isMovieMove.current = false; //used for dualSync
    // isQuibMove.current = false;
    setQuibTime(MovieTime);
  };
  //used for dualSync
  // const SyncMovieTime = () => {
  //     isMovieMove.current = false;
  //     isQuibMove.current = false;
  //     setMovieTime(QuibTime);
  // }

  const Profile = (userId: string) => {
    if (userId != 'a5a17ac9-d977-41b7-811c-05c4a6f62c4c') {
      return navigation.navigate('OtherProfile', { userId: userId });
    } else return navigation.navigate('Profile');
  };
  const HandlePress = (time: number) => {
    console.log('hi')
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
  const QuibHead = ({
    hours,
    mintues,
    seconds,
    name,
    quibId,
    time,
    userId,
  }: any) => {
    // console.log(`${API}Images/User32/${image}`);
    return (

      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ justifyContent: 'flex-start' }}>
            <TouchableOpacity
              onPress={() =>
                Auth.isGuest == true ? setActive(true) : Profile(userId)
              }>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: vw(3),
                }}>
                <FastImage
                  source={{
                    uri: `${API}Images/User32/60642bde-fe76-48ba-a1e6-8dc96a91fde3.jpeg`,
                  }}
                  style={{
                    width: vw(8),
                    height: vw(8),
                    marginTop: vw(-2.5),
                    borderRadius: vw(0.5),
                    marginRight: vw(1),
                  }}
                />
                <Text
                  style={{
                    color: Style.defaultTxtColor,
                    fontSize: 12,
                    fontWeight: 'bold',
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
              left: vw(30),
            }}>
            <TouchableOpacity
              onPress={() =>
                Auth.isGuest == true ? setActive(true) : HandlePress(time)
              }>
              <View
                style={[
                  ...[styles.timer],
                  { width: vw(16), height: vw(5), marginBottom: vw(2) },
                ]}>
                <Text
                  style={{ textAlign: 'center', color: '#fff', fontSize: vw(3) }}>
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
                Auth.isGuest == true
                  ? setActive(true)
                  : AddBump({
                    quibId: quibId,
                    MovieId: MovieId.MovieId,
                    userId: Auth.userName,
                  }).then(() =>
                    Toast.show({
                      visibilityTime: 5000,
                      autoHide: true,
                      type: 'success',
                      text1: 'Bumped!',
                      text2: 'Quib has been add to your stream successfully.',
                    }),
                  )
              }>
              <Icon
                name="heart-outline"
                size={vw(5)}
                color={Style.defaultRed}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const QuibList = useCallback(
    ({ item, index }: any) => {
      let { hours, mintues, seconds } = getFormattedTime(item.time);

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
            />
            <View style={[styles.flatlistComps]}>
              <Text style={{ color: Style.defaultTxtColor }}>{item.body}</Text>
            </View>
          </View>
        );
      } else if (item.isSeedQuib == true && !item.isScreenshot) {
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
            />
            <View
              style={[styles.flatlistComps, { backgroundColor: '#c1323250' }]}>
              <Text style={{ color: Style.defaultTxtColor }}>{item.body}</Text>
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
            />
            <View style={styles.flatlistComps}>
              <FastImage
                source={{
                  uri: API + item.body,
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
                style={{ width: vw(80), height: vw(40) }}
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
      <View
        style={{
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
      </View>
    );
  };
  const Flash = useCallback(() => {

    return (
      <View
        style={{
          width: vw(100),
          height: vh(65),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
          alignSelf: 'center',
        }}>
        <FlashList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={resMap.current}
          renderItem={({ item, index }) => (
            <QuibCarousel
              item={item}
              index={index}
              handlePresentModalPress={HandlePress}
              isGuest={Auth.isGuest}
              setActive={setActive}
              MovieId={MovieId.MovieId}
              userId={Auth.userName}

            />
          )}
          ListEmptyComponent={Skeleton}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          initialScrollIndex={ScurbIndexCarRef.current}
          ref={QuibCarRef}
          snapToAlignment="start"
          estimatedItemSize={vw(90)}
        />
      </View>
    );
  }, []);

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

  const QuibCarouselModal = () => {
    // const [QuibCarTime, setQuibCarTime] = useState(QuibCarTimeRef.current);
    // const QuibCarRef = useRef<any>(null);
    // const { hours, mintues, seconds } = getFormattedTime(QuibCarTime);
    // setQuibCarTime(QuibCarTimeRef.current)

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
              backgroundColor: 'rgba(0,0,0,0.8)',
            }}></View>
        }
        onBackdropPress={() => setIsVisble(false)}
        onBackButtonPress={() => setIsVisble(false)}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        statusBarTranslucent={true}
        deviceHeight={deviceHeight}
        deviceWidth={deviceWidth}
        style={{ flex: 1 }}>
        <Flash />
      </Modal>
    );
  };

  // variables
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  // Render BackDrop
  const renderBackdrop =
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.7}
        onPress={() => bottomSheetModalRef.current?.dismiss}
        pressBehavior="close"
      />
    )
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

  const QuibComposeModal = useCallback(() => {
    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
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
          movieLength={MovieLen.current}
        />
      </BottomSheetModal>
    );
  }, [true]);
  return (
    <>
      <BottomSheetModalProvider>
        <QuibComposeModal />
        <SafeAreaView
          style={{
            // paddingTop:StatusBar.currentHeight,
            flex: 1,
            alignItems: 'center',
            backgroundColor: Style.quibBackColor,
          }}>
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

            {/* <Flat/> */}
            <View style={{ height: vh(100), width: vw(100) }}>
              <FlashList
                data={movieQuib}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                  <View>
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
                      <InitialQuib />
                    </DropShadow>
                  </View>
                )}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
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
                    <QuibList item={item} index={index} />
                  </DropShadow>
                )}
                initialScrollIndex={0}
                ref={flatRef}
                estimatedItemSize={200}
                contentContainerStyle={{ paddingHorizontal: vw(5) }}
                ListFooterComponent={<></>}
                ListFooterComponentStyle={{ paddingBottom: vh(15) }}
              />
            </View>
          </View>
          {/* Quib timeline */}
          {/* Quib timeline */}
          {/* Quib timeline */}
          {/* Quib timeline */}
          <View
            style={{
              position: 'absolute',
              borderTopLeftRadius: vw(8),
              borderTopRightRadius: vw(8),
              borderTopWidth: 0,
              borderTopColor: 'black',
              bottom: 0,
              overflow: 'hidden',
              width: vw(100),
              flexDirection: 'row',
              height: vh(21),
              zIndex: 100,
            }}>
            <BlurView
              style={{ height: vh(21), width: vw(100) }}
              blurType="light"
              blurAmount={10}
              reducedTransparencyFallbackColor="#00000000"
              overlayColor="#00000000">
              <LinearGradient
                colors={['#00000020', Style.quibHeaderGrad, '#000000']}
                style={{ flex: 1, width: vw(100), backgroundColor: '#00000000' }}>
                <View style={styles.quibScrubber}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginBottom: vw(-3),
                    }}>
                    {/* Movie Scrubber  */}
                    <View
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}>
                      <Slider
                        maximumValue={MovieLen.current}
                        minimumTrackTintColor={Style.defaultRed}
                        maximumTrackTintColor={Style.defaultTxtColor}
                        containerStyle={{ width: vw(85) }}
                        value={MovieTime}
                        trackClickable={true}
                        step={1}
                        onSlidingComplete={value => {
                          value = Array.isArray(value) ? value[0] : value;
                          setQuibTime(value);

                          setMovieTime(value);
                          const Reduce = movieQuib.reduce(
                            (accumulator, current) => {
                              const val = Array.isArray(value)
                                ? value[0]
                                : value;
                              return Math.abs(current.time - val) <
                                Math.abs(accumulator.time - val)
                                ? current
                                : accumulator;
                            },
                          );
                          const ScurbIndex = movieQuib.findIndex(
                            (item, index) => {
                              if (item.time == Reduce.time) {
                                return index;
                              }
                            },
                          );
                          if (ScurbIndex < 0) {
                            flatRef.current?.scrollToOffset({
                              animated: true,
                              offset: 0,
                            });
                          } else {
                            flatRef.current?.scrollToIndex({
                              animated: true,
                              index: ScurbIndex,
                            });
                          }
                        }}
                        renderThumbComponent={() => {
                          // if (!AllSync) {
                          return (
                            <Image
                              source={require('../../assets/top.png')}
                              style={{
                                width: vw(5),
                                marginLeft: vw(-3),
                                left: vw(2.5),
                                height: vw(5),
                                resizeMode: 'contain',
                                bottom: vw(2.5),
                              }}
                            />
                          );
                          // }
                          //used for dualSync
                          // else return (
                          //     <TouchableOpacity style={{ paddingHorizontal: 0, justifyContent: 'center', }}>
                          //         {/* <LocalSvg

                          //         style={{ marginLeft: vw(0), left: vw(0), bottom: vw(-1.1), }}
                          //         width={vw(25)}
                          //         height={vw(25)}
                          //         asset={require('../../assets/all-sync-mode.svg')}
                          //     /> */}
                          //         <Image source={require('../../assets/all-sync-mode.png')}
                          //             style={{ width: vw(8.5), height: vw(8.5), resizeMode: 'contain', marginLeft: vw(-6), left: vw(3.5), }}
                          //         />
                          //     </TouchableOpacity>

                          // )
                        }}
                        trackStyle={{ marginLeft: vw(1) }}
                        animateTransitions={true}
                      // thumbTouchSize={}
                      />
                    </View>

                    {/*quib Scrubber*/}
                    <View
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginTop: vw(-5.6),
                      }}>
                      <Slider
                        maximumValue={MovieLen.current}
                        minimumTrackTintColor="#00000000"
                        maximumTrackTintColor="#00000000"
                        // minimumTrackTintColor={Style.defaultRed}
                        // maximumTrackTintColor={Style.defaultTxtColor}
                        containerStyle={{ width: vw(85) }}
                        value={QuibTime}
                        onSlidingStart={() => {
                          // CarouselOnRef.current = true;
                          isActive.current = false;
                          setIsVisble(true);
                        }}
                        onValueChange={value => {
                          value = Array.isArray(value) ? value[0] : value;
                          const Reduce = resMap.current.reduce(
                            (accumulator, current) => {
                              const val = Array.isArray(value)
                                ? value[0]
                                : value;
                              return Math.abs(current.time - val) <
                                Math.abs(accumulator.time - val)
                                ? current
                                : accumulator;
                            },
                          );
                          ScurbIndexCarRef.current = resMap.current.findIndex(
                            (item, index) => {
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
                            toggle;
                            QuibCarRef.current?.scrollToIndex({
                              animated: true,
                              index: ScurbIndexCarRef.current,
                            });
                          }
                        }}
                        trackClickable={false}
                        step={1}
                        onSlidingComplete={value => {
                          value = Array.isArray(value) ? value[0] : value;
                          setQuibTime(value);
                          const Reduce = movieQuib.reduce(
                            (accumulator, current) => {
                              const val = Array.isArray(value)
                                ? value[0]
                                : value;
                              return Math.abs(current.time - val) <
                                Math.abs(accumulator.time - val)
                                ? current
                                : accumulator;
                            },
                          );
                          const ScurbIndex = movieQuib.findIndex(
                            (item, index) => {
                              if (item.time == Reduce.time) {
                                return index;
                              }
                            },
                          );
                          if (ScurbIndex < 0) {
                            flatRef.current?.scrollToOffset({
                              animated: true,
                              offset: 0,
                            });
                          } else {
                            toggle;
                            flatRef.current?.scrollToIndex({
                              animated: true,
                              index: ScurbIndex,
                            });
                          }
                          // +++++++++++Carousel on ++++++++++++++\\
                          if (CarouselOnRef.current == false) {
                            setIsVisble(false);
                          }
                        }}
                        renderThumbComponent={() => {
                          // if (!AllSync) {                  //used for dualSync

                          if (QuibTime == MovieTime) {
                            return (
                              <Image
                                source={require('../../assets/bottom.png')}
                                style={{
                                  width: vw(5),
                                  marginLeft: vw(-3),
                                  left: vw(2.5),
                                  height: vw(5),
                                  resizeMode: 'contain',
                                  bottom: vw(2),
                                }}
                              />
                            );
                          } else
                            return (
                              <Image
                                source={require('../../assets/bottom_line.png')}
                                style={{
                                  width: vw(5),
                                  marginLeft: vw(-3),
                                  left: vw(2.5),
                                  height: vw(5),
                                  resizeMode: 'contain',
                                  bottom: vw(2),
                                }}
                              />
                            );
                          // } else return null
                        }}
                        trackStyle={{ marginLeft: vw(1) }}
                        animateTransitions={true}
                      />
                    </View>
                  </View>
                </View>

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
                    marginBottom: vw(2),
                  }}>
                  <PageHeader
                    leftNode={
                      <View>
                        <TouchableOpacity onPress={CarouselPress}>
                          <LocalSvg
                            style={{ alignSelf: 'center' }}
                            width={vw(15)}
                            height={vw(15)}
                            asset={require('../../assets/SVG/carousel-off.svg')}
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
                              size={36}
                              color={Style.defaultRed}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => toggle()}>
                            <Icon
                              name={PlayPause}
                              style={{ paddingHorizontal: vw(1) }}
                              size={70}
                              color={Style.defaultRed}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={IncSecond}>
                            <Icon
                              name="plus-circle-outline"
                              size={36}
                              color={Style.defaultRed}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={{ paddingBottom: vw(0) }}>
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
                                  fontSize: 16,
                                  fontWeight: '500',
                                }}>
                                {hours < 10 ? `0${hours}` : `${hours}`}:
                                {mintues < 10 ? `0${mintues}` : `${mintues}`}:
                                {seconds < 10 ? `0${seconds}` : `${seconds}`}
                              </Text>
                            </View>
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
                        {/* quib sunc butttons*/}
                        {/* <SyncButton isMovieMove={isMovieMove.current} isQuibMove={isQuibMove.current} movieTime={MovieTime} quibTime={QuibTime} isSync={AllSync} isMovieSync={false} syncMovie={SyncMovieTime} syncQuib={SyncQuibTime} toggleAllSync={() => { setAllSync(!AllSync); isMovieMove.current = false; isQuibMove.current = false; }} /> */}
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={SyncQuibTime}>
                          <IonIcon
                            name="sync-sharp"
                            size={vw(18)}
                            color={Style.defaultRed}
                            style={{
                              textAlign: 'center',
                              transform: [{ rotate: '0deg' }],
                            }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // zIndex:1,
    alignItems: 'center',
    width: vw(96),
    paddingTop: StatusBar.currentHeight,
    // overflow: 'hidden',
    // padding: vw(3),
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom:-80,
    paddingTop: vw(2),
    color: Style.defaultTxtColor,
  },
  image: {
    resizeMode: 'contain',
    width: vw(70),
    height: vh(50),
    margin: vw(5),
  },
  quibScrubber: {
    flexDirection: 'row',
    // flex: 1,
    justifyContent: 'center',
    // alignSelf:'center',
    // alignItems:'center',
    marginHorizontal: vw(3),
    paddingTop: vw(1.5),
    // paddingBottom: vw(1.5)
  },
  quibZero: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    marginHorizontal: vw(3),
    backgroundColor: Style.defaultRed,
    width: vw(25),
    flexDirection: 'row',
    height: vw(6),
    borderRadius: vw(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatlistComps: {
    paddingVertical: vw(2),
  },
  flatlistContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Style.quibPlayerCardBack,
    borderRadius: vw(1),
    // borderWidth: 1,
    // borderColor: Style.borderColor,
    paddingVertical: vw(1),
    paddingHorizontal: vw(3),
    marginVertical: vw(4),
  },
  loadingActivity: {
    zIndex: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // opacity: 0.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Style.defaultRed,
    width: vw(30),
    height: vw(8),
    borderRadius: vw(2),
    marginVertical: vw(4),
    marginHorizontal: vw(2),
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
