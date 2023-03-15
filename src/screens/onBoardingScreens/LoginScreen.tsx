import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, Image, ActivityIndicator, Alert, Dimensions } from 'react-native'
import React, { useContext, useState } from 'react'
import { StringData } from '../../constants/Constant'
import { Style } from '../../constants/Styles';
import QuibButton from '../../components/QuibButton';
import { vh, vw } from 'rxn-units';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons'
import { LoginAPI } from '../../constants/Api';
import { AuthContext } from '../../Auth';
import Modal from "react-native-modal";

const deviceHeight = Dimensions.get('screen').height;


interface props {
  navigation: any;
}

export default function LoginScreen(props: props) {
  const Color = "#5555";
  const [Fail, setFail] = useState<boolean>(false);
  const [Password, setPassword] = useState(true);
  const [Name, setName] = useState('eye-off');
  const [Activity, setActivity] = useState(false);
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
      console.log(data)
      return Login(data);

    }
    else return (
      setActivity(false)
    )

  }
  const Login = async (data: any) => {
    // console.log(encodeURI(data.Email)+' '+data.Password);
    const headerOption = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    }
    try {
      let response = await fetch(`${LoginAPI}?Email=${encodeURIComponent(data.Email)}&Password=${encodeURIComponent(data.Password)}`, headerOption);
      let json = await response.json();
      if (response.status == 200) {
        auth.handleLogin(json.id);
        return setActivity(false)
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

  const togglePass = () => {
    if (!Password) {
      setName('eye-off');
      return setPassword(!Password);
    } else {
      setName('eye');
      return setPassword(!Password);
    }
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
          <Text style={styles.headTxt}>{StringData.loginHead}</Text>
          {Fail ? <Text style={{ fontSize: vw(3.6), textAlign: 'center', color: Style.defaultRed, fontWeight: 'bold', paddingTop: vw(4) }}>Please enter correct email and password</Text> : null}
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

          {/* {errors?.Email && (<Text style={{ fontSize: vw(3), color: Style.defaultRed, marginHorizontal: vw(9), }}>Enter correct email</Text>)} */}
          {/* ========================================= PASSWORD FIELD ================================= */}
          <View style={styles.inputField}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    autoCapitalize='none'
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
                    <Icon name={Name} size={auth.DeviceType ? vw(4.2) : vw(6)} color={Style.defaultRed} style={{ marginRight: vw(4) }} />
                  </TouchableOpacity>
                </View>
              )}
              name={'Password'}
              rules={{
                required: {
                  value: true,
                  message: 'Password is required!'
                }
              }}
            />
          </View>
          {errors?.Password && (<Text style={{ fontSize: vw(3), color: Style.defaultRed, marginHorizontal: vw(9), }}>{errors?.Password?.message?.toString()}</Text>)}
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: vw(15), marginBottom: vw(2), }}>
            <TouchableOpacity activeOpacity={.4} onPress={handleSubmit(onSubmit)}>
              <View style={styles.button}>
                <Text style={styles.buttonTxt}>Submit</Text>
              </View>
            </TouchableOpacity>
            {/* <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={!isValid} buttonColor={Style.defaultRed} >
          <Text style={styles.buttonTxt}>Submit</Text>
        </Button> */}
            <TouchableOpacity activeOpacity={.2} onPress={() => props.navigation.navigate('Forget')}>
              <Text style={styles.passForgot}>Forgot the password?</Text>
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: 'space-evenly', alignItems: 'center', marginTop: vw(10), flexDirection: 'row' }}>
            <View style={{ paddingVertical: 10, }}>
              <QuibButton text={'Join Us'} onPressed={() => { props.navigation.navigate('Register') }} viewStyle={styles.button} textStyle={styles.buttonTxt} />
            </View>
            <View style={{ paddingVertical: 10, }}>
              <QuibButton text={'Visit'} onPressed={() => { props.navigation.navigate('Bottom') }} viewStyle={styles.button} textStyle={styles.buttonTxt} />
            </View>
          </View>
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
            {/* <QuibButton text={'Do it later'} onPressed={() => { setActivity(false) }} viewStyle={[[styles.button], { backgroundColor: Style.defaultGrey }]} textStyle={styles.buttonTxt} />
            <QuibButton text={'Ok, let dot it'} onPressed={() => { navigation.navigate('Login') }} viewStyle={styles.button} textStyle={styles.buttonTxt} /> */}
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
    borderColor: '#3333',
  },
  quibsLogo: {
    width: vw(35),
    height: vw(20),
    justifyContent: 'center',
    alignSelf: 'center'
  },
  passForgot: {
    paddingTop: vw(4),
    color: Style.forgetPass,
    fontSize: vw(3.6)
  },
  headWrap: {},
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
    // flex: 1,
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
})

const stylesTab = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Style.quibBackColor,
    // marginHorizontal: 16,
    // marginVertical: 20,
    // borderWidth: 1,
    // borderColor: '#3333',
  },
  passForgot: {
    paddingTop: vw(4),
    color: Style.forgetPass,
    fontSize: vw(3)
  },
  quibsLogo: {
    width: vw(30),
    height: vw(20),
    justifyContent: 'center',
    alignSelf: 'center'
  },
  headTxt: {
    fontSize: vw(5),
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