import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import FastImage from 'react-native-fast-image'
import { LocalSvg } from 'react-native-svg'
import { vw } from 'rxn-units'
import { API } from '../../constants/Api'
import { Style } from '../../constants/Styles'
import { styles } from './Style'


const getFormattedTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const mintues = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (mintues * 60);
    return { hours, mintues, seconds }
}


function QuibCarousel({ item, index }: any) {
    let { hours, mintues, seconds } = getFormattedTime(item.time);
    //Quib list quibs head in (profile image, name, timestamp and quib)
    const QuibHead = ({ hours, mintues, seconds }: any) => {
            return (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', zIndex:2, elevation:4,  }}>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', }}>
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
                                <View style={[...[styles.timer], { width: vw(14), height: vw(4), marginBottom: vw(2) }]}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(2.6), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ right: vw(0), position: 'absolute' }}>
                            <TouchableOpacity>
                                <LocalSvg
                                    fill={'#00000000'}
                                    width={20}
                                    height={20}
                                    asset={require('../../assets/bump.svg')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        //  else return (
        //     <View style={{ flex: 1, flexDirection: 'row' }}>
        //         <View style={{ flex: 1, flexDirection: 'row', }}>
        //             <View style={{ justifyContent: 'flex-start', }}>
        //                 <TouchableOpacity>
        //                     <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: vw(8) }}>
        //                         <FastImage source={{ uri: API + image }} style={{ width: vw(8), height: vw(8), marginTop: vw(-2.5), borderRadius: vw(.5), marginRight: vw(1) }} />
        //                         <Text style={{ color: Style.defaultTxtColor, fontSize: 12, fontWeight: 'bold' }} numberOfLines={1} >{name}:</Text>
        //                     </View>
        //                 </TouchableOpacity>
        //             </View>
        //             <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', position: 'absolute', paddingLeft: vw(12) }}>
        //                 <TouchableOpacity>
        //                     <View style={[...[styles.timer], { width: vw(14), height: vw(4), marginBottom: vw(2) }]}>
        //                         <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(2.6), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
        //                     </View>
        //                 </TouchableOpacity>
        //             </View>
        //             <View style={{ right: vw(0), position: 'absolute' }}>
        //                 <TouchableOpacity>
        //                     <LocalSvg
        //                         fill={'#00000000'}
        //                         width={20}
        //                         height={20}
        //                         asset={require('../../assets/bump.svg')}
        //                     />
        //                 </TouchableOpacity>
        //             </View>
        //         </View>
        //     </View>
        // )
    }

    //Quib List
    const QuibList = () => {

        
            return(
                <View key={index} style={styles.flatlistContainer}>
                    <QuibHead hours={hours} mintues={mintues} seconds={seconds} />
                    <View style={styles.flatlistComps}>
                        <FastImage
                            source={{
                                uri: API + item.body,
                                cache: FastImage.cacheControl.immutable,
                                priority: FastImage.priority.normal
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                            style={{ width: vw(40), height: vw(40) }}
                        />
                    </View>
                </View>
            )
            // return (
            //     <View key={index} style={styles.flatlistContainer}>
            //         <View style={{flex:1, flexDirection:'row'}}>
            //             <QuibHead hours={hours} mintues={mintues} seconds={seconds} image={item.avatarBase32ImagePath} isSS={item.isScreenshot} name={item.displayName} />
            //         </View>
            //         <View style={[styles.flatlistComps, {flex:1, marginTop:vw(-15)}]}>
            //             <Text style={{ color: Style.defaultTxtColor, }}>{item.body}</Text>
            //         </View>
            //     </View>
            // )
        
        // else {
        //     return (
        //         <View key={index} style={styles.flatlistContainer}>
        //             <QuibHead hours={hours} mintues={mintues} seconds={seconds} isSS={item.isScreenshot}/>
        //             <View style={styles.flatlistComps}>
        //                 <FastImage
        //                     source={{
        //                         uri: API + item.body,
        //                         cache: FastImage.cacheControl.immutable,
        //                         priority: FastImage.priority.normal
        //                     }}
        //                     resizeMode={FastImage.resizeMode.contain}
        //                     style={{ width: vw(40), height: vw(40) }}
        //                 />
        //             </View>
        //         </View>
        //     )
        // }
    }

    return (
        <View>
            <QuibList />
        </View>
    )
}

export default memo(QuibCarousel);