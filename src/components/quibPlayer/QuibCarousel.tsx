import { Text, TouchableOpacity, View } from 'react-native'
import React, { memo, SetStateAction } from 'react'
import FastImage from 'react-native-fast-image'
import { vw } from 'rxn-units'
import { API } from '../../constants/Api'
import { Style } from '../../constants/Styles'
import { quibPlayerStyles } from './QuibPlayerStyle'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AddBump } from '../../services/QuibAPIs'
import Toast from 'react-native-toast-message'

interface props {
    item: any,
    index: number,
    handlePresentModalPress: (p: number) => void,
    isGuest: boolean,
    setActive: React.Dispatch<SetStateAction<boolean>>,
    MovieId: number,
    userId: string,
    device: boolean,
    ItemHeight: number,
    ItemSpace: number,
    // State: boolean,
    isLand: boolean,
    isCine: boolean,
}

const getFormattedTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const mintues = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (mintues * 60);
    return { hours, mintues, seconds }
}



function QuibCarousel({ item, index, handlePresentModalPress, isGuest, setActive, MovieId, userId, device, ItemHeight, ItemSpace, isLand, isCine }: props) {
    // const ImgWidth = useMemo(() => first, [second])
    let { hours, mintues, seconds } = getFormattedTime(item.time);

    const QuibHead = ({ hours, mintues, seconds, isSS }: any) => {
        if (isSS == true)
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: vw(6), backgroundColor: 'red' }}>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ justifyContent: 'center', position: 'absolute', }}>
                            <TouchableOpacity
                                onPress={() => isGuest == true ?
                                    setActive(true) : handlePresentModalPress(item.time)}>
                                <View style={[...[quibPlayerStyles.timer], { width: vw(20), height: vw(5), marginBottom: vw(0) }]}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(3), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ right: vw(2), position: 'absolute', }}>
                            <TouchableOpacity
                                onPress={() =>
                                    isGuest == true
                                        ? setActive(true)
                                        : AddBump({
                                            quibId: item.id,
                                            MovieId: MovieId,
                                            userId: userId,
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
            )
        else return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'rgba( 248, 251, 248, .9)' }}>
                {/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}> */}
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', backgroundColor: 'rgba( 248, 251, 248, .9)' }}>
                    <View style={{ justifyContent: 'center', position: 'absolute', }}>
                        <TouchableOpacity
                            onPress={() => isGuest == true ?
                                setActive(true) : handlePresentModalPress(item.time)}>
                            <View style={[...[quibPlayerStyles.timer], { width: vw(20), height: vw(5), marginBottom: vw(0) }]}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(3), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ right: vw(2), position: 'absolute' }}>
                        <TouchableOpacity
                            onPress={() =>
                                isGuest == true
                                    ? setActive(true)
                                    : AddBump({
                                        quibId: item.id,
                                        MovieId: MovieId,
                                        userId: userId,
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
        )
    }




    //Quib List
    const QuibList = () => {
        if (isLand!) {
            return (
                <View key={index} style={[...[quibPlayerStyles.flatlistContainer],]}>
                    <QuibHead hours={hours} mintues={mintues} seconds={seconds} isSS={item.isScreenshot} />
                    {/* <View style={quibPlayerStyles.flatlistComps}> */}
                    <FastImage
                        source={{
                            uri: API + item.body,
                            cache: FastImage.cacheControl.immutable,
                            priority: FastImage.priority.normal
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{ width: vw(74), height: vw(35), }}
                    />
                    {/* </View> */}
                </View>
            )
        } else if (isCine) {
            return (
                <View key={index} style={[...[quibPlayerStyles.flatlistContainer],]}>
                    <QuibHead hours={hours} mintues={mintues} seconds={seconds} isSS={item.isScreenshot} />
                    <View style={quibPlayerStyles.flatlistComps}>
                        <FastImage
                            source={{
                                uri: API + item.body,
                                cache: FastImage.cacheControl.immutable,
                                priority: FastImage.priority.normal
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                            style={{ width: vw(60), height: vw(32), }}
                        />
                    </View>
                </View>
            )
        } else return (
            <View key={index} style={[...[quibPlayerStyles.flatlistContainer],]}>
                <QuibHead hours={hours} mintues={mintues} seconds={seconds} isSS={item.isScreenshot} />
                <View style={quibPlayerStyles.flatlistComps}>
                    <FastImage
                        source={{
                            uri: API + item.body,
                            cache: FastImage.cacheControl.immutable,
                            priority: FastImage.priority.normal
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{ width: vw(60), height: vw(32), }}
                    />
                </View>
            </View>
        )
    }
    return (
        // <View style={{ marginVertical: vw(3),  }}>
        <QuibList />
        // </View>
    )
}

export default memo(QuibCarousel);