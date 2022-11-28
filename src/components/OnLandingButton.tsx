import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
interface props {
    text: string;
    onPress: any;

}


export default function OnLandingButton({ text, onPress }: props) {
    return (

        <TouchableOpacity activeOpacity={.4} onPress={onPress}>
            <View style={styles.button}>
                <Text style={styles.buttonTxt}>{text}</Text>
            </View>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#990000',
        width: 100,
        height: 32,
        borderRadius: 16,
        paddingTop: 6,
    },
    buttonTxt: {
        textAlign: 'center',
        fontSize: 14,
        color: '#fff'
    },
})