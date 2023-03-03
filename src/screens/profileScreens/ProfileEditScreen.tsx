import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert, Image, ImageBackground, Platform } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-crop-picker'
import { Style } from '../../constants/Styles'
import { vw } from 'rxn-units'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AuthContext } from '../../Auth'
import { getUserById, getUserProfile } from '../../services/QuibAPIs'
import FastImage from 'react-native-fast-image'
import { image256API, UpdateUserAPI } from '../../constants/Api'

interface props {
    navigation: any;
}

export default function ProfileEditScreen(props: props) {
    const Auth = React.useContext(AuthContext);
    // const [Email, setEmail] = useState('');
    // const [Password, setPassword] = useState('');
    // const [ConfirmPassword, setConfirmPassword] = useState('');
    const [User, setUser] = useState<any>([]);
    const [userName, setUserName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [Img, setImg] = useState<any>([]);
    const [Password, setPassword] = useState('')
    const [Bio, setBio] = useState('');
    const [Eye, setEye] = useState('eye-off');
    const [SeePassword, setSeePassword] = useState(true)

    //==============================================================useEffect======================================================================\\
    React.useEffect(() => {
        Promise.resolve(getUserById({ userId: Auth.userName }).then((res) => {
            setUserName(res.userName); setFirstName(res.firstName); setLastName(res.lastName); setBio(res.about); setUser(res);
        }))
    }, [])
    //**********************************************************************************/
    const togglePass = () => {
        if (!Password) {
            setEye('eye-off');
            return setSeePassword(!SeePassword);
        } else {
            setEye('eye');
            return setSeePassword(!SeePassword);
        }
    }

    //*******************************************//
    const Color = "#5555";
    const Update = async () => {
        let pathParts = Img.path.split('/');
        // console.log('name: ' + pathParts[pathParts.length - 1] + ' type: ' + Img.mime + ' uri: ' + Img.path)

        console.log(Img)
        var data = new FormData();
        data.append('Id', User.id);
        data.append('FirstName', firstName);
        data.append('LastName', lastName);
        data.append('PasswordHash', Password);
        data.append('AvatarBase256ImagePath', {
            uri: Img.data,
            type: Img.mime,
            name: pathParts[pathParts.length - 1]
        });
        data.append('UserName', userName);
        data.append('About', Bio)
        const headerOption = {
            method: 'POST',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'multipart/form-data'
            },
            body: data,
        }
        try {
            let response = await fetch(`${UpdateUserAPI}`, headerOption);
            let json = await response.json();
            console.log(json)
            if (response.status == 200) {
                return props.navigation.goBack();
            }
        } catch (error) {
            console.log(error);
        }

    }
    // const Update = async () => {
    //     const headerOption = {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             "id": User.id,
    //             "userName": userName,
    //             "firstName": firstName,
    //             "lastName": lastName,
    //             "about": Bio,
    //             "passwordHash": null,
    //             "avatarBase256ImagePath": Img
    //         })
    //     }
    //     try {
    //         await fetch(`${UpdateUserAPI}`, headerOption);
    //         // console.log(response.json());
    //     } catch (error) {
    //         console.log('isUserFollowed Api call: ' + error)
    //     }
    // }

    const UserIcon = () => {
        if (Img.path == null)
            return (
                <TouchableOpacity onPress={launchImgLib}>
                    <View style={{ borderRadius: vw(20), borderWidth: 0, borderColor: Style.defaultRed, marginBottom: vw(1) }}>
                        {/* <MatComIcon name='account-edit' size={72} color={Style.defaultRed}/> */}
                        <FastImage
                            source={{
                                uri: `${image256API}${User.avatarBase256ImagePath}`,
                                priority: FastImage.priority.high,
                                cache: FastImage.cacheControl.immutable,
                            }}
                            resizeMode="contain"
                            style={{ width: vw(30), height: vw(30), borderRadius: vw(15) }}
                        />
                    </View>
                </TouchableOpacity>
            )
        else return (
            <TouchableOpacity onPress={launchImgLib}>
                <Image style={{ width: 100, height: 100, resizeMode: 'contain', borderWidth: 3, borderColor: Style.defaultRed, borderRadius: 64, }} source={{ uri: Img.path }} />
            </TouchableOpacity>
        )
    }


    const launchImgLib = () => {
        ImagePicker.openPicker({
            width: 256,
            height: 256,
            cropping: true,
            includeBase64: false,
        }).then(image => setImg(image))
            .catch(e => { console.log(e) });
        // setSelectImg(true);
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView enableOnAndroid={true} >
                <View style={styles.upPhotoWrap}>
                    <UserIcon />
                </View>
                <View >
                    <View style={styles.inputField}>
                        <TextInput placeholder={userName}
                            value={userName}
                            placeholderTextColor={Style.defaultTxtColor}
                            onChangeText={(text) => setUserName(text)} style={styles.inputTxt} />
                    </View>
                    <View style={styles.inputField}>
                        <TextInput placeholder={firstName}
                            value={firstName}
                            placeholderTextColor={Style.defaultTxtColor}
                            onChangeText={(text) => setFirstName(text)} style={styles.inputTxt} />
                    </View>
                    <View style={styles.inputField}>
                        <TextInput placeholder={lastName}
                            value={lastName}
                            placeholderTextColor={Style.defaultTxtColor}
                            onChangeText={(text) => setLastName(text)} style={styles.inputTxt} />
                    </View>
                    <View style={styles.inputField}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput placeholder='Password'
                                value={Password}
                                placeholderTextColor={Color}
                                secureTextEntry={SeePassword}
                                onChangeText={(text) => setPassword(text)} style={styles.inputTxt} />
                            <TouchableOpacity onPress={togglePass} >
                                <Icon name={Eye} size={vw(6)} color={Style.defaultRed} style={{ marginRight: vw(4) }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.inputField, { height: vw(30), justifyContent: 'flex-start' }]}>
                        <TextInput placeholder={Bio}
                            value={Bio}
                            placeholderTextColor={Style.defaultTxtColor}
                            onChangeText={(text) => setBio(text)} style={styles.inputTxt} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: vw(5) }}>
                        <TouchableOpacity activeOpacity={.4} onPress={() => Update()}>
                            <View style={styles.button}>
                                <Text style={styles.buttonTxt}>Update</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            {/* upload */}
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Style.quibBackColor,
    },
    headWrap: {
        marginTop: vw(2),
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
        color: Style.defaultTxtColor
    },
    upPhotoWrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: vw(3),
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