import { StyleSheet } from "react-native";
import { vw } from "rxn-units";
import { Style } from "../../constants/Styles";

export const stylesCompTab = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // alignSelf:'flex-end',
      backgroundColor: Style.defaultRed,
      width: vw(14),
      height: vw(5),
      borderRadius: vw(1),
    },
    buttonTxt: {
      textAlign: 'center',
      fontSize: vw(3),
      color: '#fff',
      fontWeight: '500',
    },
    tabbar: {
      borderRadius: vw(1),
      marginHorizontal: vw(1),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Style.quibPlayerCardBack,
      elevation: 5,
      shadowColor: 'black',
      shadowOpacity: 0.1,
      shadowRadius: StyleSheet.hairlineWidth,
      shadowOffset: {
        height: StyleSheet.hairlineWidth,
        width: 0,
      },
      zIndex: 1,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: 'rgba(0, 0, 0, .2)',
    },
    item: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 0,
    },
    activeItem: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    active: {
      color: Style.defaultRed,
    },
    inactive: {
      color: '#939393',
    },
    label: {
      fontSize: vw(3),
      marginVertical: vw(1.5),
      backgroundColor: 'transparent',
      fontWeight: 'bold',
    },
  
    txt: {
      fontSize: 14,
      color: Style.defaultTxtColor,
      fontWeight: 'bold',
      // textAlign: 'center'
    },
    quibCard: {
      width: vw(95),
      alignSelf: 'center',
      borderRadius: vw(1),
      backgroundColor: Style.quibPlayerCardBack,
      borderWidth: 0,
      // elevation: 4,
      shadowColor: 'black',
      borderColor: Style.borderColor,
      paddingVertical: vw(2),
      marginVertical: vw(4),
    },
    quibTxtBody: {
      width: vw(90),
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: Style.borderColor,
      borderRadius: vw(1),
      paddingHorizontal: vw(2),
      paddingVertical: vw(3),
      marginVertical: vw(1),
      marginBottom: vw(2),
    },
  });