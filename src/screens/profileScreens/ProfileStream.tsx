import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GetMovieById, getMoviePoster, QuibByMovieAndUserId } from '../../services/QuibAPIs';
import { vh, vw } from 'rxn-units';
import DropShadow from 'react-native-drop-shadow';
import FastImage from 'react-native-fast-image';
import getFormattedTime from '../../components/GetFormattedTime';
import { quibPlayerStyles } from '../../components/quibPlayer/QuibPlayerStyle';
import { API } from '../../constants/Api';
import { Style } from '../../constants/Styles';
import { FlashList } from '@shopify/flash-list';

export default function ProfileStream(routes: any) {
    const props = routes.route.params;
    const [FlatData, setFlatData] = useState<any[]>([]);
    const [Data, setData] = useState<any>({});
    const posterRef = React.useRef(String);
    const [isPoster, setIsPoster] = useState(Boolean);
    useEffect(() => {
        Promise.all([
            QuibByMovieAndUserId({
                MovieId: props.movieId,
                userId: props.id
            }).then((res: any) => setFlatData(res)),
            GetMovieById({
                MovieId: props.movieId,
                userId: ''
            }).then((res: any) => setData(res)),
            getMoviePoster(props.movieId).then(
                (res: any) =>
                    (posterRef.current = res.map((res: any) => res.posterContent)),
            )
                .then(() => FileCheck()),
        ])
    }, [])
    //==========================file check================================\\
    const FileCheck = () => {
        let FS = posterRef.current.toString().split('.').pop();

        if (FS == 'jpeg' || FS == 'jpg') {
            setIsPoster(true);
            return;
        } else setIsPoster(false);
    };

    //=========================Quib Cards=================================\\
    const Quibs = ({ item, index }: any) => {
        let { hours, mintues, seconds } = getFormattedTime(item.time)

        if (item.isSeedQuib == true && item.isScreenshot == false)
            return (
                <View style={{ width: vw(100), }} key={index}>
                    <DropShadow
                        style={{
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            },
                            shadowOpacity: .5,
                            shadowRadius: vw(.5),
                        }}
                    >
                        <View style={styles.quibCard}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: vw(1) }}>
                                <FastImage source={{ uri: `data:image/png;base64,${item.avatarBase32ImagePath}` }} style={{ width: vw(2), height: vw(2), }} resizeMode='contain' />
                                <View style={[...[quibPlayerStyles.timer], { width: vw(14), height: vw(4) }]}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(2.6), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                                </View>
                            </View>
                            <View style={styles.quibTxtBody}>
                                <Text style={{ color: Style.defaultTxtColor, textAlign: 'left' }}> {item.body}</Text>
                            </View>
                        </View>
                    </DropShadow>
                </View>
            )
        if (item.isScreenshot == true)
            return (
                <View style={{ width: vw(100), }} key={index}>
                    <DropShadow
                        style={{
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            },
                            shadowOpacity: .5,
                            shadowRadius: vw(.5),
                        }}
                    >
                        <View style={styles.quibCard}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                <View style={[...[quibPlayerStyles.timer], { width: vw(14), height: vw(4), marginBottom: vw(1) }]}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(2.6), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                                </View>
                            </View>
                            <View style={{ width: vw(90), alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}>
                                {/* <Shadow distance={8} startColor='#00000020' endColor='#00000000' > */}
                                <DropShadow
                                    style={{
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 0,
                                        },
                                        shadowOpacity: 5,
                                        shadowRadius: vw(1),
                                    }}
                                >
                                    <FastImage
                                        source={{
                                            uri: API + item.body,
                                            cache: FastImage.cacheControl.immutable,
                                            priority: FastImage.priority.normal
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                        style={{ width: vw(75), height: vw(32), marginVertical: vw(2) }}
                                    />
                                </DropShadow>
                                {/* </Shadow> */}
                            </View>
                        </View>
                    </DropShadow>
                </View>
            )
        else return (
            <View style={{ width: vw(100), }} key={index}>
                <DropShadow
                    style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: .5,
                        shadowRadius: vw(.5),
                    }}
                >
                    <View style={styles.quibCard}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <View style={[...[quibPlayerStyles.timer], { width: vw(14), height: vw(4), marginBottom: vw(1) }]}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(2.6), }}>{(hours < 10) ? `0${hours}` : `${hours}`}:{(mintues < 10) ? (`0${mintues}`) : `${mintues}`}:{(seconds < 10) ? (`0${seconds}`) : `${seconds}`}</Text>
                            </View>
                        </View>
                        <View style={styles.quibTxtBody}>
                            <Text style={{ color: Style.defaultTxtColor, textAlign: 'left' }}>{item.body}</Text>
                        </View>
                    </View>
                </DropShadow>
            </View>
        )
    }

    //=======================================================Header===================================================================\\
    const Header = () => {
        return (
            <View
                style={styles.quibCard}>
                <View>
                    <Text style={styles.heading}>Quib stack for</Text>
                </View>
                <View>
                    <FastImage
                        style={styles.image}
                        source={{
                            // uri: `${API}${Poster}`,
                            uri: isPoster
                                ? `${API}${posterRef.current}`
                                : `data:image/jpeg;base64,${posterRef.current}`,
                            priority: FastImage.priority.high,
                            cache: FastImage.cacheControl.immutable,
                        }}
                        resizeMode="contain"
                    />
                </View>
            </View>
        );
    };

    return (
        <View style={{flex:1}}>
            <FlashList
                ListHeaderComponent={() => (
                    <View>
                      <DropShadow
                        style={{
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 0,
                          },
                          shadowOpacity: 0.5,
                          shadowRadius: vw(1),
                        }}>
                        <Header />
                      </DropShadow>
                    </View>
                  )}
                showsHorizontalScrollIndicator={false}
                // style={{ alignSelf: 'center', marginHorizontal: vw(0) }}
                // contentContainerStyle={{ justifyContent: 'center', alignSelf: 'center', marginHorizontal: vw(0) }}
                data={FlatData}
                extraData={FlatData}
                renderItem={({ item, index }) => < Quibs item={item} index={index} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                initialScrollIndex={0}
                estimatedItemSize={vh(30)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    quibCard: {
        width: vw(95),
        alignSelf: 'center',
        alignItems:'center',
        borderRadius: vw(1),
        backgroundColor: Style.quibPlayerCardBack,
        borderWidth: 0,
        // elevation: 4,
        shadowColor: 'black',
        borderColor: Style.borderColor,
        paddingVertical: vw(2),
        marginVertical: vw(4)
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
        marginBottom: vw(2)
    },
    heading: {
        alignSelf:'center',
        fontSize: vw(6.1),
        fontWeight: 'bold',
        // marginBottom:-80,
        paddingTop: vw(2),
        color: Style.defaultTxtColor,
    },
    image: {
        resizeMode: 'contain',
        width: vw(70),
        height: vh(40),
        margin: vw(5),
    },
})