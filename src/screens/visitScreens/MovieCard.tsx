import { ImageBackground, StyleSheet, Text, TextProps, View, ViewProps } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { vw } from 'rxn-units'
import { Shadow } from 'react-native-shadow-2'
import { API } from '../../constants/Api'

type Movie = {
    title: string,
    year: number,
    director: string,
    viewStyle: ViewProps['style'] | null,
    textStyle: TextProps['style'] | null,
    linearGradStyle: ViewProps['style'] | null,
    imgSrc: string | null,
}

export default function MovieCard({ title, year, director, viewStyle, textStyle, linearGradStyle, imgSrc }: Movie) {
    // const check: string = imgSrc;
    // console.log('hi')        
    let FS = imgSrc?.split('.').pop();
    return (
        // <Shadow distance={0}>
        <View style={{ marginHorizontal: vw(2), marginLeft: vw(1.5), paddingVertical: vw(2) }}>
            <Shadow distance={5} offset={[0, 1]} containerStyle={{ borderRadius: vw(2) }} >
                <ImageBackground
                    // source={require('../../assets/Movie/arrival.jpeg')}
                    source={{ uri: (FS == 'jpeg' || FS == 'jpg') ? `${API}${imgSrc}` : `data:image/png;base64,${imgSrc}` }}
                    imageStyle={{ borderRadius: vw(2) }}
                    // resizeMode='contain'
                    style={viewStyle || { width: vw(28), height: vw(40), borderColor: '#fff', borderRadius: vw(2) }}
                >
                    <LinearGradient
                        colors={['#00000000', '#00000098']}
                        style={linearGradStyle || { width: vw(28), height: vw(20), justifyContent: 'flex-end', top: vw(20), borderRadius: vw(2) }}>
                        <View style={{ marginHorizontal: vw(2), marginBottom: vw(1) }}>
                            <Text style={styles.txt} numberOfLines={1}>{title}</Text>
                            <Text style={[...[styles.txt], { fontSize: 12 }]} numberOfLines={1}>{year}</Text>
                            <Text style={[...[styles.txt], { fontSize: 12 }]} numberOfLines={1}>{director}</Text>
                        </View>
                    </LinearGradient>

                </ImageBackground>
            </Shadow>
        </View>
        // </Shadow>
    )
}

const styles = StyleSheet.create({
    txt: {
        bottom: 0,
        fontSize: 14,
        // fontFamily: 'Roboto',
        // textAlign: 'center',

        color: '#ffffff',
        backgroundColor: 'transparent',
    },
})