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
import PageHeader from '../CustomHeader';
//   import { Slider } from '@miblanchard/react-native-slider';
import Slider from '@react-native-community/slider';
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
import { FlashList } from '@shopify/flash-list';
import DropShadow from 'react-native-drop-shadow';
import { BlurView } from '@react-native-community/blur';
import { AuthContext } from '../../Auth';
import Modal from 'react-native-modal';
import QuibButton from '../QuibButton';
import Skeleton from './Skeleton';
import { style, stylesTab } from './PlayerStyles';

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

export default function QPlayer({ navigation, route }: props) {
    // const isMovieMove = useRef<boolean>(); //used for dualSync
    const QuibCarTimeRef = useRef<any>(0);
    const QuibScurbCarRef = useRef<Slider>(null);
    // const isQuibMove = useRef<boolean>(); //used for dualSync
    const [Active, setActive] = useState(false);
    const MovieLen = useRef(0);
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
    const [H1, setH1] = useState<number>(100);
    const [H2, setH2] = useState<number>(100);
    const scrollY = useRef(new Animated.Value(0)).current;
    const styles = Auth.DeviceType ? stylesTab : style;
    const length = useRef<number>(0);
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
                (res: any) => {MovieLen.current = res.map((res: any) => res.length);  length.current = res[0].length}
            ),
            QuibByMovieAndUserId({
                MovieId: MovieId.MovieId,
                userId: Auth.userName,
            }).then((res: any) => (BumpDataRef.current = res)),
        ])
            .then(() => setIsLoading(false))
            .then(() =>
                setTimeout(() => {
                    isActive.current = true;
                    return setPlayPause('pause-circle-outline');
                }, 1000),
            );
    }, []);

    // movie timer  stopwatch
    useEffect(() => {
        if (MovieTime == QuibTime) {
            if (isActive.current && MovieTime < MovieLen.current) {
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
            if (isActive.current && MovieTime < MovieLen.current) {
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
            setBumpId(bump => bump = 0)
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
        setQuibTime(Time => Time = MovieTime);
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
        ({ hours, mintues, seconds, name, quibId, time, userId, image }: any) => {
            // console.log(`${API}Images/User32/${image}`);
            let FS: any;
            if (image != null) {
                FS = image.split('.').pop();
            } else {
                FS = null;
            }
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
                                    name="heart-outline"
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
                    <View>
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
                <View
                    style={{
                        width: vw(90),
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
                </View>
            </DropShadow>
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
                            device={Auth.DeviceType} ItemHeight={0} ItemSpace={0} isLand={false} isCine={false} />
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
    }, [resMap.current]);

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
    const snapPoints = useMemo(() => ['7%', '90%'], []);

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
                    movieLength={MovieLen.current}
                />
            </BottomSheetModal>
        );
    }, [true]);



    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = event.nativeEvent.layoutMeasurement.height;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        console.log("roundIndex:", event);
    }, []);

    const onViewableItemsChanged = ({ viewableItems, changed }: any) => {
        // console.log('rendered ', viewableItems[0].item.time)
        if (viewableItems[0]?.item.time == undefined) {
            return null
        } else {
            console.log('rendered ', viewableItems[0]?.item.time)
            setQuibTime(QuibTime => QuibTime = viewableItems[0]?.item.time)
        }
        // setQuibTime(QuibTime => QuibTime =QuibTimeRef[viewableItems[0].index])
        // console.log(`Visible items are ${viewableItems[0].index}`);
        // console.log("Changed in this iteration", changed);
    }
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
                }}>
                {/* <BlurView
                    // state={BlurState}
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
                        style={{ flex: 1, width: vw(10), backgroundColor: '#00000000', justifyContent: 'center', alignItems: 'center', borderRadius: vw(6) }}> */}
                        <View style={{height: vh(55), borderRadius: vw(5), width: vw(10),   }}>
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
                                    if (resMap.current.length != 0) {
                                        const Reduce = resMap.current.reduce(
                                            (accumulator: { time: number; }, current: { time: number; }) => {
                                                // const val = Array.isArray(value) ? value[0] : value;
                                                return Math.abs(current.time - value) <
                                                    Math.abs(accumulator.time - value)
                                                    ? current
                                                    : accumulator;
                                            },);
                                        ScurbIndexCarRef.current = resMap.current.findIndex(
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
                                        ScurbIndexCarRef.current = movieQuib.findIndex((item, index) => {
                                            if (item.time == Reduce.time) {
                                                return index;
                                            }
                                        });
                                        if (ScurbIndexCarRef.current < 0) {
                                            flatRef.current?.scrollToOffset({
                                                animated: true,
                                                offset: 0,
                                            });
                                        } else {
                                            toggle;
                                            flatRef.current?.scrollToIndex({
                                                animated: true,
                                                index: ScurbIndexCarRef.current,
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
                    {/* </LinearGradient>
                </BlurView> */}
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
                <View
                    // state={BlurState}
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
                                {/* <AnimatedIconMat
                                    // state={animateIconMatButton}
                                    // transition={{
                                    //   type: 'timing'
                                    // }}
                                    name='slideshow' size={vw(7)} color={Style.defaultRed} style={{ paddingVertical: vw(2), borderRadius: vw(7) }} /> */}
                            </TouchableOpacity>
                            {/* <AnimatedIcon
                                name='repeat' size={vw(7)} color={Style.defaultRed} style={{ paddingVertical: vw(2), }} /> */}
                        </View>
                    </LinearGradient>
                </View>
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
                        {/* Left Side */}
                        <LSide />
                        {/* <Flat/> */}
                        <View style={{ height: vh(100), width: vw(80) }}>
                            <FlashList
                                data={movieQuib}
                                // onScroll={onScroll}
                                persistentScrollbar={true}

                                showsVerticalScrollIndicator={true}
                                ListHeaderComponent={InitialQuib}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={QuibList}
                                initialScrollIndex={0}
                                viewabilityConfig={{
                                    viewAreaCoveragePercentThreshold: 10
                                }}
                                ref={flatRef}
                                estimatedItemSize={vh(15)}
                                contentContainerStyle={{ paddingHorizontal: vw(0) }}
                                ListFooterComponent={<></>}
                                ListFooterComponentStyle={{ paddingBottom: vh(15) }}
                                // onContentSizeChange={(_,h)=>setH2(h)}
                                // onLayout={(event) => setH1(event.nativeEvent.layout.height)}
                                onViewableItemsChanged={onViewableItemsChanged}
                            />
                        </View>
                        {/* Right Side */}
                        <RSide />

                    </View>
                    <QuibComposeModal />

                    {/* Quib timeline */}
                    {/* Quib timeline */}
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
