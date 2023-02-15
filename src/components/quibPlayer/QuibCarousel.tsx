import { Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import FastImage from 'react-native-fast-image'
import { LocalSvg } from 'react-native-svg'
import { vw } from 'rxn-units'
import { API } from '../../constants/Api'
import { Style } from '../../constants/Styles'
import { quibPlayerStyles } from './QuibPlayerStyle'


const getFormattedTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const mintues = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (mintues * 60);
    return { hours, mintues, seconds }
}


function QuibCarousel({ item, index }: any) {
    let { hours, mintues, seconds } = getFormattedTime(item.time);
    //Quib list quibs head in (profile image, name, timestamp and quib)
    const QuibHead = ({ hours, mintues, seconds, isSS, image, name }: any) => {
        if (isSS == true)
            return (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row',}}>
                        {/* <View style={{ justifyContent: 'flex-start', }}>
                            <TouchableOpacity>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: vw(3) }}>
                                    <FastImage source={{ uri: API + image }} style={{ width: vw(8), height: vw(8), marginTop: vw(-2.5), borderRadius: vw(.5), marginRight: vw(1) }} />
                                    <Text style={{ color: Style.defaultTxtColor, fontSize: 12, fontWeight: 'bold' }} numberOfLines={1} >{name}</Text>
                                </View>
                            </TouchableOpacity>
                        </View> */}
                        <View style={{ justifyContent: 'center', position: 'absolute', }}>
                            <TouchableOpacity>
                                <View style={[...[quibPlayerStyles.timer], { width: vw(20), height: vw(5), marginBottom: vw(0) }]}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(3), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ right: vw(2), position: 'absolute',}}>
                            <TouchableOpacity>
                                <LocalSvg
                                    fill={'#00000000'}
                                    width={vw(6)}
                                    height={vw(6)}
                                    asset={require('../../assets/bump.svg')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        else return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
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
                            <LocalSvg
                                fill={'#00000000'}
                                width={vw(6)}
                                height={vw(6)}
                                asset={require('../../assets/bump.svg')}
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
                        <QuibHead hours={hours} mintues={mintues} seconds={seconds} image={item.avatarBase32ImagePath} isSS={item.isScreenshot} name={null} />
                    {/* </View> */}
                    {/* <View style={[quibPlayerStyles.flatlistComps, { flex: 1, flexDirection: 'row', marginTop: vw(-35) }]}>
                        <View style={{ flex: 1, justifyContent: 'flex-start', }}>
                            <TouchableOpacity>
                                <View style={{ flexDirection: 'row', position: 'absolute', justifyContent: 'center', alignItems: 'center', paddingTop: vw(20) }}>
                                    <FastImage source={{ uri: API + item.avatarBase32ImagePath }} style={{ width: vw(8), height: vw(8), marginTop: vw(-2.5), borderRadius: vw(.5), marginRight: vw(1) }} />
                                    <Text style={{ color: Style.defaultTxtColor, fontSize: 16, fontWeight: 'bold' }} numberOfLines={1} >{item.displayName}:</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    <View style={{ flex: 1, }}>
                        <Text style={{ flex: 1, color: Style.defaultTxtColor, fontSize: 14, fontWeight: '500', textAlign: 'left' }}>{item.body}</Text>
                    </View>
                </View>
            )

        else return (
            <View key={index} style={quibPlayerStyles.flatlistContainer}>
                <QuibHead hours={hours} mintues={mintues} seconds={seconds} isSS={item.isScreenshot} image={null} name={null} />
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
        <View style={{ marginLeft: vw(3), marginRight:vw(1) }}>
            <QuibList />
        </View>
    )
}

export default memo(QuibCarousel);