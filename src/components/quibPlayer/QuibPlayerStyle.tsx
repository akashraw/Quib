import { StyleSheet } from "react-native";
import { vw } from "rxn-units";
import { Style } from "../../constants/Styles";
import React from "react";

export const quibPlayerStyles = StyleSheet.create({
    sliderDummy: {
        backgroundColor: '#d3d3d3',
        width: 300,
        height:30,
        borderRadius: 50,
        position: 'absolute',                
    },
    sliderReal: {
        backgroundColor: '#119EC2',
        width: (400/50) * 300,
        height:30,
    },
    quibHead:{
        flex:1,
        flexDirection:"row",
        
    },
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
        paddingVertical: vw(0),
    },
    flatlistContainer: {
        // backgroundColor:'transparent',
        // backgroundColor:'#fff',
        backgroundColor:'rgba( 248, 251, 248, .9)',
        height: vw(60),
        width: vw(90),
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        borderRadius:vw(2),
        borderColor: '#E6E6E6',
        paddingVertical: vw(2),
        paddingHorizontal: vw(2),
        // marginVertical: vw(3),
    },
   
})
