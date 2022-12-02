import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function QuibPlayer() {
    return (
        <SafeAreaView>
            <View>
                <Text>Timeline quib for</Text>
                <Image source={require('../../assets/Movie/arrival.jpeg')}/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})