import { StyleSheet, Text, TextProps, TouchableOpacity, View, ViewProps } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
// import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { Style } from '../constants/Styles';
import { vw } from 'rxn-units';
interface props {
    text: string;
    onPress: any|null;
    viewStyle: ViewProps['style'] | null;
    textStyle: TextProps['style'] | null;

}


export default function QuibButton({ text, onPress, viewStyle, textStyle }: props) {
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