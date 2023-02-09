import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Style } from '../../constants/Styles'
import { vh, vw } from 'rxn-units'
import OtherProfileScreenTabViews from './OtherProfileScreensTabViews'
import { Shadow } from 'react-native-shadow-2'
import { FollowUser, getOtherUserById } from '../../services/QuibAPIs'

interface props {
    navigation: any,
    route: any,
}

export default function OtherProfileScreen({ navigation, route }: props) {
    const [User, setUser] = useState<any>([]);
    const [IsFollow, setIsFollow] = useState('Follow')
    const userId = route.params;
    useEffect(() => {
        Promise.resolve(
            getOtherUserById({ userId: userId.userId }).then((res) => setUser(res))

        )
    }, [])
    const followUser = () => {
        Promise.resolve(
            FollowUser({FolloweeId:User.id, FollowerId:'a5a17ac9-d977-41b7-811c-05c4a6f62c4c'})
        ).then(()=>setIsFollow('Following'))
    }
    return (
        <SafeAreaView style={{}}>
            <View style={{ paddingVertical: vw(3), backgroundColor: Style.quibBackColor }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3) }}>
                    <View style={{ flex: 1, }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: vw(2) }}>
                            <View style={{ paddingHorizontal: vw(2) }}>
                                <Shadow distance={5}>
                                    <Image
                                        source={require('../../assets/Movie/arrival.jpeg')}
                                        style={{ width: vw(25), height: vw(25), borderRadius: vw(15) }}
                                    />
                                </Shadow>
                            </View>
                            <View style={{ alignSelf: 'center', justifyContent: 'center', paddingHorizontal: vw(2) }}>
                                <View style={{ paddingBottom: vw(1) }}>
                                    <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 16 }}>{User.userName}</Text>
                                </View>
                                <View style={{ paddingBottom: vw(1) }}>
                                    <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 14 }}>{User.firstName} {User.lastName}</Text>
                                </View>
                                <View style={{ paddingBottom: vw(0) }}>
                                    <Text style={{ color: Style.defaultTxtColor, fontWeight: '500', fontSize: 12, marginRight: vw(2), width: vw(60), }} numberOfLines={3} >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Leo in vitae turpis massa sed elementum tempus.</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', paddingBottom: vw(5), alignSelf: 'center' }}>
                            <View style={{ padding: vw(2) }}>
                                <TouchableOpacity activeOpacity={.4} onPress={followUser}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonTxt}>{IsFollow}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {/* <View style={{ padding: vw(2) }}>
                                <QuibButton text='Log Out' onPress={'Join'} viewStyle={styles.button} textStyle={styles.buttonTxt as any} />
                            </View> */}
                        </View>
                    </View>
                </View>
                <View style={{ height: vh(100), }}>
                    <OtherProfileScreenTabViews />
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

