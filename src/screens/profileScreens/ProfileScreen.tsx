import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import React from 'react'
import { Style } from '../../constants/Styles'
import PagerView from 'react-native-pager-view'
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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={require('../../assets/Movie/arrival.jpeg')}
                            style={{ width: vw(20), height: vw(25), borderRadius: vw(1) }}
                        />
                        <View style={{ paddingLeft: vw(2), paddingBottom: vw(10) }}>
                            <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 14 }}>User Name</Text>
                        </View>
                    </View>

                    <View >
                        <View style={{ padding: vw(2) }}>
                            <OnLandingButton text='Edit Profile' onPress={'Join'} viewStyle={styles.button} textStyle={styles.buttonTxt as any} />
                        </View>
                        <View style={{ padding: vw(2) }}>
                            <OnLandingButton text='Log Out' onPress={'Join'} viewStyle={styles.button} textStyle={styles.buttonTxt as any} />
                        </View>
                    </View>
                </View>
                <View style={{height:vh(100), marginHorizontal:vw(3)}}>
                    <ProfileScreenTabViews/>
                </View>
                {/* <PagerView style={styles.pagerView} initialPage={0} >
                    <View key={1} style={{ backgroundColor: Style.quibHeader, width: vw(95), height: vw(10), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3), alignSelf: 'center', alignItems: 'center', marginTop: vw(3), paddingLeft: vw(3) }}>
                        <Text style={{ color: Style.defaultRed, fontSize: 18, fontWeight: 'bold' }}>Quibbed</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={{ color: Style.defaultTxtColor, fontSize: 18, fontWeight: 'normal' }}>0</Text>
                            <Icon name='chevron-right' color={Style.defaultTxtColor} size={18} style={{ paddingTop: vw(.6), paddingLeft: vw(4) }} />
                        </View>
                    </View>
                    <View key={2} style={{ backgroundColor: Style.quibHeader, width: vw(95), height: vw(10), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3), alignSelf: 'center', alignItems: 'center', marginTop: vw(3), paddingLeft: vw(3) }}>
                        <Text style={{ color: Style.defaultRed, fontSize: 18, fontWeight: 'bold' }}>Followers</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={{ color: Style.defaultTxtColor, fontSize: 18, fontWeight: 'normal' }}>0</Text>
                            <Icon name='chevron-right' color={Style.defaultTxtColor} size={18} style={{ paddingTop: vw(.6), paddingLeft: vw(4) }} />
                        </View>
                    </View>
                    <View key={3} style={{ backgroundColor: Style.quibHeader, width: vw(95), height: vw(10), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3), alignSelf: 'center', alignItems: 'center', marginTop: vw(3), paddingLeft: vw(3) }}>
                        <Text style={{ color: Style.defaultRed, fontSize: 18, fontWeight: 'bold' }}>Folowing</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                            <Text style={{ color: Style.defaultTxtColor, fontSize: 18, fontWeight: 'normal', textAlign: 'center' }}>0</Text>
                            <Icon name='chevron-right' color={Style.defaultTxtColor} size={18} style={{ paddingTop: vw(.6), paddingLeft: vw(4) }} />
                        </View>
                    </View>
                </PagerView> */}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#990000',
        width: 90,
        height: 24,
        borderRadius: 16,
        justifyContent: 'center'
        // paddingTop: 6,
        // alignSelf:'center',
        // textAlign:'center'
    },
    buttonTxt: {
        // textAlign: 'center',
        fontSize: 14,
        color: '#fff'
    },
    pagerView: {
        width: vw(100),
        height: vw(100)
    }
})