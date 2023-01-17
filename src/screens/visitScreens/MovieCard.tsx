import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { vw } from 'rxn-units'
import { Shadow } from 'react-native-shadow-2'

type Movie ={
    title: string,
    year:number,
    director:string,
}

export default function MovieCard({title, year, director}:Movie) {
    return (
        <View style={{marginHorizontal:vw(2), marginLeft:vw(1.5),paddingVertical:vw(2) }}>
            <Shadow distance={7} style={{ borderRadius: vw(2) }} offset={[0, 2]}>
                <ImageBackground
                    source={require("../../assets/Movie/arrival.jpeg")}
                    imageStyle={{ borderRadius: vw(2) }}
                    // resizeMode='contain'
                    style={{ width: vw(28), height: vw(40), borderColor: '#fff', borderRadius: vw(2) }}
                >
                    <LinearGradient
                        colors={['#00000000', '#000000']}
                        style={{ width: vw(28), height: vw(20), justifyContent: 'flex-end', top: vw(20), borderRadius: vw(2) }}>
                        <View style={{ marginHorizontal: vw(2), marginBottom: vw(1) }}>
                            <Text style={styles.txt} numberOfLines={1}>{title}</Text>
                            <Text style={[...[styles.txt], { fontSize: 12 }]} numberOfLines={1}>{year}</Text>
                            <Text style={[...[styles.txt], { fontSize: 12 }]} numberOfLines={1}>{director}</Text>
                        </View>
                    </LinearGradient>

                </ImageBackground>
            </Shadow>
        </View>
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