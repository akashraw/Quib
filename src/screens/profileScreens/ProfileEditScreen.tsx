import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert, Image, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-crop-picker'
import { Style } from '../../constants/Styles'
import { vw } from 'rxn-units'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AuthContext } from '../../Auth'
import { getUserById, getUserProfile } from '../../services/QuibAPIs'
import FastImage from 'react-native-fast-image'
import { image256API } from '../../constants/Api'

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
    const [Img, setImg] = useState('');
    const [Bio, setBio] = useState('');

    //==============================================================useEffect======================================================================\\
    React.useEffect(() => {
        Promise.resolve(getUserById({ userId: Auth.userName }).then((res) => setUser(res)))
        console.log(User.userName)
    }, [])

    //*******************************************//
    const Color = "#5555";

    const UserIcon = () => {
        if (!Img)
            return (
                <TouchableOpacity onPress={launchImgLib}>
                    <View style={{ borderRadius: vw(20), borderWidth:0, borderColor: Style.defaultRed, marginBottom: vw(1) }}>
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
                <Image style={{ width: 100, height: 100, resizeMode: 'contain', borderWidth: 3, borderColor: Style.defaultRed, borderRadius: 64, }} source={{ uri: Img }} />
            </TouchableOpacity>
        )
    }


    const launchImgLib = () => {
        ImagePicker.openPicker({
            width: 200,
            height: 200,
            cropping: true,
            includeBase64: true,
        }).then(image => setImg(image.path))
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
                        <TextInput placeholder={User.userName}
                            value={userName}
                            placeholderTextColor={Style.defaultTxtColor}
                            onChangeText={(text) => setUserName(text)} style={styles.inputTxt} />
                    </View>
                    <View style={styles.inputField}>
                        <TextInput placeholder={User.firstName}
                            value={firstName}
                            placeholderTextColor={Style.defaultTxtColor}
                            onChangeText={(text) => setFirstName(text)} style={styles.inputTxt} />
                    </View>
                    <View style={styles.inputField}>
                        <TextInput placeholder={User.lastName}
                            value={lastName}
                            placeholderTextColor={Style.defaultTxtColor}
                            onChangeText={(text) => setLastName(text)} style={styles.inputTxt} />
                    </View>
                    <View style={[styles.inputField, { height: vw(30), justifyContent: 'flex-start' }]}>
                        <TextInput placeholder={User.about}
                            value={Bio}
                            placeholderTextColor={Style.defaultTxtColor}
                            onChangeText={(text) => setBio(text)} style={styles.inputTxt} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: vw(5) }}>
                        <TouchableOpacity activeOpacity={.4} onPress={() => props.navigation.goBack()}>
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