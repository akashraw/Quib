import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native'
import React, { useContext } from 'react'
import Modal from 'react-native-modal'
import { vh, vw } from 'rxn-units'
import { AuthContext } from './Auth';
import QuibButton from './components/QuibButton';
import { GestureResponderEvent } from 'react-native';
import { Button } from 'react-native-paper';
import { Style } from './constants/Styles';
import { useNetInfo } from '@react-native-community/netinfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';

// import { SafeAreaView } from 'react-native-safe-area-context'
const deviceHeight = Dimensions.get('screen').height;

export default function Net() {
    const Connect = useContext(AuthContext);
    const [Try, setTry] = React.useState<boolean>(false)
    const netInfo = useNetInfo();
    const insets = useSafeAreaInsets();
    const Auth = useContext(AuthContext);

    const CheckNet = () => {
        setTry(true);
        setTimeout(() => {
            if (netInfo.isConnected == true) {
                Auth.dispatch({
                    type: 'NETINFO',
                    net: true,
                })
                setTry(false);
            }
            else setTry(false)
        }, 2000)

    }
    return (
        <View style={{
            backgroundColor: Style.quibBackColor,
        }}>
            <Modal isVisible={Connect.net} coverScreen={true} hasBackdrop={true} backdropColor='black' backdropOpacity={.7}
                onBackdropPress={() => null} onBackButtonPress={() => null} useNativeDriver={true}
                useNativeDriverForBackdrop={true} statusBarTranslucent={true} style={{ height: vh(100), }} deviceHeight={deviceHeight} >
                <View style={{
                    flex: 1, justifyContent: 'center',
                    alignItems: 'center', flexDirection: 'column',
                }}>
                    <Text style={{ color: '#fff', fontSize: vw(5), fontWeight: '400' }}>No Internet Connection</Text>
                    {
                        Try == false ?
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center', flexDirection: 'row', marginTop: vw(2)
                            }}>
                                <Button style={{ width: vw(40) }} buttonColor={Style.defaultRed} mode='contained' onPress={CheckNet}>
                                    <Text style={{ fontSize: vw(4), }}>Try again</Text>
                                </Button>
                            </View>
                            :
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center', flexDirection: 'row', marginTop: vw(2)
                            }}>
                                <ActivityIndicator size={vw(10)} color="#fff" />
                            </View>
                    }
                </View>
            </Modal>
        </View >
    )
}

const styles = StyleSheet.create({})