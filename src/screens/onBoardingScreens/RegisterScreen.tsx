import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import {StringData} from '../../constants/Constant'
export default function RegisterScreen() {
    return (
        <SafeAreaView>
            <View>
                <Text>{StringData.registerHead}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})