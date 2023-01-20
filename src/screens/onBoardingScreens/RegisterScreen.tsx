import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert, Image, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { Eula, StringData } from '../../constants/Constant'
import Icon from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-crop-picker'
import CheckBox from '@react-native-community/checkbox'
import { Style } from '../../constants/Styles'
import { vw } from 'rxn-units'
import MatIcon from 'react-native-vector-icons/MaterialIcons'
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons'

interface props {
    navigation: any;
}

export default function RegisterScreen(props: props) {

    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [Name, setName] = useState('');
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [Img, setImg] = useState('');
    const [selectImg, setSelectImg] = useState(false);

    const Color = "#5555";

    const UserIcon = () => {
        if (!Img)
            return (
                <TouchableOpacity onPress={lunchImgLib}>
                    <View style={{ borderRadius: vw(20), borderWidth: 5, borderColor: Style.defaultRed, marginBottom: vw(1) }}>
                        {/* <MatComIcon name='account-edit' size={72} color={Style.defaultRed}/> */}
                        <ImageBackground source={require('../../assets/man.png')} imageStyle={{ width: vw(30), height: vw(30) }} style={{ justifyContent: 'center', width: vw(30), height: vw(30), alignItems: 'center', }} >
                            <View style={{ paddingTop: vw(0), backgroundColor:'#00000060', width: vw(30), height: vw(30), borderRadius:vw(20), justifyContent:'center', alignItems:'center'}}>
                                <Icon name='pencil-sharp' size={vw(10)} color={Style.defaultTxtColor} />
                            </View>
                            {/* <MatComIcon name='upload-outline' size={vw(10)} color={Style.defaultRed}/>     */}
                        </ImageBackground>
                        {/* <Icon name='user-circle-o' size={64} color={Style.defaultRed} >
                            <MatIcon name='edit' size={24} color='black' style={{zIndex:2}} />
                        </Icon> */}
                    </View>
                    {/* <Text style={{fontSize:12, color:Style.defaultLightGrey, textAlign:'center', fontWeight:'500'}}>Upload a profile picture</Text> */}
                </TouchableOpacity>
            )
        else return (
            <TouchableOpacity onPress={lunchImgLib}>
                <Image style={{ width: 100, height: 100, resizeMode: 'contain', borderWidth: 3, borderColor: Style.defaultRed, borderRadius: 64, }} source={{ uri: Img }} />
            </TouchableOpacity>
        )
    }

    const Register = () => {
        // if (!Email && !Password && !ConfirmPassword && !Name && !Img && toggleCheckBox)
        //     return console.log('please fill the form');
        // else console.log('correct')
        return null

    }

    const lunchImgLib = () => {
        ImagePicker.openPicker({
            width: 200,
            height: 200,
            cropping: true,
            includeBase64: true,
        }).then(image => setImg(image.path))
            .catch(e => { console.log(e) });
        setSelectImg(true);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headWrap}>
                <Image
                    style={{ width: vw(35), height: vw(20), justifyContent: 'center', alignSelf: 'center' }}
                    resizeMode={'contain'}
                    source={require('../../assets/logo.png')}
                />
                <Text style={{ fontSize: 28, textAlign: 'center', color: Style.defaultRed, fontWeight: 'bold', paddingTop: vw(2) }}>{StringData.registerHead}</Text>
            </View>
            {/* upload */}
            <View style={styles.upPhotoWrap}>
                <UserIcon />
                {/* <SelImg /> */}
            </View>
            <View >
                <View style={styles.inputField}>
                    <TextInput placeholder='Email'
                        value={Email}
                        placeholderTextColor={Color}
                        onChangeText={(text) => setEmail(text)} style={styles.inputTxt} />
                </View>
                <View style={styles.inputField}>
                    <TextInput placeholder='Display name'
                        value={Name}
                        placeholderTextColor={Color}
                        onChangeText={(text) => setName(text)} style={styles.inputTxt} />
                </View>
                <View style={styles.inputField}>
                    <TextInput placeholder='First name'
                        value={Name}
                        placeholderTextColor={Color}
                        onChangeText={(text) => setName(text)} style={styles.inputTxt} />
                </View>
                <View style={styles.inputField}>
                    <TextInput placeholder='Last name'
                        value={Name}
                        placeholderTextColor={Color}
                        onChangeText={(text) => setName(text)} style={styles.inputTxt} />
                </View>
                <View style={styles.inputField}>
                    <TextInput placeholder='Password'
                        value={Password}
                        placeholderTextColor={Color}
                        onChangeText={(text) => setPassword(text)} style={styles.inputTxt} />
                </View>
                <View style={styles.inputField}>
                    <TextInput placeholder='Confirm password'
                        value={ConfirmPassword}
                        placeholderTextColor={Color}
                        onChangeText={(text) => setConfirmPassword(text)} style={styles.inputTxt} />
                </View>
                {/* <View style={styles.scrollWrap}>
                    <ScrollView>
                        <Text style={{ color: '#333333' }}>
                            {Eula.Terms}
                        </Text>
                    </ScrollView>
                </View> */}
                <View style={{ flexDirection: 'row', marginHorizontal: 16, alignItems: 'center', justifyContent: 'center', marginVertical: vw(2) }}>
                    <CheckBox
                        disabled={false}
                        value={toggleCheckBox}
                        tintColors={{ true: Style.defaultRed }}
                        onValueChange={(newValue) => setToggleCheckBox(newValue)}
                    />
                    <Text style={{ color: '#333333', marginLeft: vw(2), fontWeight: '500' }}>{StringData.agreeEula}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: vw(2) }}>
                    <TouchableOpacity activeOpacity={.4} onPress={Register}>
                        <View style={styles.button}>
                            <Text style={styles.buttonTxt}>Register</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Style.quibBackColor,
        // marginHorizontal: 16,
        // marginVertical: 20,
        // borderWidth: 1,
        // borderColor: '#3333',
    },
    headWrap: {
        marginTop: vw(0),
    },
    inputField: {
        marginVertical: vw(2),
        borderWidth: 1,
        borderColor: '#5555',
        marginHorizontal: vw(5),
        justifyContent: 'center',
        borderRadius: vw(2),
    },
    inputTxt: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: vw(4),
        fontSize: 16,
        // paddingBottom: -2,
        // paddingTop: 20,
        color: Style.defaultTxtColor
    },
    upPhotoWrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: vw(2),
    },
    upButton: {
        width: 140,
        height: 30,
        backgroundColor: "#990000",
        borderRadius: 10,
    },
    upTxt: {
        textAlign: 'center',
        paddingTop: 4,
        color: '#fff',
    },
    scrollWrap: {
        marginVertical: 20,
        marginHorizontal: 16,
        height: 200,
        backgroundColor: '#dcdcdc',
        padding: 15,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Style.defaultRed,
        width: vw(30),
        height: vw(10),
        borderRadius: vw(2),
        marginBottom: 10,
    },
    buttonTxt: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold'
    },
})