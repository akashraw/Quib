import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { Eula, StringData } from '../../constants/Constant'
import Icon from 'react-native-vector-icons/FontAwesome'
import ImagePicker from 'react-native-image-crop-picker';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Style } from '../../constants/Styles';
import OnLandingButton from '../../components/OnLandingButton';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.headWrap}>
        <Text style={{ fontSize: 20, textAlign: 'center', color: Style.defaultRed, fontWeight: 'bold' }}>{StringData.registerHead}</Text>
      </View>
      <View >
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
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom:10, }}>
          <TouchableOpacity activeOpacity={.4} onPress={Login}>
            <View style={styles.button}>
              <Text style={styles.buttonTxt}>Login</Text>
            </View>
          </TouchableOpacity>
          <Text style={{ color: Style.defaultTxtColor }}>Forgot the password?</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <View style={{paddingVertical:10,}}>
            <OnLandingButton text={'Join'} onPress="Register" />
          </View>
          <View style={{paddingVertical:10,}}>
            <OnLandingButton text={'Visit'} onPress="Choose" />
          </View>
        </View>
      </View>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#3333',
  },
  headWrap: {
    marginTop: 20,
  },
  inputField: {
    borderBottomWidth: 1,
    borderColor: '#5555',
    marginHorizontal: 16,
  },
  inputTxt: {
    paddingBottom: -2,
    paddingTop: 20,
    color: '#3333'
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
    width: 100,
    height: 32,
    borderRadius: 16,
    marginBottom:10,
  },
  buttonTxt: {
    fontSize: 14,
    color: '#fff'
  },
})