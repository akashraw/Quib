import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, Image, ActivityIndicator, Alert, Dimensions, GestureResponderEvent } from 'react-native'
import React, { useContext, useState } from 'react'
import { StringData } from '../../constants/Constant'
import { Style } from '../../constants/Styles';
import QuibButton from '../../components/QuibButton';
import { vh, vw } from 'rxn-units';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons'
import { ForgetPasswordAPI, LoginAPI } from '../../constants/Api';
import { AuthContext } from '../../Auth';
import Modal from "react-native-modal";

const deviceHeight = Dimensions.get('screen').height;


interface props {
    navigation: any;
}

export default function ForgetPassword(props: props) {
    const Color = "#5555";
    const [Fail, setFail] = useState<boolean>(false);
    const [Activity, setActivity] = useState(false);
    const [RecoverStatus, setRecoverStatus] = useState(false)
    const auth = useContext(AuthContext);
    const styles = (auth.DeviceType ? stylesTab : style)
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
            return Forget(data);
        }
        else return (
            setActivity(false)
        )

    }
    const Forget = async (data: any) => {
        // console.log(encodeURI(data.Email)+' '+data.Password);
        const headerOption = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': '*/*'
            }
        }
        try {
            let response = await fetch(`${ForgetPasswordAPI}?Email=${encodeURIComponent(data.Email)}`, headerOption);
            let json = await response.json();
            if (response.status == 200) {
                setActivity(false)
                return setRecoverStatus(true);

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
        props.navigation.navigate('Reset');
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} >
                <View style={styles.headWrap}>
                    <Image
                        style={styles.quibsLogo}
                        // style={{ width: vw(35), height: vw(20), justifyContent: 'center', alignSelf: 'center' }}
                        resizeMode={'contain'}
                        source={require('../../assets/logo.png')}
                    />
                    <Text style={styles.headTxt}>Forgot Password</Text>
                    {Fail ? <Text style={{ fontSize: (auth.DeviceType ? vw(2.5) : vw(3.6)), textAlign: 'center', color: Style.defaultRed, fontWeight: 'bold', paddingTop: vw(4) }}>Please enter correct email</Text> : null}
                </View>
                <View style={{ marginTop: vw(1) }}>
                    <View style={styles.inputField}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    autoCapitalize='none'
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
                    <Text style={{ color: '#fff', fontSize: vw(5), fontWeight: '400' }}>Recovery code has been sent to your email</Text>
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

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Style.quibBackColor,
        // marginHorizontal: 16,
        // marginVertical: 20,
        // borderWidth: 1,
        // borderColor: '#3333',
    },
    quibsLogo: {
        width: vw(35),
        height: vw(20),
        justifyContent: 'center',
        alignSelf: 'center'
    },
    headWrap: {
        marginTop: vw(0),
    },
    headTxt: {
        fontSize: vw(7.2),
        textAlign: 'center',
        color: Style.defaultRed,
        fontWeight: 'bold',
        paddingTop: vw(2)
    },
    inputField: {
        marginVertical: vw(2),
        borderWidth: 1,
        borderColor: '#5555',
        marginHorizontal: vw(5),
        justifyContent: 'center',
        borderRadius: vw(2),
        height: vw(10)
    },
    inputTxt: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: vw(4),
        fontSize: vw(4),
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
        fontSize: vw(3.6),
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
});
const stylesTab = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Style.quibBackColor,
        // marginHorizontal: 16,
        // marginVertical: 20,
        // borderWidth: 1,
        // borderColor: '#3333',
    },
    quibsLogo: {
        width: vw(30),
        height: vw(20),
        justifyContent: 'center',
        alignSelf: 'center'
    },
    headTxt: {
        fontSize: vw(4),
        textAlign: 'center',
        color: Style.defaultRed,
        fontWeight: 'bold',
        paddingTop: vw(2)
    },
    headWrap: {
        marginTop: vw(0),
    },
    inputField: {
        marginVertical: vw(1.5),
        borderWidth: 1,
        borderColor: '#5555',
        marginHorizontal: vw(5),
        justifyContent: 'center',
        borderRadius: vw(2),
        height: vw(6.5)
    },
    inputTxt: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: vw(4),
        fontSize: vw(3.6),
        flex: 1,
        // paddingBottom: -2,
        // paddingTop: 20,
        color: Style.defaultTxtColor
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Style.defaultRed,
        width: vw(20),
        height: vw(8),
        borderRadius: vw(2),
        marginBottom: 10,
    },
    buttonTxt: {
        textAlign: 'center',
        fontSize: vw(3),
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