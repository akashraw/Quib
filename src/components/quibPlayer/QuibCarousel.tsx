import * as React from 'react';
import { useRef } from 'react';
import { Dimensions, Text, View, Modal, Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import { LocalSvg } from 'react-native-svg';
import { vh, vw } from 'rxn-units';
import { API, GetQuibsByIdAPI } from '../../constants/Api';
import { Style } from '../../constants/Styles';

const getFormattedTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const mintues = Math.floor((time - (hours * 3600)) / 60);
    const seconds = time - (hours * 3600) - (mintues * 60);
    return { hours, mintues, seconds }
}
type QC = {
    data:any,
    isModalVisble: boolean,

}


function QuibCarousel({data, isModalVisble}:QC) {
    const width = Dimensions.get('window').width;



    const QuibHead = ({ hours, mintues, seconds, image, name }: any) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                    <View style={{ justifyContent: 'flex-start', }}>
                        <TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <FastImage source={{ uri: API + image }} style={{ width: vw(8), height: vw(8), borderRadius: vw(.5), marginRight: vw(1) }} />
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
    }



    const QuibList = React.useCallback(({ item, index }: any) => {
        let { hours, mintues, seconds } = getFormattedTime(item.time);

        if (!item.isScreenshot) {
            return (
                <View key={index} style={styles.flatlistContainer}>
                    <QuibHead hours={hours} mintues={mintues} seconds={seconds} image={item.avatarBase32ImagePath} name={item.displayName} />
                    <View style={styles.flatlistComps}>
                        <Text style={{ color: Style.defaultTxtColor, }}>{item.body}</Text>
                    </View>
                </View>
            )
        }
        else {
            return (
                <View key={index} style={styles.flatlistContainer}>
                    <QuibHead hours={hours} mintues={mintues} seconds={seconds} image={null} name={null} />
                    <View style={styles.flatlistComps}>
                        <FastImage
                            source={{
                                uri: API + item.body,
                                cache: FastImage.cacheControl.immutable,
                                priority: FastImage.priority.normal
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                            style={{ width: vw(70), height: vw(40) }}
                        />
                    </View>
                </View>
            )
        }
    }, [])
    return (
        <View>
            <Modal
                style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}
                animationType="slide"
                transparent={false}
                visible={isModalVisble}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    
                }}
            >
                <GestureHandlerRootView>
                    <Carousel
                    loop={false}
                    windowSize={5}
                        vertical={true}
                        width={width/1.5}
                        height={vh(100) / 4}
                        style={{
                            height: vh(100),
                            justifyContent: 'center',
                            alignSelf: 'center'
                        }}
                        
                        // autoPlay={true}
                        data={data}
                        // scrollAnimationDuration={1000}
                        onSnapToItem={(index) => console.log('current index:', index)}
                        renderItem={QuibList}
                    // (

                    // <View
                    //     key={index}
                    //     style={{
                    //         flex: 1,
                    //         borderWidth: 1,
                    //         justifyContent: 'center',
                    //         overflow: 'hidden',
                    //         alignItems: 'center',
                    //         marginHorizontal: vw(2),
                    //         marginVertical:vw(2)
                    //     }}
                    // >
                    //     {/* <Text style={{ textAlign: 'center', fontSize: 30 }}>
                    //         {index}
                    //     </Text> */}
                    //     <Image source={item.img} style={{ alignItems: 'center', width: width / 3, height: width / 2, resizeMode: 'cover', }} />
                    // </View>
                    // )}
                    />
                </GestureHandlerRootView>
            </Modal>
        </View >
    );
}

export default QuibCarousel;
const styles = StyleSheet.create({
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
})