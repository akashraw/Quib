import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import QuibButton from '../../components/QuibButton'
import { vw } from 'rxn-units'
import { Style } from '../../constants/Styles'
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/Ionicons'
import { Shadow } from 'react-native-shadow-2'
export default function SetttingScreen() {
    return (
        <SafeAreaView style={{ flex: 1, width: vw(100), alignSelf: 'center', paddingVertical: vw(5), backgroundColor: '#E0DECA' }}>
            {/* Header Starts */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: vw(90), marginBottom: vw(10), paddingHorizontal: vw(5) }}>
                <View style={{ flexDirection: 'row', }}>
                    <Shadow distance={5}>
                        <Image
                            style={{ height: vw(25), width: vw(25), borderRadius: vw(13) }}
                            source={require('../../assets/Movie/arrival.jpeg')}
                        />
                    </Shadow>
                    <View style={{ alignItems: 'center', height: vw(20), paddingLeft: vw(3), justifyContent: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: '500', paddingBottom: vw(2), color: Style.defaultGrey }}>@akashraw</Text>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: Style.defaultLightGrey }}>Akash Rawat</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={undefined} style={{ alignItems: 'center', height: vw(20), paddingLeft: vw(0), paddingTop: vw(4) }}>
                    <Icon style={{ paddingRight: vw(2) }} name='create-outline' size={16} color={Style.defaultRed} />
                </TouchableOpacity>
            </View>
            {/* Header ends */}

            {/* Setting List Starts here */}
            <View style={{ justifyContent: 'center', alignItems: 'center', width: vw(90), marginHorizontal: vw(5) }}>
                <View style={{
                    flexDirection: 'row', width: vw(85), borderBottomColor: '#B2B2B2',
                    borderBottomWidth: StyleSheet.hairlineWidth, height: vw(15), alignItems: 'center',
                }}>
                    <TouchableOpacity style={{ flexDirection: 'row', width: vw(85), height: vw(15), alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={styles.settingTab}>
                            <Icon name='book-outline' size={vw(6)} color={Style.defaultRed} />
                            <Text style={styles.settingTxt}>Terms and Conditions</Text>
                        </View>
                        <Icon name='chevron-forward-outline' size={vw(6)} color={Style.defaultRed} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    flexDirection: 'row', width: vw(85), borderBottomColor: '#B2B2B2',
                    borderBottomWidth: StyleSheet.hairlineWidth, height: vw(15), alignItems: 'center'
                }}>
                    <TouchableOpacity style={{ flexDirection: 'row', width: vw(85), height: vw(15), alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={styles.settingTab}>
                            <Icon name='document-text-outline' size={vw(6)} color={Style.defaultRed} />
                            <Text style={styles.settingTxt}>Privacy Policy</Text>
                        </View>
                        <Icon name='chevron-forward-outline' size={vw(6)} color={Style.defaultRed} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    flexDirection: 'row', width: vw(85), borderBottomColor: '#B2B2B2',
                    borderBottomWidth: StyleSheet.hairlineWidth, height: vw(15), alignItems: 'center'
                }}>
                    <TouchableOpacity style={{ flexDirection: 'row', width: vw(85), height: vw(15), alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={styles.settingTab}>
                            <Icon name='mail-outline' size={vw(6)} color={Style.defaultRed} />
                            <Text style={styles.settingTxt}>Contact Us</Text>
                        </View>
                        <Icon name='chevron-forward-outline' size={vw(6)} color={Style.defaultRed} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    flexDirection: 'row', width: vw(85), height: vw(15), alignItems: 'center', borderBottomColor: '#B2B2B2',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}>
                    <TouchableOpacity style={{ flexDirection: 'row', width: vw(85), height: vw(15), alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={styles.settingTab}>
                            <Icon name='information-circle-outline' size={vw(6)} color={Style.defaultRed} />
                            <Text style={styles.settingTxt}>About</Text>
                        </View>
                        <Icon name='chevron-forward-outline' size={vw(6)} color={Style.defaultRed} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    flexDirection: 'row', width: vw(85), borderBottomColor: '#B2B2B2',
                    borderBottomWidth: StyleSheet.hairlineWidth, height: vw(15), alignItems: 'center'
                }}>
                    <TouchableOpacity style={{ flexDirection: 'row', width: vw(85), height: vw(15), alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={styles.settingTab}>
                            <Icon name='log-out-outline' size={vw(6)} color={Style.defaultRed}  />
                            <Text style={styles.settingTxt}>Log Out</Text>
                        </View>
                        <Icon name='chevron-forward-outline' size={vw(6)} color={Style.defaultRed} />

                    </TouchableOpacity>
                </View>

                {/* <QuibButton text={'Notifications Settings'} onPress={undefined} viewStyle={styles.viewStyle} textStyle={styles.txtStyle} />
                <QuibButton text={'Terms and Conditions'} onPress={undefined} viewStyle={styles.viewStyle} textStyle={styles.txtStyle} />
                <QuibButton text={'Privacy Policy'} onPress={undefined} viewStyle={styles.viewStyle} textStyle={styles.txtStyle} />
                <QuibButton text={'Contact Us'} onPress={undefined} viewStyle={styles.viewStyle} textStyle={styles.txtStyle} />
                <QuibButton text={'About'} onPress={undefined} viewStyle={styles.viewStyle} textStyle={styles.txtStyle} />
                <QuibButton text={'Logout'} onPress={undefined} viewStyle={styles.viewStyle} textStyle={styles.txtStyle} /> */}
            </View>
            {/* Settting list ends here */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    viewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Style.defaultRed,
        width: vw(50),
        height: vw(10),
        borderRadius: vw(2),
        marginBottom: 10,
    },
    txtStyle: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold'
    },
    settingTxt: {
        fontSize: 14,
        fontWeight: '500',
        paddingLeft: vw(6),
        paddingBottom: vw(0),
        color: Style.defaultLightGrey,
    },
    settingTab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center'
    }
})