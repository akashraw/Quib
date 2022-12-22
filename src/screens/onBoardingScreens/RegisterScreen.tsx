import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { Eula, StringData } from '../../constants/Constant'
import Icon from 'react-native-vector-icons/FontAwesome'
import ImagePicker from 'react-native-image-crop-picker';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Style } from '../../constants/Styles';

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
                <Icon name='user-circle-o' size={64} color={Style.defaultRed} />
            )
        else return <Image style={{ width: 100, height: 100, resizeMode: 'contain', borderWidth: 3, borderColor: '#222222', borderRadius: 64, }} source={{ uri: Img }} />
    }
    const SelImg = () => {
        if (!selectImg)
            return (
                <TouchableOpacity style={styles.upButton} onPress={lunchImgLib}>
                    <Text style={styles.upTxt}>Choose Image</Text>
                </TouchableOpacity>
            )
        else return (
            <TouchableOpacity style={styles.upButton} onPress={lunchImgLib}>
                <Text style={styles.upTxt}>Change Image</Text>
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
            width: 100,
            height: 100,
            cropping: true,
            includeBase64: true,
        }).then(image => setImg(image.path))
            .catch(e => { console.log(e) });
            setSelectImg(true);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headWrap}>
                <Text style={{ fontSize: 20, textAlign: 'center', color: Style.defaultRed, fontWeight: 'bold' }}>{StringData.registerHead}</Text>
            </View>
            <View >
                <View style={styles.inputField}>
                    <TextInput placeholder='Email'
                        value={Email}
                        placeholderTextColor={Color}
                        onChangeText={(text) => setEmail(text)} style={styles.inputTxt} />
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
                <View style={styles.inputField}>
                    <TextInput placeholder='Display name'
                        value={Name}
                        placeholderTextColor={Color}
                        onChangeText={(text) => setName(text)} style={styles.inputTxt} />
                </View>
                {/* upload */}
                <View style={styles.upPhotoWrap}>
                    <UserIcon />
                    <SelImg />
                </View>
                <View style={styles.scrollWrap}>
                    <ScrollView>
                        <Text style={{ color: '#333333' }}>
                            {Eula.Terms}
                        </Text>
                    </ScrollView>
                </View>
                <View style={{ flexDirection: 'row', marginHorizontal: 16, alignItems: 'center' }}>
                    <CheckBox
                        disabled={false}
                        value={toggleCheckBox}
                        tintColors={{ true: Style.defaultRed }}
                        onValueChange={(newValue) => setToggleCheckBox(newValue)}
                    />
                    <Text style={{ color: '#333333', marginLeft: 20, }}>I Agree</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
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
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#3333',
    },
    headWrap: {
        marginTop: 20,
    },
    inputField: {
        borderBottomWidth: 1,
        borderColor: '#5555',
        marginHorizontal: 16,
    },
    inputTxt: {
        paddingBottom: -2,
        paddingTop: 20,
        color: '#3333'
    },
    upPhotoWrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
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
        width: 100,
        height: 32,
        borderRadius: 16,
    },
    buttonTxt: {
        fontSize: 14,
        color: '#fff'
    },
})