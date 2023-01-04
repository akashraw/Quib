import { StyleSheet } from "react-native";
import { vw } from "rxn-units";
import { Style } from "../../constants/Styles";
import React from "react";

export const styles = StyleSheet.create({
    timer: {
        marginHorizontal: vw(3),
        backgroundColor: Style.defaultRed,
        width: vw(25),
        flexDirection: 'row',
        height: vw(6),
        borderRadius: vw(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatlistComps: {
        paddingVertical: vw(2),
    },
    flatlistContainer: {
        backgroundColor:'#fff',
        height: vw(50),
        width: vw(50),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E6E6E6',
        paddingVertical: vw(1),
        paddingHorizontal: vw(3),
        marginVertical: vw(3),
    },
   
})
