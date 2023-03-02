import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, Image, ActivityIndicator, Alert, Dimensions, GestureResponderEvent } from 'react-native'
import React, { useContext, useState } from 'react'
import { StringData } from '../../constants/Constant'
import { Style } from '../../constants/Styles';
import QuibButton from '../../components/QuibButton';
import { vh, vw } from 'rxn-units';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons'
import { LoginAPI, ResetPasswordAPI } from '../../constants/Api';
import { AuthContext, useAuth } from '../../Auth';
import Modal from "react-native-modal";

const deviceHeight = Dimensions.get('screen').height;


interface props {
    navigation: any;
}

export default function ResetPassword(props: props) {
    const Color = "#5555";
    const [Fail, setFail] = useState<boolean>(false);
    const [Activity, setActivity] = useState(false);
    const [RecoverStatus, setRecoverStatus] = useState(false);
    const [Password, setPassword] = useState(true);
    const [ConfirmPassword, setConfirmPassword] = useState(true);
    const [Name, setName] = useState('eye-off');
    const [CName, setCName] = useState('eye-off');
    const auth = useContext(AuthContext);
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        getValues,
        reset
    } = useForm({ mode: 'onBlur' })

    const onSubmit = (data: any) => {
        setActivity(true);
        if (isValid == true) {
            return Reset(data);

        }
        else return (
            setActivity(false)
        )

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
    const Reset = async (data: any) => {
        // console.log(encodeURI(data.Email)+' '+data.Password);
        const headerOption = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }
        try {
            let response = await fetch(`${ResetPasswordAPI}?Email=${encodeURIComponent(data.Email)}&Password=${encodeURIComponent(data.Password)}&ConfirmPassword=${encodeURIComponent(data.ConfirmPassword)}`, headerOption);
            let json = await response.json();
            if (response.status == 200) {
                setActivity(false)
                setRecoverStatus(true);
            } else {
                setFail(true)
                setActivity(false)
                return reset();
            }
        } catch (error) {
            setFail(true)
            setActivity(false)
            reset();
            return console.log(error);
        }
    }
    const HandleOk = () => {
        setRecoverStatus(false);
        props.navigation.navigate('Login');
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
                    <Text style={{ fontSize: 24, textAlign: 'center', color: Style.defaultRed, fontWeight: 'bold', paddingTop: vw(15) }}>Reset your Password</Text>
                    {Fail ? <Text style={{ fontSize: 14, textAlign: 'center', color: Style.defaultRed, fontWeight: 'bold', paddingTop: vw(4) }}>Please enter a new password</Text> : null}
                </View>
                <View style={{ marginTop: vw(1) }}>
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
                    {errors?.Email && (<Text style={{ fontSize: vw(3), color: Style.defaultRed, marginHorizontal: vw(9), }}>{errors?.Email.message?.toString()}</Text>)}
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
                                    // value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8, 32}/,
                                    value: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,32}$/,
                                    message: 'Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
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
                                validate: {
                                    value: value => value === getValues('Password') || 'Password does not match',
                                }


                            }}
                        />
                    </View>
                    {errors?.ConfirmPassword && (<Text style={{ fontSize: vw(3), color: Style.defaultRed, marginHorizontal: vw(9), }}>{errors?.ConfirmPassword?.message?.toString()}</Text>)}

                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: vw(15), marginBottom: vw(2), }}>
                        <TouchableOpacity activeOpacity={.4} onPress={handleSubmit(onSubmit)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonTxt}>Submit</Text>
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity activeOpacity={.2}>
                            <Text style={{ paddingTop: vw(4), color: Style.forgetPass }}>Forgot the password?</Text>
                        </TouchableOpacity> */}
                    </View>
                    {/* <View style={{ justifyContent: 'space-evenly', alignItems: 'center', marginTop: vw(10), flexDirection: 'row' }}>
                        <View style={{ paddingVertical: 10, }}>
                            <QuibButton text={'Join'} onPressed={() => { props.navigation.navigate('Register') }} viewStyle={styles.button} textStyle={styles.buttonTxt} />
                        </View>
                        <View style={{ paddingVertical: 10, }}>
                            <QuibButton text={'Visit'} onPressed={() => { props.navigation.navigate('Choose') }} viewStyle={styles.button} textStyle={styles.buttonTxt} />
                        </View>
                    </View> */}
                </View>
            </KeyboardAwareScrollView>
            <Modal isVisible={Activity} coverScreen={true} hasBackdrop={true} backdropColor='black' backdropOpacity={.6}
                onBackdropPress={() => null} onBackButtonPress={() => null} useNativeDriver={true}
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
                    </View>
                </View>
            </Modal>
            <Modal isVisible={RecoverStatus} coverScreen={true} hasBackdrop={true} backdropColor='black' backdropOpacity={.6}
                onBackdropPress={() => null} onBackButtonPress={() => null} useNativeDriver={true}
                useNativeDriverForBackdrop={true} statusBarTranslucent={true} style={{ height: vh(100), }} deviceHeight={deviceHeight} >
                <View style={{
                    flex: 1, justifyContent: 'center',
                    alignItems: 'center', flexDirection: 'column',
                }}>
                    <Text style={{ color: '#fff', fontSize: vw(5), fontWeight: '400' }}>Password is successfully reset</Text>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center', flexDirection: 'row'
                    }}>
                        <QuibButton text={'Ok'} onPressed={() => HandleOk} textStyle={undefined} />
                        {/* <ActivityIndicator size={vw(20)} color="#fff" /> */}
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
        borderColor: '#3333',
    },
    headWrap: {
    },
    inputField: {
        marginTop: vw(3),
        marginBottom: vw(0),
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
        flex: 1,
        // paddingBottom: -2,
        // paddingTop: 20,
        color: Style.defaultTxtColor
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