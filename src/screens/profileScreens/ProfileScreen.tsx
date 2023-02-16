import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Style } from '../../constants/Styles'
import { vh, vw } from 'rxn-units'
import QuibButton from '../../components/QuibButton'
import ProfileScreenTabViews from './ProfileScreenTabViews'
import { Shadow } from 'react-native-shadow-2'
import { getUserById } from '../../services/QuibAPIs'
import { useNavigation } from '@react-navigation/core'
import FastImage from 'react-native-fast-image'
import { API, image256API } from '../../constants/Api'

interface props {
    navigation: any,
}

export default function ProfileScreen({ navigation }: props) {
    const navig = useNavigation();
    const [User, setUser] = useState<any>([])
    useEffect(() => {
        Promise.resolve(
            getUserById({ userId: '' }).then((res) => setUser(res))
        ).then(() => console.log(vw(25)))

    }, [])
    return (
        <SafeAreaView style={{}}>
            <View style={{ paddingVertical: vw(3), backgroundColor: Style.quibBackColor }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3) }}>
                    <View style={{ flex: 1, }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: vw(2) }}>
                            <View style={{ paddingHorizontal: vw(2) }}>
                                {/* <Shadow distance={5}> */}
                                    <FastImage
                                        source={{
                                            uri: `${image256API}${User.avatarBase256ImagePath}`,
                                            priority: FastImage.priority.high,
                                            cache: FastImage.cacheControl.immutable,
                                        }}
                                        resizeMode="contain"
                                        style={{ width: vw(25), height: vw(25), borderRadius: vw(15) }}
                                    />
                                {/* </Shadow> */}
                            </View>
                            <View style={{ alignSelf: 'center', justifyContent: 'center', paddingHorizontal: vw(2) }}>
                                <View style={{ paddingBottom: vw(1) }}>
                                    <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 16 }}>{User.userName}</Text>
                                </View>
                                <View style={{ paddingBottom: vw(1) }}>
                                    <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 14 }}>{User.firstName} {User.lastName}</Text>
                                </View>
                                <View style={{ paddingBottom: vw(0) }}>
                                    <Text style={{ color: Style.defaultTxtColor, fontWeight: '500', fontSize: 12, marginRight: vw(2), width: vw(60), }} numberOfLines={3} >{User.about}</Text>
                                </View>
                            </View>
                        </View>
                        {/* <View style={{ flex: 1, flexDirection: 'row', paddingBottom: vw(5),  alignSelf:'center' }}>
                            <View style={{ padding: vw(2) }}>
                                <QuibButton text='Edit Profile' onPress={'Join'} viewStyle={styles.button} textStyle={styles.buttonTxt as any} />
                            </View>
                            <View style={{ padding: vw(2) }}>
                                <QuibButton text='Log Out' onPress={'Join'} viewStyle={styles.button} textStyle={styles.buttonTxt as any} />
                            </View>
                        </View> */}
                    </View>
                </View>
                <View style={{ height: vh(100), }}>
                    <ProfileScreenTabViews navi={navigation} followerId={User.id} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Style.defaultRed,
        width: vw(20),
        height: vw(6),
        borderRadius: vw(2),
        // marginBottom: 10,
    },
    buttonTxt: {
        textAlign: 'center',
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold'
    },
    pagerView: {
        width: vw(100),
        height: vw(100)
    }
})