import { Text, TouchableOpacity, View } from 'react-native'
import React, { memo, SetStateAction } from 'react'
import FastImage from 'react-native-fast-image'
import { vw } from 'rxn-units'
import { API } from '../../constants/Api'
import { Style } from '../../constants/Styles'
import { quibPlayerStyles } from './QuibPlayerStyle'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface props {
    item: any,
    index: number,
    handlePresentModalPress: (p: number) => void,
    isGuest: boolean,
    setActive: React.Dispatch<SetStateAction<boolean>>,
}

const getFormattedTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const mintues = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (mintues * 60);
    return { hours, mintues, seconds }
}


function QuibCarousel({ item, index, handlePresentModalPress, isGuest, setActive }: props) {
    let { hours, mintues, seconds } = getFormattedTime(item.time);

    const QuibHead = ({ hours, mintues, seconds, isSS }: any) => {
        if (isSS == true)
            return (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', }}>
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
                            <TouchableOpacity>
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
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', }}>
                    <View style={{ justifyContent: 'center', position: 'absolute', }}>
                        <TouchableOpacity>
                            <View style={[...[quibPlayerStyles.timer], { width: vw(20), height: vw(5), marginBottom: vw(0) }]}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(3), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ right: vw(2), position: 'absolute' }}>
                        <TouchableOpacity>
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
        if (!item.isScreenshot)
            return (
                <View key={index} style={quibPlayerStyles.flatlistContainer}>
                    {/* <View style={{ flex: 1, flexDirection: 'row' }}> */}
                    <QuibHead hours={hours} mintues={mintues} seconds={seconds} isSS={item.isScreenshot} />
                    <View style={{ flex: 1, }}>
                        <Text style={{ flex: 1, color: Style.defaultTxtColor, fontSize: 14, fontWeight: '500', textAlign: 'left' }}>{item.body}</Text>
                    </View>
                </View>
            )

        else return (
            <View key={index} style={quibPlayerStyles.flatlistContainer}>
                <QuibHead hours={hours} mintues={mintues} seconds={seconds} isSS={item.isScreenshot} />
                <View style={quibPlayerStyles.flatlistComps}>
                    <FastImage
                        source={{
                            uri: API + item.body,
                            cache: FastImage.cacheControl.immutable,
                            priority: FastImage.priority.normal
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{ width: vw(86), height: vw(50) }}
                    />
                </View>
            </View>
        )
    }
    return (
        <View style={{ marginLeft: vw(3), marginRight: vw(1) }}>
            <QuibList />
        </View>
    )
}

export default memo(QuibCarousel);