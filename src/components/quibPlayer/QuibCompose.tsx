import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'


export default function QuibCompose() {
const [QuibInput, setQuibInput] = useState('');
    return (
    <View>
      <TextInput placeholder='Write a Quib here..' value={QuibInput} onChangeText={(text)=>setQuibInput(text)}/>
    </View>
  )
}

const styles = StyleSheet.create({})