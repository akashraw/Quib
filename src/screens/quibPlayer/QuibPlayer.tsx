import { Image, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Style } from '../../constants/Styles'
import { vmin, vmax, vw, vh, percentage } from 'rxn-units';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PageHeader from '../../components/CustomHeader';
import Lottie from 'lottie-react-native'
const screen = Dimensions.get('window');

interface props {
    navigation: any;
}
const getFormattedTime=(time: number)=>{
    const hours = Math.floor(time/3600);
    const mintues = Math.floor((time-(hours*3600))/60);
    const seconds = time -(hours*3600)-(mintues*60);
    return {hours, mintues, seconds}
}
export default function QuibPlayer(props: props) {
    const MovieLen = 60;
    const animationRef = useRef<Lottie>(null)
    const timer = useRef(0);
    const [MovieTime, setMovieTime] = useState(0);
    const [Active, setActive] = useState(false);
    const [PlayPause, setPlayPause] = useState('play');
    const {hours, mintues, seconds} = getFormattedTime(MovieTime);
    //play button
    const toggle = () => {
        if (Active == false) {
            setActive(!Active);
            return setPlayPause('pause');
        }
        else {
            setActive(!Active);
            return setPlayPause('play');
        }

    }
    //timer 
    useEffect(() => {

        if (Active && MovieTime < MovieLen) {
            timer.current = setInterval(() => {
                setMovieTime((MovieTime) => MovieTime + 1);
            }, 1000);
        }
    }, [Active])
    //timer cleanup
    if (MovieTime === MovieLen) {
        clearInterval(timer.current);
    }
    const IncSecond = () => {
        if (MovieTime < MovieLen)
            return setMovieTime((MovieTime) => MovieTime + 1)
    }
    const DecSecond = () => {
        if (MovieTime > 0)
            return setMovieTime((MovieTime) => MovieTime - 1)
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ width: vw(100), }}>
                <PageHeader
                    leftNode={
                        <TouchableOpacity onPress={() => props.navigation.goBack()}>
                            <Image source={require('../../assets/Movie/arrival.jpeg')} style={{ marginLeft: 5, width: 35, height: 45, borderRadius: 5, resizeMode: "contain" }} />
                        </TouchableOpacity>
                    }
                    headerNode={
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity onPress={DecSecond}>
                                <Icon name='minus-circle-outline' size={32} color={Style.defaultRed} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.timer}>
                                    <Text style={{ textAlign: 'center', color: '#fff' }}>{(hours<10)?`0`+`${hours}`:`${hours}`}:{(mintues<10)?(`0`+`${mintues}`):`${mintues}`}:{(seconds<10)?(`0`+`${seconds}`):`${seconds}`}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={IncSecond}>
                                <Icon name='plus-circle-outline' size={32} color={Style.defaultRed} />
                            </TouchableOpacity>
                        </View>
                    }
                    rightNode={
                        <TouchableOpacity onPress={toggle}>
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
            <View style={{ position: 'absolute', bottom: 0, width: vw(100), height: vh(7), backgroundColor: Style.quibColor, }}>
                <View style={styles.quibScrubber}>
                    <View style={styles.quibZero}>
                        <Text style={{ color: Style.defaultRed, textAlign: 'center' }}>Quib Zero</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Icon name='sync' size={30} color={Style.defaultRed} style={{ textAlign: 'center', }} />
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