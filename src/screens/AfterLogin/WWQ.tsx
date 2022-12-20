import { Image, SafeAreaView, StyleSheet, FlatList, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Style } from '../../constants/Styles'
import { vmin, vmax, vw, vh, percentage } from 'rxn-units';
import { API, GetAllMoviesAPI } from '../../constants/Api';
import { GetAllMovies } from '../../services/QuibAPIs';

interface props {
    navigation: any;
  }

const WWQ = (props: props) => {
    const [res, setRes] = useState([]);
    useEffect(() => {
        GetAllMovies().then(res => setRes(res));
    }, [])
    const headerOptions = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        }

    }


    const MovieBanner = ({ item, index }: any) => {
        return (
            <TouchableOpacity onPress={() => props.navigation.navigate("Qplayer")}>
                <View style={{ margin: vw(2), }}>
                    {/* bannner top */}
                    <View key={index} style={styles.movieBanner}>
                        <Image style={{ width: 45, height: 60, marginHorizontal: vw(2) }} source={{ uri: `${API}${item.posterContentThumb}` }} />
                        <View>
                            <Text style={[styles.title, styles.txt]}>{item.title}</Text>
                            <Text style={[styles.year, styles.txt]}>{item.releaseYear}</Text>
                            <Text style={[styles.director, styles.txt]}>{item.director}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }
    return (
        <SafeAreaView>
            <View style={{ alignItems: 'center', margin: 10, }}>
                <FlatList
                    bounces={false}
                    numColumns={0}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={res}
                    renderItem={({ item, index }) => (MovieBanner({ item, index }))}
                />
            </View>
        </SafeAreaView>

    )
}


export default WWQ


const styles = StyleSheet.create({
    movieBanner: {
        width: vw(80),
        height: vh(10),
        flexDirection: 'row',
        backgroundColor: Style.quibColor,
        alignItems: 'center',
    },
    txt: {
        fontSize: 14,
        color: Style.quibText,
        fontWeight: 'bold'
    },
    title: {},
    year: {},
    director: {},
})



