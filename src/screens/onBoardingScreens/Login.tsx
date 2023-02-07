import { StyleSheet, Text, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import { vh } from 'rxn-units'
// import { SafeAreaView } from 'react-native-safe-area-context'

export default function Login() {
    return (
        <SafeAreaView style={{
            // marginTop: StatusBar.currentHeight
        }}>
            <Text style={{ color: 'black', marginTop: vh(0) }}>Login</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})