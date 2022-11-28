import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import DATA from '../../constants/Constant'
export default function RegisterScreen() {
    return (
        <SafeAreaView>
            <View>
                <Text>{DATA.registerHead}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})