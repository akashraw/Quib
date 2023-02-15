import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert, Image, ImageBackground, KeyboardAvoidingView, Platform, ActivityIndicator, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Eula, StringData } from '../../constants/Constant'
import Icon from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-crop-picker'
import CheckBox from '@react-native-community/checkbox'
import { Style } from '../../constants/Styles'
import { vh, vw } from 'rxn-units'
import MatIcon from 'react-native-vector-icons/MaterialIcons'
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Controller, useForm } from 'react-hook-form'
import DropShadow from 'react-native-drop-shadow'
import { API, RegisterAPI } from '../../constants/Api'
import Modal from "react-native-modal";

const deviceHeight = Dimensions.get('screen').height;

interface props {
    navigation: any;
}

export default function RegisterScreen(props: props) {

    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState(true);
    const [ConfirmPassword, setConfirmPassword] = useState(true);
    const [Name, setName] = useState('eye-off');
    const [CName, setCName] = useState('eye-off');
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [Img, setImg] = useState('');
    const [Activity, setActivity] = useState(false);
    const [selectImg, setSelectImg] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        getValues
    } = useForm({ mode: 'onBlur' })

    const onSubmit = (data: any) => {
        setActivity(true);
        if (isValid == true) {
            console.log(data)
            return Register(data);

        }
        else return (
            setActivity(false)
        )


    };
    const Color = "#5555";

    const UserIcon = () => {
        if (!Img)
            return (
                <TouchableOpacity onPress={lunchImgLib}>
                    <View style={{ borderColor: Style.defaultRed, marginBottom: vw(1) }}>
                        {/* <MatComIcon name='account-edit' size={72} color={Style.defaultRed}/> */}
                        <Image source={require('../../assets/profile.png')} style={{ width: vw(25), height: vw(25), alignSelf: 'center', }} />
                        {/* <View style={{ paddingTop: vw(0), backgroundColor: '#00000060', width: vw(25), height: vw(25), borderRadius: vw(20), justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name='pencil-sharp' size={vw(10)} color={Style.defaultTxtColor} />
                            </View> */}
                        {/* <MatComIcon name='upload-outline' size={vw(10)} color={Style.defaultRed}/>     */}
                        {/* </ImageBackground> */}
                        {/* <Icon name='user-circle-o' size={64} color={Style.defaultRed} >
                            <MatIcon name='edit' size={24} color='black' style={{zIndex:2}} />
                        </Icon> */}
                    </View>
                    {/* <Text style={{fontSize:12, color:Style.defaultLightGrey, textAlign:'center', fontWeight:'500'}}>Upload a profile picture</Text> */}
                </TouchableOpacity>
            )
        else return (
            <TouchableOpacity onPress={lunchImgLib}>
                <DropShadow
                    style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: .5,
                        shadowRadius: vw(1.5),
                    }}
                >
                    <Image style={{ width: vw(25), height: vw(25), resizeMode: 'contain', borderWidth: vw(.5), borderColor: Style.defaultRed, borderRadius: vw(13), }} source={{ uri: Img }} />
                </DropShadow>
            </TouchableOpacity>
        )
    }

    const Register = async (formData: any) => {
        var data = new FormData();
        data.append('Email', formData.Email);
        data.append('FirstName', formData.FirstName);
        data.append('LastName', formData.LastName);
        data.append('Password', formData.Password);
        data.append('AvatarBase256ImagePath', Img);
        data.append('Username', formData.DisplayName);
        const headerOption = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: data,
        }
        try {
            let response = await fetch(`${RegisterAPI}`, headerOption);
            if (response.status == 200) {
                return props.navigation.navigate('Login')
            }
        } catch (error) {
            console.log(error);
        }

    }

    const lunchImgLib = () => {
        ImagePicker.openPicker({
            width: 256,
            height: 256,
            cropping: true,
            includeBase64: true,
        }).then(image => setImg(image.path))
            .catch(e => { console.log(e) });
        setSelectImg(true);
    }

    const togglePass = () => {
        if (!Password) {
            setName('eye-off');
            return setPassword(!Password);
        } else {
            setName('eye');
            return setPassword(!Password);
        }
    }
    const toggleConfirmPass = () => {
        if (!ConfirmPassword) {
            setCName('eye-off');
            return setConfirmPassword(!ConfirmPassword)
        } else {
            setCName('eye');
            return setConfirmPassword(!ConfirmPassword)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} >
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

                    {/* Email Field */}
                    <View style={styles.inputField}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder='Email'
                                    value={value}
                                    placeholderTextColor={Color}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    // onChangeText={(text) => setEmail(text)}
                                    style={styles.inputTxt}
                                />
                            )}
                            name={'Email'}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Email is required!'
                                },
                                pattern: {
                                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                    message: 'Enter your correct email'
                                }
                            }}
                        />
                    </View>
                    {errors?.Email && (<Text style={{ fontSize: vw(3), color: Style.defaultRed, marginHorizontal: vw(9), }}>{errors?.Email?.message?.toString()}</Text>)}


                    {/* Display name field */}
                    <View style={styles.inputField}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder='User name'
                                    value={value}
                                    placeholderTextColor={Color}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    // onChangeText={(text) => setEmail(text)}
                                    style={styles.inputTxt}
                                />
                            )}
                            name={'DisplayName'}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'User name is required!'
                                },
                                // pattern:{
                                //     value:,
                                //     message:,
                                // },
                                // minLength: {
                                //     value: 8,
                                //     message: ' Password is too short ',
                                // }
                            }}
                        />
                    </View>
                    {errors?.DisplayName && (<Text style={{ fontSize: vw(3), color: Style.defaultRed, marginHorizontal: vw(9), }}>{errors?.DisplayName?.message?.toString()}</Text>)}



                    {/* First name Field */}
                    <View style={styles.inputField}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder='First name'
                                    value={value}
                                    placeholderTextColor={Color}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    // onChangeText={(text) => setEmail(text)}
                                    style={styles.inputTxt}
                                />
                            )}
                            name={'FirstName'}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'First name is required!'
                                },
                                // pattern:{
                                //     value:,
                                //     message:,
                                // },
                                // minLength: {
                                //     value: 8,
                                //     message: ' Password is too short ',
                                // }
                            }}
                        />
                    </View>
                    {errors?.FirstName && (<Text style={{ fontSize: vw(3), color: Style.defaultRed, marginHorizontal: vw(9), }}>{errors?.FirstName?.message?.toString()}</Text>)}



                    {/* Last Name Field */}
                    <View style={styles.inputField}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder='Last name'
                                    value={value}
                                    placeholderTextColor={Color}
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    // onChangeText={(text) => setEmail(text)}
                                    style={styles.inputTxt}
                                />
                            )}
                            name={'LastName'}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Last Name is required!'
                                },
                                // pattern:{
                                //     value:,
                                //     message:,
                                // },
                                // minLength: {
                                //     value: 8,
                                //     message: ' Password is too short ',
                                // }
                            }}
                        />
                    </View>
                    {errors?.LastName && (<Text style={{ fontSize: vw(3), color: Style.defaultRed, marginHorizontal: vw(9), }}>{errors?.LastName?.message?.toString()}</Text>)}


                    {/* Password Field */}
                    <View style={styles.inputField}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        placeholder='Password'
                                        value={value}
                                        secureTextEntry={Password}
                                        placeholderTextColor={Color}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        // onChangeText={(text) => setEmail(text)}
                                        style={styles.inputTxt}
                                    />
                                    <TouchableOpacity onPress={togglePass} >
                                        <Icon name={Name} size={vw(6)} color={Style.defaultRed} style={{ marginRight: vw(4) }} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            name={'Password'}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Password is required!'
                                },
                                minLength: {
                                    value: 8,
                                    message: ' Password is too short ',
                                },
                                pattern: {
                                    value: /^\w+(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
                                    // /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                                }
                            }}
                        />
                    </View>
                    {errors?.Password && (<Text style={{ fontSize: vw(3), color: Style.defaultRed, marginHorizontal: vw(9), }}>{errors?.Password?.message?.toString()}</Text>)}


                    {/* Confirm Password Field */}
                    <View style={styles.inputField}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        placeholder='Confirm Password'
                                        value={value}
                                        secureTextEntry={ConfirmPassword}
                                        placeholderTextColor={Color}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        // onChangeText={(text) => setEmail(text)}
                                        style={styles.inputTxt}
                                    />
                                    <TouchableOpacity onPress={toggleConfirmPass} >
                                        <Icon name={CName} size={vw(6)} color={Style.defaultRed} style={{ marginRight: vw(4) }} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            name={'ConfirmPassword'}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Confirm password is required!'
                                },
                                // pattern:{
                                //     value:,
                                //     message:,
                                // },
                                minLength: {
                                    value: 8,
                                    message: ' Password is too short ',
                                },
                                validate: {
                                    value: value => value === getValues('Password') || 'Password does not match',
                                }


                            }}
                        />
                    </View>
                    {errors?.ConfirmPassword && (<Text style={{ fontSize: vw(3), color: Style.defaultRed, marginHorizontal: vw(9), }}>{errors?.ConfirmPassword?.message?.toString()}</Text>)}
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
                        <TouchableOpacity activeOpacity={.4} onPress={handleSubmit(onSubmit)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonTxt}>Register</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView >
            <Modal isVisible={Activity} coverScreen={true} hasBackdrop={true} backdropColor='black' backdropOpacity={.6}
                onBackdropPress={() => setActivity(false)} onBackButtonPress={() => setActivity(false)} useNativeDriver={true}
                useNativeDriverForBackdrop={true} statusBarTranslucent={true} style={{ height: vh(100), }} deviceHeight={deviceHeight} >
                <View style={{
                    flex: 1, justifyContent: 'center',
                    alignItems: 'center', flexDirection: 'column',
                }}>
                    <Text style={{ color: '#fff', fontSize: vw(5), fontWeight: '400' }}>Please wait</Text>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center', flexDirection: 'row'
                    }}>
                        <ActivityIndicator size={vw(20)} color="#fff" />
                        {/* <QuibButton text={'Do it later'} onPressed={() => { setActivity(false) }} viewStyle={[[styles.button], { backgroundColor: Style.defaultGrey }]} textStyle={styles.buttonTxt} />
            <QuibButton text={'Ok, let dot it'} onPressed={() => { navigation.navigate('Login') }} viewStyle={styles.button} textStyle={styles.buttonTxt} /> */}
                    </View>
                </View>
            </Modal>
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
    loadingActivity: {
        zIndex: 2,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        // opacity: 0.5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }
})