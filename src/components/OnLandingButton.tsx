import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
interface props {
    text: string;
    onPress: any;
    viewStyle: ViewProps['style'] | null;
    textStyle: ViewProps['style'] | null;

}


export default function OnLandingButton({ text, onPress, viewStyle, textStyle }: props) {
    const navigation = useNavigation();
    return (

        <TouchableOpacity activeOpacity={.4} onPress={()=>{navigation.navigate(onPress as never)}}>
            <View style={viewStyle || styles.button}>
                <Text style={textStyle || styles.buttonTxt}>{text}</Text>
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