import { Image, StyleSheet, Text, View, TouchableOpacity, FlatList, ListRenderItemInfo } from 'react-native'
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Style } from '../../constants/Styles'
import { vmin, vmax, vw, vh, percentage } from 'rxn-units';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PageHeader from '../../components/CustomHeader';
import { Slider } from '@miblanchard/react-native-slider'
import DATA from '../../constants/Arrival.json'
import { API } from '../../constants/Api';
interface props {
    navigation: any;
}
const getFormattedTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const mintues = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (mintues * 60);
    return { hours, mintues, seconds }
}
const ReduceIndex = (time: number)=>{
    return DATA.reduce((acc, curr)=>{return Math.abs(curr.Time-time)<Math.abs(acc.Time-time)? (curr):(acc)})
}
export default function QuibPlayer(props: props) {
    const MovieLen = 6981;
    const isActive = useRef(false);
    const timer = useRef(0);
    const [MovieTime, setMovieTime] = useState(0);
    const [QuibTime, setQuibTime] = useState(0);
    const [PlayPause, setPlayPause] = useState('play');
    const { hours, mintues, seconds } = getFormattedTime(MovieTime);
    const flatRef = useRef<FlatList>(null);

    // movie timer  stopwatch
    useEffect(() => {
        if (isActive.current && MovieTime < MovieLen) {
            timer.current = setInterval(() => {
                setQuibTime(MovieTime + 1)
                setMovieTime(MovieTime => MovieTime + 1)
                let index = ReduceIndex(MovieTime);
                let ScrubIndex = DATA.findIndex(()=>{
                    
                })                
                
            }, 1000);
        }
        else {
            clearInterval(timer.current);
            setPlayPause('play');
            isActive.current = false;
        }
        return () => clearInterval(timer.current);
    }, [isActive.current, MovieTime]);

    //play button control
    const toggle = () => {
        if (isActive.current == false) {
            isActive.current = true;
            return setPlayPause('pause');
        }
        else {
            isActive.current = false;
            return setPlayPause('play');
        }

    }
    //Inc and dec on timer
    const IncSecond = () => {
        if (MovieTime < MovieLen)
            return setMovieTime((MovieTime) => MovieTime + 1)
    }
    const DecSecond = () => {
        if (MovieTime > 0)
            return setMovieTime((MovieTime) => MovieTime - 1)
    }


    // to sync the movie and quib scruber
    const SyncTime = () => {
        return setQuibTime(MovieTime);
    }

    //Quib list quibs head in (profile image, name, timestamp and quib)
    const QuibHead = ({ hours, mintues, seconds, image, name }: any) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                    <View style={{ justifyContent: 'flex-start', }}>
                        <TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={{ uri: API + image }} style={{ width: vw(8), height: vw(8), borderRadius: vw(.5), marginRight: vw(1) }} />
                                <Text style={{ color: Style.defaultTxtColor, fontSize: 12, fontWeight: 'bold' }}>{name}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', position: 'absolute', left: vw(30) }}>
                        <TouchableOpacity>
                            <View style={[...[styles.timer], { width: vw(14), height: vw(4), marginBottom: vw(2) }]}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(2.6), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ right: vw(0), position: 'absolute' }}>
                        <TouchableOpacity>
                            <Image source={require('../../assets/bump-red.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


        )
    }

    //Quib List
    const QuibList = useCallback(({ item, index }: any) => {
        // console.log('render')
        let { hours, mintues, seconds } = getFormattedTime(item.Time);
        if (item.IsScreenshot == 0) {
            return (
                <View key={index} style={styles.flatlistContainer}>
                    <QuibHead hours={hours} mintues={mintues} seconds={seconds} image={item.AvatarBase32ImagePath} name={item.DisplayName} />
                    <View style={styles.flatlistComps}>
                        <Text style={{ color: Style.defaultTxtColor, }}>{item.Body}</Text>
                    </View>
                </View>
            )
        }
        else {
            return (
                <View key={index} style={styles.flatlistContainer}>
                    <QuibHead hours={hours} mintues={mintues} seconds={seconds} image={null} name={null} />
                    <View style={styles.flatlistComps}>
                        <Image source={{ uri: API + item.Body }} style={{ width: vw(70), height: vw(30), resizeMode: 'contain' }} />
                    </View>
                </View>
            )
        }
    }, [])
    // intial Quib 
    const InitialQuib = () => {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#E6E6E6',

            }}
            >
                <View>
                    <Text style={styles.heading}>Timeline quib for</Text>
                </View>
                <View>
                    <Image style={styles.image} source={require('../../assets/Movie/arrival.jpeg')} />
                </View>
            </View>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ width: vw(100), }}>
                <PageHeader
                    leftNode={
                        <TouchableOpacity activeOpacity={.5} onPress={() => props.navigation.goBack()}>
                            <Image source={require('../../assets/Movie/arrival.jpeg')} style={{ marginLeft: 5, width: 35, height: 45, borderRadius: 5, resizeMode: "contain" }} />
                        </TouchableOpacity>
                    }
                    headerNode={
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={.5} onPress={DecSecond}>
                                <Icon name='minus-circle-outline' size={32} color={Style.defaultRed} />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.5}>
                                <View style={styles.timer}>
                                    <Text style={{ textAlign: 'center', color: '#fff' }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.5} onPress={IncSecond}>
                                <Icon name='plus-circle-outline' size={32} color={Style.defaultRed} />
                            </TouchableOpacity>
                        </View>
                    }
                    rightNode={
                        <TouchableOpacity activeOpacity={.5} onPress={() => { toggle(); }} hitSlop={{ bottom: 10, left: 20, right: 10, top: 10 }}>
                            <Icon name={PlayPause} size={40} color={Style.defaultRed} />
                        </TouchableOpacity>
                    }
                />
            </View>
            {/* Quibs */}
            <View style={styles.container}>

                {/* Quib List */}
                <FlatList
                    data={DATA}
                    // maxToRenderPerBatch={2}
                    // initialNumToRender={500}
                    initialNumToRender={10}
                    windowSize={5}
                    maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={30}
                    removeClippedSubviews={false}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={InitialQuib}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={QuibList}
                    initialScrollIndex={0}
                    ref={flatRef}
                    onScrollToIndexFailed={(error) => {
                        flatRef.current?.scrollToOffset({ offset: error.averageItemLength * error.index, animated: false });
                        setTimeout(() => {
                            if (DATA.length !== 0 && flatRef !== null) {
                                flatRef.current?.scrollToIndex({ index: error.index, animated: false });
                            }
                        }, 100)
                    }}

                />

            </View>

            {/* Quib timeline */}
            <View style={{ position: 'absolute', bottom: 0, width: vw(100), height: vh(9), backgroundColor: Style.quibColor, }}>
                <View style={styles.quibScrubber}>
                    <View style={styles.quibZero}>
                        <Text style={{ color: Style.defaultRed, textAlign: 'center' }}>Quib Zero</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: vw(3) }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Slider
                                maximumValue={MovieLen}
                                minimumTrackTintColor='#00000000'
                                maximumTrackTintColor='#00000000'
                                // minimumTrackTintColor={Style.defaultRed}
                                // maximumTrackTintColor={Style.defaultTxtColor}
                                containerStyle={{ width: vw(65), }}
                                value={QuibTime}
                                trackClickable={true}
                                step={1}
                                onSlidingComplete={value => {
                                    value = Array.isArray(value) ? value[0] : value;
                                    setQuibTime(value);
                                }}
                                renderThumbComponent={() => {
                                    if (QuibTime == MovieTime) {
                                        return <Image source={require('../../assets/bottom.png')}
                                            style={{ width: vw(5), marginLeft: vw(-3), left: vw(2), height: vw(5), resizeMode: 'contain', bottom: vw(0.5), }}
                                        />
                                    } else return <Image source={require('../../assets/bottom_line.png')}
                                        style={{ width: vw(5), marginLeft: vw(-3), left: vw(2), height: vw(5), resizeMode: 'contain', bottom: vw(0.5), }}
                                    />
                                }}
                                trackStyle={{ marginLeft: vw(1), }}
                                animateTransitions={true}
                            />

                        </View>
                        {/* Movie Scrubber  */}

                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: vw(-13) }}>
                            <Slider
                                maximumValue={MovieLen}
                                minimumTrackTintColor={Style.defaultRed}
                                maximumTrackTintColor={Style.defaultTxtColor}
                                containerStyle={{ width: vw(65), }}
                                value={MovieTime}
                                trackClickable={true}
                                step={1}
                                // onValueChange={value => {
                                //     value = Array.isArray(value) ? value[0] : value;
                                //     setMovieTime(value);
                                // }}
                                onSlidingComplete={async (value) => {
                                    console.log(value);

                                    value = Array.isArray(value) ? value[0] : value;
                                    setQuibTime(value);
                                    setMovieTime(value);
                                    const Reduce = DATA.reduce((accumulator, current) => {
                                        const val = Array.isArray(value) ? value[0] : value;
                                        return Math.abs(current.Time - val) < Math.abs(accumulator.Time - val) ? (current) : (accumulator);
                                    })


                                    const ScurbIndex = DATA.findIndex((item, index) => {
                                        if (item.Time == Reduce.Time) {
                                            return index;
                                        }
                                    })
                                    
                                    if (ScurbIndex < 0) {
                                        flatRef.current?.scrollToOffset({
                                            animated: false,
                                            offset: 0
                                        })
                                    }
                                    else {
                                        flatRef.current?.scrollToIndex({
                                            animated: false,
                                            index: ScurbIndex
                                        })
                                    }
                                }}
                                renderThumbComponent={() => {
                                    return <Image source={require('../../assets/top.png')}
                                        style={{ width: vw(5), marginLeft: vw(-3), left: vw(2), height: vw(5), resizeMode: 'contain', bottom: vw(2.3), }}
                                    />;
                                }}
                                trackStyle={{ marginLeft: vw(1), }}
                                animateTransitions={true}
                            // thumbTouchSize={}
                            />
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center' }} >
                        <TouchableOpacity activeOpacity={.5} onPress={SyncTime}>
                            <Icon name='sync' size={30} color={Style.defaultRed} style={{ textAlign: 'center', }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: vw(90),
        overflow: 'hidden',
        padding: vw(3),
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        // marginBottom:-80,
        color: Style.defaultTxtColor,
    },
    image: {
        resizeMode: 'contain',
        width: vw(75),
        height: vh(60),
    },
    quibScrubber: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 5,
    },
    quibZero: {
        borderWidth: 3,
        width: vw(12),
        height: vw(12),
        borderRadius: vw(6),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Style.defaultRed
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
        borderColor: '#E6E6E6',
        paddingVertical: vw(1),
        paddingHorizontal: vw(3),
        marginVertical: vw(3),
    }
})