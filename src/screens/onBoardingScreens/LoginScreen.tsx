import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { StringData } from '../../constants/Constant'
import { Style } from '../../constants/Styles';
import QuibButton from '../../components/QuibButton';
import { vh, vmax, vw } from 'rxn-units';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'react-native-paper';
import { LoginAPI } from '../../constants/Api';

interface props {
  navigation: any;
}

export default function LoginScreen(props: props) {
  const Color = "#5555";
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues
  } = useForm({ mode: 'onBlur' })

  const onSubmit = (data: any) => {
    if (isValid == true) {
      console.log(data)
      return Login(data);

    }
    else return console.log(data)

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
        console.log(json);
        return props.navigation.navigate('Login')
      }
    } catch (error) {
      console.log(error);
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
        </View>
        <View style={{ marginTop: vw(5) }}>
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
                  message: 'Field is required!'
                },
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Enter correct emails'
                }
              }}
            />
          </View>
          {errors?.Email && (<Text style={{ fontSize: vw(3), color: Style.defaultRed, marginHorizontal: vw(9), }}>{errors?.Email.message?.toString()}</Text>)}

          {/* {errors?.Email && (<Text style={{ fontSize: vw(3), color: Style.defaultRed, marginHorizontal: vw(9), }}>Enter correct email</Text>)} */}
          <View style={styles.inputField}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder='Password'
                  value={value}
                  placeholderTextColor={Color}
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                  // onChangeText={(text) => setEmail(text)}
                  style={styles.inputTxt}
                />
              )}
              name={'Password'}
              rules={{
                required: {
                  value: true,
                  message: 'Field is required!'
                },
              }}
            />
          </View>
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
    borderColor: '#3333',
  },
  headWrap: {
    // marginTop: vw(10),
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
})