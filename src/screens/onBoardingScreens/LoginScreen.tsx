import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { StringData } from '../../constants/Constant'
import { Style } from '../../constants/Styles';
import QuibButton from '../../components/QuibButton';
import { vmax, vw } from 'rxn-units';

interface props {
  navigation: any;
}

export default function LoginScreen(props: props) {

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const Color = "#5555";

  const Login = () => {
    // if (!Email && !Password && !ConfirmPassword && !Name && !Img && toggleCheckBox)
    //     return console.log('please fill the form');
    // else console.log('correct')
    fetch('http://www.quibs.com/ChooseMovie/GetAllMovies')
      .then((res) => {
        console.log(res)
      })
  }
  return (
    <View style={{
      // height:vmax(),
      flex: 1,
      // backgroundColor: '#fff',
      // marginHorizontal: 16,
      // marginVertical: 20,
      // borderWidth: 1,
      // borderColor: '#3333',
    }}>
      <SafeAreaView style={styles.container}>
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
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: vw(15), marginBottom: vw(2), }}>
            <TouchableOpacity activeOpacity={.4} onPress={Login}>
              <View style={styles.button}>
                <Text style={styles.buttonTxt}>Submit</Text>
              </View>
            </TouchableOpacity>
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
      </SafeAreaView >
    </View>

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