import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, Image, ActivityIndicator, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { StringData } from '../../constants/Constant'
import { Style } from '../../constants/Styles';
import QuibButton from '../../components/QuibButton';
import { vh, vw } from 'rxn-units';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons'
import { LoginAPI } from '../../constants/Api';
import { AuthContext, useAuth } from '../../Auth';
import { Modal } from 'react-native-paper';

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
        // return props.navigation.navigate('Login')
      } else {
        setFail(true)
        setActivity(false)
        return reset();
      }
    } catch (error) {
      console.log(error);
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
            style={{ width: vw(35), height: vw(20), justifyContent: 'center', alignSelf: 'center' }}
            resizeMode={'contain'}
            source={require('../../assets/logo.png')}
          />
          <Text style={{ fontSize: 24, textAlign: 'center', color: Style.defaultRed, fontWeight: 'bold', paddingTop: vw(15) }}>{StringData.loginHead}</Text>
          {Fail ? <Text style={{ fontSize: 14, textAlign: 'center', color: Style.defaultRed, fontWeight: 'bold', paddingTop: vw(4) }}>Please enter correct email and password</Text> : null}
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
                  message: 'email is required!'
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
            <TouchableOpacity activeOpacity={.2}>
              <Text style={{ paddingTop: vw(4), color: Style.forgetPass }}>Forgot the password?</Text>
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: 'space-evenly', alignItems: 'center', marginTop: vw(10), flexDirection: 'row' }}>
            <View style={{ paddingVertical: 10, }}>
              <QuibButton text={'Join'} onPress="Register" viewStyle={styles.button} textStyle={styles.buttonTxt} />
            </View>
            <View style={{ paddingVertical: 10, }}>
              <QuibButton text={'Visit'} onPress="Choose" viewStyle={styles.button} textStyle={styles.buttonTxt} />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      {
        Activity == true &&
        <View style={styles.loadingActivity} >
          <ActivityIndicator size={vw(20)} color="#fff" />
        </View>
      }
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
    // paddingBottom: -2,
    // paddingTop: 20,
    color: Style.defaultTxtColor
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
    zIndex:2,
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