import { Image, StyleSheet, Text, View, TouchableOpacity, FlatList, ListRenderItemInfo, Modal, Alert, Dimensions } from 'react-native'
import React, { useEffect, useState, useRef, useMemo, useCallback, PureComponent } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Style } from '../../constants/Styles'
import { vmin, vmax, vw, vh, percentage } from 'rxn-units';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PageHeader from '../CustomHeader';
import { Slider } from '@miblanchard/react-native-slider'
import DATA from '../../constants/Arrival.json'
import { API } from '../../constants/Api';
import FastImage from 'react-native-fast-image';
import { AddBump, getMovieLength, getMoviePoster, GetQuibsById } from '../../services/QuibAPIs';
import { LocalSvg } from 'react-native-svg';
import SyncButton from './SyncButton';
import QuibCarousel from './QuibCarousel';
import QuibCompose from './QuibCompose';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useBottomSheetBackHandler } from '../../screens/visitScreens/useBottomSheetBack';
import LinearGradient from 'react-native-linear-gradient';
import getFormattedTime from '../GetFormattedTime';
import Toast from 'react-native-toast-message';
import { DataProvider, LayoutProvider } from 'recyclerlistview';
// import { LayoutProvider } from 'recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider';


interface props {
    navigation: any;
    route: any,
}

const dimensionsForScreen = Dimensions.get('screen');

const createDataProvider = () => {
    return new DataProvider((r1, r2) => r1 != r2)
}


export default function QuibPlayerV2({ navigation, route }: props) {
    const isMovieMove = useRef<boolean>();
    const isQuibMove = useRef<boolean>();
    const MovieLen = useRef(0);
    const [DataProvider, setDataProvider] = useState<any[]>([]);
    const isActive = useRef(false);
    const timer = useRef(0);
    const [MovieTime, setMovieTime] = useState(0);
    const [QuibTime, setQuibTime] = useState(0);
    const [PlayPause, setPlayPause] = useState('play-circle-outline');
    const { hours, mintues, seconds } = getFormattedTime(MovieTime);
    const [movieQuib, setMovieQuib] = useState<any[]>();
    const [IsLoading, setIsLoading] = useState(true)
    const flatRef = useRef<FlatList>(null);
    const posterRef = useRef(String);
    const [isPoster, setIsPoster] = useState(Boolean);
    const MovieId = route.params;
    // const Movietitle = route.params.Movietitle;
    const quibTimeRef = useRef<number[]>([]);
    const quibScrubIndexRef = useRef<number>(0);
    const quibPlayIndexRef = useRef<number>(0);
    const resMap = useRef<any[]>([]);
    const [isVisble, setIsVisble] = useState(false);
    // const [isVisbleModal, setIsVisbleModal] = useState(false);
    const TimeRef = useRef(0);
    const [AllSync, setAllSync] = useState<boolean>(true);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { handleSheetPositionChange } = useBottomSheetBackHandler(bottomSheetModalRef);
    // const [MyStreamQuibs, setMyStreamQuibs] = useState<any[]>([]);

    //Api calls 

    useEffect(() => {
        Promise.all([
            getMoviePoster(MovieId)
                .then((res: any) => posterRef.current = (res.map((res: any) => res.posterContent)))
                .then(() => FileCheck()),
            GetQuibsById(MovieId)
                .then((res: any) => { setMovieQuib(res); quibTimeRef.current = res.map((res: any) => res.time); resMap.current = res.filter((item: any) => item.isScreenshot == true || item.isSeedQuib); }),
            // .then(() => setC(() => movieQuib.map((res, inde) => {quibScrubIndexRef.current[inde] = inde; return res.time }))),
            // .then(() => console.log(quibTimeRef.current)),
            getMovieLength(MovieId)
                .then((res: any) => MovieLen.current = (res.map((res: any) => res.length)))
        ]).then(() => setIsLoading(false));
        // console.log(movieQuib);
    }, [])


    // movie timer  stopwatch
    useEffect(() => {
        console.log(quibPlayIndexRef.current);


        // console.log(quibTimeRef.current[MovieTime]);
        if (quibTimeRef.current[quibPlayIndexRef.current] <= MovieTime) {

            flatRef.current?.scrollToIndex({
                animated: true,
                index: quibPlayIndexRef.current
            })
            // console.log(quibTimeRef.current[quibPlayIndexRef.current]);
            quibPlayIndexRef.current = quibPlayIndexRef.current + 1;
        }

    }, [isActive.current, MovieTime]);

    const _layoutProvider = new LayoutProvider(
        index => 0,
        (type, dim) => {
            dim.width = dimensionsForScreen.width;
            dim.height = dimensionsForScreen.height;
        }
    )



    //file check
    const FileCheck = () => {
        let FS = posterRef.current.toString().split('.').pop();

        if (FS == 'jpeg' || FS == 'jpg') {
            setIsPoster(true);
            return
        }
        else setIsPoster(false);

    }

    //play button control
    const toggle = () => {
        if (isActive.current == false) {
            isActive.current = true;
            setPlayPause('pause-circle-outline');
            if (MovieTime < MovieLen.current) {
                timer.current = setInterval(() => {
                    setQuibTime(MovieTime + 1)
                    setMovieTime(MovieTime => MovieTime + 1);
                }, 1000)
            }
            else {
                clearInterval(timer.current);
                setPlayPause('play-circle-outline');
                isActive.current = false;
            }
        }
        else {
            clearInterval(timer.current)
            isActive.current = false;
            return setPlayPause('play-circle-outline');
        }

    }


    //Inc and dec on timer
    const IncSecond = () => {
        if (MovieTime < MovieLen.current)
            return setMovieTime((MovieTime) => MovieTime + 1)
    }
    const DecSecond = () => {
        if (MovieTime > 0)
            return setMovieTime((MovieTime) => MovieTime - 1)
    }


    // to sync the movie and quib scruber
    const SyncQuibTime = () => {
        isMovieMove.current = false;
        isQuibMove.current = false;
        setQuibTime(MovieTime);
    }
    const SyncMovieTime = () => {
        isMovieMove.current = false;
        isQuibMove.current = false;
        setMovieTime(QuibTime);
    }
    // class Flat extends PureComponent{

    //   render(): React.ReactNode {
    //     return <FlatList
    //       data={movieQuib}
    //       initialNumToRender={10}
    //       windowSize={5}
    //       maxToRenderPerBatch={10}
    //       updateCellsBatchingPeriod={30}
    //       showsVerticalScrollIndicator={false}
    //       ListHeaderComponent={InitialQuib}
    //       keyExtractor={(_, index) => index.toString()}
    //       renderItem={QuibList}
    //       initialScrollIndex={0}
    //       ref={flatRef}
    //       onScrollToIndexFailed={error => {
    //         flatRef.current?.scrollToOffset({
    //           offset: error.averageItemLength * error.index,
    //           animated: true,
    //         });
    //         setTimeout(() => {
    //           if (DATA.length !== 0 && flatRef !== null) {
    //             flatRef.current?.scrollToIndex({
    //               index: error.index,
    //               animated: true,
    //             });
    //           }
    //         }, 100);
    //       } } />;
    //   }
    // }



    //Quib list quibs head in (profile image, name, timestamp and quib)
    const QuibHead = ({ hours, mintues, seconds, image, name, quibId, time }: any) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                    <View style={{ justifyContent: 'flex-start', }}>
                        <TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: vw(3) }}>
                                <FastImage source={{ uri: `data:image/png;base64,${image}` }} style={{ width: vw(8), height: vw(8), marginTop: vw(-2.5), borderRadius: vw(.5), marginRight: vw(1) }} />
                                <Text style={{ color: Style.defaultTxtColor, fontSize: 12, fontWeight: 'bold' }} numberOfLines={1} >{name}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', position: 'absolute', left: vw(30) }}>
                        <TouchableOpacity onPress={() => { TimeRef.current = time; handlePresentModalPress; }}>
                            <View style={[...[styles.timer], { width: vw(16), height: vw(5), marginBottom: vw(2) }]}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(3), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* Bump Api itegrated */}
                    <View style={{ right: vw(0), position: 'absolute' }}>
                        <TouchableOpacity onPress={() => AddBump({
                            quibId: quibId,
                            MovieId: MovieId.MovieId,
                            userId: 'fe8288eb-5cfe-4b26-b676-9ce3bbb9e1c1'
                        }).then(() => Toast.show(
                            {
                                type: 'success',
                                text1: 'Bumped!',
                                text2: 'Quib has been add to your stream successfully.'
                            }
                        ))
                        } >
                            <LocalSvg
                                fill={'#00000000'}
                                width={22}
                                height={22}
                                asset={require('../../assets/bump.svg')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    const memoRender = useMemo(() => QuibList, [movieQuib]);

    type renderList = {
        item: any,
        index: any,
    }
    //Quib List
    class QuibList extends PureComponent<renderList> {


        render(): React.ReactNode {
            // console.log('render');

            let { hours, mintues, seconds } = getFormattedTime(this.props.item.time);

            if (!this.props.item.isScreenshot) {
                return (
                    <View key={this.props.index} style={styles.flatlistContainer}>
                        <QuibHead time={this.props.item.time} hours={hours} mintues={mintues} seconds={seconds} image={this.props.item.avatarBase32ImagePath} isSS={this.props.item.isScreenshot} name={this.props.item.displayName} quibId={this.props.item.id} />
                        <View style={styles.flatlistComps}>
                            <Text style={{ color: Style.defaultTxtColor, }}>{this.props.item.body}</Text>
                        </View>
                    </View>
                )
            }
            else {
                return (
                    <View key={this.props.index} style={styles.flatlistContainer}>
                        <QuibHead time={this.props.item.time} hours={hours} mintues={mintues} seconds={seconds} isSS={this.props.item.isScreenshot} image={null} name={null} quibId={this.props.item.id} />
                        <View style={styles.flatlistComps}>
                            <FastImage
                                source={{
                                    uri: API + this.props.item.body,
                                    cache: FastImage.cacheControl.immutable,
                                    priority: FastImage.priority.normal
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                                style={{ width: vw(80), height: vw(40) }}
                            />
                        </View>
                    </View>
                )
            }
        }
    }

    // intial Quib 
    const InitialQuib = () => {
        // console.log('render')
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: Style.borderColor,
                marginVertical: vw(2),
            }}
            >
                <View>
                    {/* <Text style={styles.heading}>Timeline quib for</Text> */}
                </View>
                <View>
                    <FastImage
                        style={styles.image}
                        source={{
                            // uri: `${API}${Poster}`,
                            uri: ((isPoster) ? `${API}${posterRef.current}` : `data:image/jpeg;base64,${posterRef.current}`),
                            priority: FastImage.priority.high,
                            cache: FastImage.cacheControl.immutable
                        }}
                    />
                </View>
            </View>
        )
    }

    const QuibCarouselModal = () => {
        if (isVisble == true) return (
            <View style={{
                flex: 1,
                justifyContent: 'center', alignItems: 'center', position: 'absolute', overflow: 'hidden',
                backgroundColor: 'rgba(4, 59, 92, 0.8 )', zIndex: 2, elevation: 2, height: vmax(),
            }}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ width: vw(100), height: vh(50), marginTop: vw(-90), alignSelf: 'center', backgroundColor: 'transparent' }}
                    contentContainerStyle={{ justifyContent: 'center', alignSelf: 'center', marginHorizontal: vw(2) }}
                    data={resMap.current}
                    renderItem={({ item, index }) => < QuibCarousel item={item} index={index} />}
                    initialNumToRender={10}
                    windowSize={5}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={30}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    initialScrollIndex={0}
                />
            </View>
        )
        else return null;
    }

    // variables
    const snapPoints = useMemo(() => ['80 %', '95%'], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                opacity={.6}
                onPress={() => bottomSheetModalRef.current?.dismiss}
                pressBehavior='close'
            />
        ),
        []
    );

    const QuibComposeModal = () => {
        return (
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetPositionChange}
                // containerStyle={{ width: vw(100), height: vh(100), backgroundColor: 'grey' }}
                backdropComponent={renderBackdrop}

            >
                <QuibCompose MovieId={MovieId.MovieId} hour={hours} mins={mintues} secs={seconds} time={TimeRef.current} />
                {/* <QuibComposeTabView/> */}
            </BottomSheetModal>
        )
    }
    return (
        <>
            <BottomSheetModalProvider>
                <QuibComposeModal />
                <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: Style.quibBackColor }}>
                    {/* Quibs flatlist */}
                    {/* Quibs flatlist */}
                    {/* Quibs flatlist */}
                    {/* Quibs flatlist */}
                    {/* Quibs flatlist */}
                    <View style={styles.container}>
                        {/*modal*/}
                        {/*modal*/}
                        {/*modal*/}
                        {/*modal*/}
                        <QuibCarouselModal />


                        {/* Quib List */}
                        {/* Quib List */}
                        {/* Quib List */}
                        {/* Quib List */}


                        {/* <Flat/> */}


                        <FlatList
                            data={movieQuib}
                            initialNumToRender={10}
                            windowSize={5}
                            maxToRenderPerBatch={10}
                            updateCellsBatchingPeriod={30}
                            showsVerticalScrollIndicator={false}
                            ListHeaderComponent={InitialQuib}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item, index }: any) => <QuibList item={item} index={index} />}
                            initialScrollIndex={0}
                            ref={flatRef}
                            onScrollToIndexFailed={(error) => {
                                flatRef.current?.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                                setTimeout(() => {
                                    if (DATA.length !== 0 && flatRef !== null) {
                                        flatRef.current?.scrollToIndex({ index: error.index, animated: true });
                                    }
                                }, 1)
                            }}

                        />
                    </View>
                    {/* Quib timeline */}
                    {/* Quib timeline */}
                    {/* Quib timeline */}
                    {/* Quib timeline */}
                    <View style={{ position: 'absolute', bottom: 0, width: vw(100), flexDirection: 'column', height: vh(22), }}>
                        <LinearGradient colors={['#00000000', Style.quibHeaderGrad, '#000000']} style={{ flex: 1, width: vw(100), marginTop: vw(0), justifyContent: 'flex-end', }} >
                            <View style={styles.quibScrubber}>

                                {/*quib Scrubber*/}
                                <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                        <Slider
                                            maximumValue={MovieLen.current}
                                            minimumTrackTintColor='#00000000'
                                            maximumTrackTintColor='#00000000'
                                            // minimumTrackTintColor={Style.defaultRed}
                                            // maximumTrackTintColor={Style.defaultTxtColor}
                                            containerStyle={{ width: vw(90), }}
                                            value={QuibTime}
                                            onSlidingStart={() => isActive.current = false}
                                            trackClickable={false}
                                            step={1}
                                            onSlidingComplete={value => {
                                                value = Array.isArray(value) ? value[0] : value;
                                                setQuibTime(value);

                                                // quibPlayIndexRef.current = value;
                                                isQuibMove.current = true;
                                                const Reduce = DATA.reduce((accumulator, current) => {
                                                    const val = Array.isArray(value) ? value[0] : value;
                                                    return Math.abs(current.Time - val) < Math.abs(accumulator.Time - val) ? (current) : (accumulator);
                                                })
                                                const ScurbIndex = DATA.findIndex((item, index) => {
                                                    if (item.Time == Reduce.Time) {
                                                        quibScrubIndexRef.current = index;
                                                        return index;
                                                    }
                                                })
                                                if (ScurbIndex < 0) {
                                                    flatRef.current?.scrollToOffset({
                                                        animated: true,
                                                        offset: 0
                                                    })
                                                }
                                                else {
                                                    toggle;
                                                    flatRef.current?.scrollToIndex({
                                                        animated: true,
                                                        index: ScurbIndex
                                                    })
                                                }
                                            }
                                            }
                                            renderThumbComponent={() => {
                                                if (!AllSync) {

                                                    if (QuibTime == MovieTime) {
                                                        return <Image source={require('../../assets/bottom.png')}
                                                            style={{ width: vw(5), marginLeft: vw(-3), left: vw(2.5), height: vw(5), resizeMode: 'contain', bottom: vw(2), }}
                                                        />
                                                    } else return <Image source={require('../../assets/bottom_line.png')}
                                                        style={{ width: vw(5), marginLeft: vw(-3), left: vw(2.5), height: vw(5), resizeMode: 'contain', bottom: vw(2), }}
                                                    />
                                                } else return null
                                            }}
                                            trackStyle={{ marginLeft: vw(1), }}
                                            animateTransitions={true}
                                        />
                                    </View>

                                    {/* Movie Scrubber  */}
                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: vw(-14) }}>
                                        <Slider
                                            maximumValue={MovieLen.current}
                                            minimumTrackTintColor={Style.defaultRed}
                                            maximumTrackTintColor={Style.defaultTxtColor}
                                            containerStyle={{ width: vw(90) }}
                                            value={MovieTime}
                                            trackClickable={true}
                                            step={1}
                                            // onValueChange={value => {
                                            //     value = Array.isArray(value) ? value[0] : value;
                                            //     setMovieTime(value);
                                            // }}
                                            onSlidingComplete={async (value) => {
                                                value = Array.isArray(value) ? value[0] : value;
                                                // setQuibTime(value);
                                                isMovieMove.current = true;
                                                setMovieTime(value);
                                                quibPlayIndexRef.current = value;
                                                const Reduce = DATA.reduce((accumulator, current) => {
                                                    const val = Array.isArray(value) ? value[0] : value;
                                                    return Math.abs(current.Time - val) < Math.abs(accumulator.Time - val) ? (current) : (accumulator);
                                                })
                                                const ScurbIndex = DATA.findIndex((item, index) => {
                                                    if (item.Time == Reduce.Time) {
                                                        quibScrubIndexRef.current = index;
                                                        return index;
                                                    }
                                                })
                                                if (ScurbIndex < 0) {
                                                    flatRef.current?.scrollToOffset({
                                                        animated: true,
                                                        offset: 0
                                                    })
                                                }

                                                else {
                                                    flatRef.current?.scrollToIndex({
                                                        animated: true,
                                                        index: ScurbIndex
                                                    })
                                                }
                                            }}
                                            renderThumbComponent={() => {
                                                if (!AllSync) {
                                                    return <Image source={require('../../assets/top.png')}
                                                        style={{ width: vw(5), marginLeft: vw(-3), left: vw(2.5), height: vw(5), resizeMode: 'contain', bottom: vw(2.5), }}
                                                    />
                                                } else return (
                                                    <TouchableOpacity style={{ paddingHorizontal: 0, justifyContent: 'center', }}>
                                                        {/* <LocalSvg
                                                            
                                                            style={{ marginLeft: vw(0), left: vw(0), bottom: vw(-1.1), }}
                                                            width={vw(25)}
                                                            height={vw(25)}
                                                            asset={require('../../assets/all-sync-mode.svg')}
                                                        /> */}
                                                        <Image source={require('../../assets/all-sync-mode.png')}
                                                            style={{ width: vw(8.5), height: vw(8.5), resizeMode: 'contain', marginLeft: vw(-6), left: vw(3.5), }}
                                                        />
                                                    </TouchableOpacity>

                                                )
                                            }}
                                            trackStyle={{ marginLeft: vw(1), }}
                                            animateTransitions={true}
                                        // thumbTouchSize={}
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

                            <View style={{ width: vw(100), justifyContent: 'center', flex: 1, alignSelf: 'center', paddingHorizontal: vw(6), paddingBottom: vw(3) }}>

                                <PageHeader
                                    leftNode={
                                        <View>
                                            <TouchableOpacity onPress={() => setIsVisble(!isVisble)}>
                                                <LocalSvg
                                                    style={{}}
                                                    width={vw(18)}
                                                    height={vw(18)}
                                                    asset={require('../../assets/SVG/carousel-off.svg')}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    }
                                    headerNode={
                                        //

                                        <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: vw(0) }}>
                                                <TouchableOpacity activeOpacity={.5} onPress={DecSecond}>
                                                    <Icon name='minus-circle-outline' size={32} color={Style.defaultRed} />
                                                </TouchableOpacity>
                                                <TouchableOpacity activeOpacity={.5} onPress={() => toggle()} >
                                                    <Icon name={PlayPause} style={{ paddingHorizontal: vw(1) }} size={70} color={Style.defaultRed} />
                                                </TouchableOpacity>
                                                <TouchableOpacity activeOpacity={.5} onPress={IncSecond}>
                                                    <Icon name='plus-circle-outline' size={32} color={Style.defaultRed} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ paddingBottom: vw(0) }}>
                                                <TouchableOpacity activeOpacity={.5} onPress={handlePresentModalPress}>
                                                    <View style={[...[styles.timer], { height: vw(6) }]}>
                                                        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: '500' }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                                                    </View>
                                                </TouchableOpacity>

                                            </View>
                                        </View>
                                    }
                                    rightNode={
                                        <View style={{ justifyContent: 'center', flex: 1, width: vw(18), height: vw(18) }} >

                                            {/* quib sunc butttons*/}
                                            <SyncButton isMovieMove={isMovieMove.current} isQuibMove={isQuibMove.current} movieTime={MovieTime} quibTime={QuibTime} isSync={AllSync} isMovieSync={false} syncMovie={SyncMovieTime} syncQuib={SyncQuibTime} toggleAllSync={() => { setAllSync(!AllSync); isMovieMove.current = false; isQuibMove.current = false; }} />

                                            {/* <Icon name='sync' size={30} color={Style.defaultRed} style={{ textAlign: 'center', }} /> */}
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
                    </View>
                </SafeAreaView>
            </BottomSheetModalProvider>
            <Toast />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: vw(96),
        // overflow: 'hidden',
        // padding: vw(3),
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        // marginBottom:-80,
        color: Style.defaultTxtColor,
    },
    image: {
        resizeMode: 'contain',
        width: vw(70),
        height: vh(50),
        margin: vw(5)
    },
    quibScrubber: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: vw(3),
        paddingTop: vw(10),
        paddingBottom: vw(1.5)
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
        borderWidth: 1,
        borderColor: Style.borderColor,
        paddingVertical: vw(1),
        paddingHorizontal: vw(3),
        marginVertical: vw(2),
    }
})


