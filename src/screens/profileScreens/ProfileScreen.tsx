import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Style } from '../../constants/Styles'
import { vh, vw } from 'rxn-units'
import OnLandingButton from '../../components/OnLandingButton'
import ProfileScreenTabViews from './ProfileScreenTabViews'

interface props {
    navigation: any,
}

export default function ProfileScreen({ navigation }: props) {
    return (
        <SafeAreaView style={{}}>
            <View style={{ paddingVertical: vw(3), backgroundColor: '#E0DECA' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3) }}>
                    <View style={{ flex: 1, }}>
                        <View style={{ flexDirection:'row', alignItems:'center', paddingTop:vw(2)}}>
                            <View style={{  paddingHorizontal:vw(2) }}>
                                <Image
                                    source={require('../../assets/Movie/arrival.jpeg')}
                                    style={{ width: vw(25), height: vw(25), borderRadius: vw(15) }}
                                />
                            </View>
                            <View style={{  alignSelf: 'center', justifyContent:'center', paddingHorizontal:vw(2) }}>
                                <View style={{ paddingBottom: vw(1) }}>
                                    <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 16 }}>UserName</Text>
                                </View>
                                <View style={{ paddingBottom: vw(1) }}>
                                    <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 14 }}>User Name</Text>
                                </View>
                                <View style={{ paddingBottom: vw(0) }}>
                                    <Text style={{ color: Style.defaultTxtColor, fontWeight: '500', fontSize: 12, marginRight:vw(2), width:vw(60), }} numberOfLines={3} >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Leo in vitae turpis massa sed elementum tempus.</Text>
                                </View>
                            </View>
                        </View>
                        {/* <View style={{ flex: 1, flexDirection: 'row', paddingBottom: vw(5),  alignSelf:'center' }}>
                            <View style={{ padding: vw(2) }}>
                                <OnLandingButton text='Edit Profile' onPress={'Join'} viewStyle={styles.button} textStyle={styles.buttonTxt as any} />
                            </View>
                            <View style={{ padding: vw(2) }}>
                                <OnLandingButton text='Log Out' onPress={'Join'} viewStyle={styles.button} textStyle={styles.buttonTxt as any} />
                            </View>
                        </View> */}
                    </View>
                </View>
                <View style={{ height: vh(100), }}>
                    <ProfileScreenTabViews />
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