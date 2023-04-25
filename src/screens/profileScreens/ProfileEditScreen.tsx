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
    const styles = Auth.DeviceType? stylesTab : style;
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
                'Content-Type': 'application/form-data'
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


    const UserIcon = () => {
        console.log(User.avatarBase256ImagePath)
        
        if (Img.path == null && User.avatarBase256ImagePath!=null)
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
                            style={{ width: vw(20), height: vw(20), borderRadius: vw(10) }}
                        />
                    </View>
                </TouchableOpacity>
            )
        else return (
            <TouchableOpacity onPress={launchImgLib}>
                <Image style={{ width: vw(20), height: vw(20), resizeMode: 'contain', borderWidth: 3, borderColor: Style.defaultRed, borderRadius: vw(10), }} source={{ uri: Img.path }} />
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
                                <Icon name={Eye} size={Auth.DeviceType? vw(4):vw(6)} color={Style.defaultRed} style={{ marginRight: vw(4) }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[...[styles.inputField], { justifyContent: 'flex-start', alignItems:'flex-start', height:vw(15), flexDirection:'row',  }]}>
                        <TextInput placeholder={Bio}
                            value={Bio}
                            multiline={true}
                            placeholderTextColor={Style.defaultTxtColor}
                            onChangeText={(text) => setBio(text)} style={styles.inputTxtBio} />
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

const style = StyleSheet.create({
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
        fontSize: vw(4.1),
        color: Style.defaultTxtColor,
        flex:1,
    },
    inputTxtBio:{
        flex:1, 
        height:vw(15),
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: vw(4),
        fontSize: vw(4.1),
        color: Style.defaultTxtColor
    },
    upPhotoWrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: vw(3),
    },
    upButton: {
        width: vw(36),
        height: vw(7.5),
        backgroundColor: "#990000",
        borderRadius: vw(2.5),
    },
    upTxt: {
        textAlign: 'center',
        paddingTop: vw(1),
        color: '#fff',
    },
    scrollWrap: {
        marginVertical: vw(52),
        marginHorizontal: vw(4.1),
        height: vw(51.2),
        backgroundColor: '#dcdcdc',
        padding: vw(3.8),
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Style.defaultRed,
        width: vw(30),
        height: vw(10),
        borderRadius: vw(2),
        marginBottom: vw(2.5),
    },
    buttonTxt: {
        textAlign: 'center',
        fontSize: vw(4.1),
        color: '#fff',
        fontWeight: 'bold'
    },
})

const stylesTab = StyleSheet.create({
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
        paddingVertical:vw(1),
        borderRadius: vw(2),
    },
    inputTxt: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: vw(3),
        fontSize: vw(3),
        color: Style.defaultTxtColor
    },
    inputTxtBio:{
        flex:1, 
        height:vw(15),
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: vw(3),
        fontSize: vw(3),
        color: Style.defaultTxtColor,
        textAlignVertical:'top'
    },
    upPhotoWrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: vw(3),
    },
    upButton: {
        width: vw(36),
        height: vw(7.5),
        backgroundColor: "#990000",
        borderRadius: vw(2.5),
    },
    upTxt: {
        textAlign: 'center',
        paddingTop: vw(1),
        color: '#fff',
    },
    scrollWrap: {
        marginVertical: vw(52),
        marginHorizontal: vw(4.1),
        height: vw(51.2),
        backgroundColor: '#dcdcdc',
        padding: vw(3.8),
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Style.defaultRed,
        width: vw(20),
        height: vw(6),
        borderRadius: vw(2),
        marginBottom: vw(2.5),
    },
    buttonTxt: {
        textAlign: 'center',
        fontSize: vw(3),
        color: '#fff',
        fontWeight: 'bold'
    },
})