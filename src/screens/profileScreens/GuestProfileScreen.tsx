import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import { vh, vw } from 'rxn-units';
import QuibButton from '../../components/QuibButton';
import { Style } from '../../constants/Styles';

const deviceHeight = Dimensions.get('screen').height;

export default function GuestProfileScreen(navigation: any) {
    const [Active, setActive] = React.useState(false)
    return (
        <Modal isVisible={Active} coverScreen={true} hasBackdrop={true} backdropColor='black' backdropOpacity={.7}
            onBackdropPress={() => setActive(false)} onBackButtonPress={() => setActive(false)} useNativeDriver={true}
            useNativeDriverForBackdrop={true} statusBarTranslucent={true} style={{ height: vh(100), }} deviceHeight={deviceHeight} >
            <View style={{
                flex: 1, justifyContent: 'center',
                alignItems: 'center', flexDirection: 'column',
            }}>
                <Text style={{ color: '#fff', fontSize: vw(5), fontWeight: '400' }}>Please login to access this feature</Text>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center', flexDirection: 'row'
                }}>
                    <QuibButton text={'Do it later'} onPressed={() => { setActive(false) }} viewStyle={[[styles.button], { backgroundColor: Style.defaultGrey }]} textStyle={styles.buttonTxt} />
                    <QuibButton text={'Ok, let dot it'} onPressed={() => { navigation.navigate('Login') }} viewStyle={styles.button} textStyle={styles.buttonTxt} />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Style.defaultRed,
        width: vw(30),
        height: vw(8),
        borderRadius: vw(2),
        marginVertical: vw(4),
        marginHorizontal: vw(2)
    },
    buttonTxt: {
        textAlign: 'center',
        fontSize: vw(3.6),
        color: '#fff',
        fontWeight: 'bold'
    },
})