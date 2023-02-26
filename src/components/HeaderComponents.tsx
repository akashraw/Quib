import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { vw } from 'rxn-units';
import { Style } from '../constants/Styles';
import IonIcon from 'react-native-vector-icons/Ionicons';

export const Logo = () => {
    const navigation = useNavigation();
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', width: vw(100), backgroundColor: Style.quibHeader, paddingVertical: vw(2) }}>
            <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
                <Image
                    style={{ width: vw(35), height: vw(15) }}
                    source={require('../assets/logo.png')}
                />
            </TouchableOpacity>
        </View>
    )
}
export const Heading = (props: any) => {
    const navigation = useNavigation();
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
            <Text style={{ fontSize: 22, fontWeight: '500', paddingLeft: vw(2), color: Style.defaultRed }}>{props.title}</Text>
        </View>
    )
}
export const BackIcon = () => {
    const navigation = useNavigation();
    return (
        <View >
            <TouchableOpacity style={{ flexDirection: 'row', paddingLeft: vw(0), justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
                <IonIcon name='arrow-back' size={26} color={Style.defaultRed} />
            </TouchableOpacity>
        </View>
    )
}
export const EditIcon = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.navigate("Edit" as never)}>
            <IonIcon style={{ paddingRight: vw(6) }} name='create-outline' size={24} color={Style.defaultRed} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})