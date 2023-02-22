import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import { vh, vw } from 'rxn-units'
import SkeletonHorizontal from './SkeletonHorizontal'
import FastImage from 'react-native-fast-image'
import { API } from '../../constants/Api'
import { Style } from '../../constants/Styles'
import { useNavigation } from '@react-navigation/native'

export default function SeeMoreRecent(route: any) {
    const Data = route.route.params.Data
    const navigation = useNavigation();
    const MovieBanner = useCallback(({ item, index }: any) => {
        const check: string = item.posterContentThumb;
        let FS = check.split('.').pop();
        return (

            <View style={{ flex: 1, margin: vw(2), flexDirection: 'row', justifyContent: 'center', }}>
                {/* bannner top */}
                <View key={index} style={styles.movieBanner}>
                    <TouchableOpacity onPress={() => navigation.navigate("Qplayer" as never, { MovieId: item.id, Movietitle: item.title } as never)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            {/* <Shadow distance={1} style={{ borderRadius: vw(2) }} > */}
                            <FastImage
                                style={{ width: vw(15), height: vw(20), marginRight: vw(2), borderRadius: vw(1) }}
                                // resizeMode={FastImage.resizeMode.contain}
                                source={{
                                    uri: ((FS == 'jpeg' || FS == 'jpg') ? `${API}${item.posterContentThumb}` : `data:image/png;base64,${item.posterContentThumb}`),
                                    priority: FastImage.priority.normal,
                                    cache: FastImage.cacheControl.immutable
                                }} />
                            {/* </Shadow> */}
                            <View>
                                <Text style={[[styles.txt], { width: vw(55), paddingRight: vw(1) }]} numberOfLines={1}>{item.title}</Text>
                                <Text style={[...[styles.txt], { fontSize: vw(3) }]}>{item.releaseYear}</Text>
                                <Text style={[...[styles.txt], { fontSize: vw(3) }]}>{item.director}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', marginRight: vw(0) }}>
                        <View style={{ alignItems: 'center', alignSelf: 'flex-end', }}>
                            <View style={{ width: vw(16), height: vw(16), marginBottom: vw(1), }}>
                                <View style={{ width: vw(16), height: vw(8), borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Style.defaultRed, borderColor: Style.defaultRed, borderTopRightRadius: vw(4), borderTopLeftRadius: vw(4), borderBottomWidth: 0 }}>
                                    <Text style={{ color: '#fff', fontWeight: '500', fontSize: 14, alignSelf: 'center' }}>4.2k</Text>
                                </View>
                                <View style={{ width: vw(16), height: vw(8), borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: Style.defaultRed, borderBottomLeftRadius: vw(4), borderBottomRightRadius: vw(4), borderTopWidth: 0 }}>
                                    <Text style={{ fontSize: 9, fontWeight: '500', color: Style.defaultTxtColor, textAlign: 'center', alignSelf: 'center' }}>Total Quibs</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )

    }, [Data])
    return (
            <View style={{ alignItems: 'center', backgroundColor: Style.quibBackColor, height: vh(100) }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{ width: vw(100) }}
                    showsHorizontalScrollIndicator={false}
                    data={Data}
                    renderItem={({ item, index }: any) => <MovieBanner item={item} index={index} />}
                    ListEmptyComponent={() => <SkeletonHorizontal />}
                // estimatedItemSize={vw(40)}
                />
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: 'grey',
    },
    contentContainer: {

        flex: 1,
        alignItems: 'center',
    },
    movieBanner: {
        justifyContent: 'space-between',
        borderRadius: vw(2),
        width: vw(95),
        height: vh(12),
        flexDirection: 'row',
        backgroundColor: '#EEEEEE',
        paddingHorizontal: vw(2),
        // backgroundColor: 'Style.quibColor',
        alignItems: 'center',
    },
    txt: {
        fontSize: vw(3.5),
        color: Style.quibText,
        fontWeight: 'bold'
    },
    button: {
        marginRight: vw(4),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        borderColor: Style.defaultRed,
        // backgroundColor: Style.defaultRed,
        width: vw(8),
        height: vw(8),
        borderRadius: vw(2),
        // marginBottom: 10,
    },
    buttonTxt: {
        textAlign: 'center',
        fontSize: 14,
        // color: '#EDEDED',
        fontWeight: '500'
    },
})