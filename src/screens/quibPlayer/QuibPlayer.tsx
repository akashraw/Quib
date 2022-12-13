import { Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Style } from '../../constants/Styles'
import { vmin, vmax, vw, vh, percentage } from 'rxn-units';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PageHeader from '../../components/CustomHeader';
// import Slider from '@react-native-community/slider'
import { Slider } from '@miblanchard/react-native-slider'

interface props {
    navigation: any;
}
const getFormattedTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const mintues = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (mintues * 60);
    return { hours, mintues, seconds }
}
export default function QuibPlayer(props: props) {
    const MovieLen = 60;
    const isActive = useRef(false);
    const timer = useRef(0);
    const [MovieTime, setMovieTime] = useState(0);
    const [QuibTime, setQuibTime] = useState(0);
    const [PlayPause, setPlayPause] = useState('play');
    const { hours, mintues, seconds } = getFormattedTime(MovieTime);

    // timer 

    useEffect(() => {
        if (isActive.current && MovieTime < MovieLen) {
            timer.current = setInterval(() => {
                setQuibTime(MovieTime + 1)
                setMovieTime(MovieTime => MovieTime + 1)
            }, 1000);
        }
        else {
            clearInterval(timer.current);
            setPlayPause('play');
            isActive.current = false;
        }
        return () => clearInterval(timer.current);
    }, [isActive.current, MovieTime]);

    //play button
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
    //Inc and dec
    const IncSecond = () => {
        if (MovieTime < MovieLen)
            return setMovieTime((MovieTime) => MovieTime + 1)
    }
    const DecSecond = () => {
        if (MovieTime > 0)
            return setMovieTime((MovieTime) => MovieTime - 1)
    }

    const SyncTime = () => {
        return setQuibTime(MovieTime);
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
                <View style={{ alignItems: 'center', padding: 10 }}>
                    <View>
                        <Text style={styles.heading}>Timeline quib for</Text>
                    </View>
                    <View>
                        <Image style={styles.image} source={require('../../assets/Movie/arrival.jpeg')} />
                    </View>
                </View>
                
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
                                onValueChange={value => {
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
                            // thumbTouchSize={}
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
                                onValueChange={value => {
                                    value = Array.isArray(value) ? value[0] : value;
                                    setMovieTime(value);
                                }}
                                onSlidingComplete={value => {
                                    value = Array.isArray(value) ? value[0] : value;
                                    setQuibTime(value);
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
        borderWidth: 1,
        borderColor: '#E6E6E6',
        margin: 5,
        width: vw(80),
        overflow: 'hidden',
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
    }
})