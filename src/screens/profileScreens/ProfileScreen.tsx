import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Style } from '../../constants/Styles'
import { vh, vw } from 'rxn-units'
import QuibButton from '../../components/QuibButton'
import ProfileScreenTabViews from './ProfileScreenTabViews'
import { Shadow } from 'react-native-shadow-2'
import { getFolloweeByUserId, getFollowersByUserId, getMovieByUserId, getUserById } from '../../services/QuibAPIs'
import { useNavigation } from '@react-navigation/core'
import FastImage from 'react-native-fast-image'
import { API, image256API } from '../../constants/Api'
import Auth, { AuthContext } from '../../Auth'
import { Wave } from 'react-native-animated-spinkit'

interface props {
    navigation: any,
}

export default function ProfileScreen({ navigation }: props) {
    const Auth = useContext(AuthContext);
    const [User, setUser] = useState<any>([]);
    const [Followings, setFollowings] = useState<any[]>([]);
    const [Followers, setFollowers] = useState<any[]>([]);
    const [QuibMovies, setQuibMovies] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const user = Auth.userName;

    useEffect(() => {
        +
        Promise.all([
            getMovieByUserId({ userId: user }).then((res) => { setQuibMovies(res) }),
            getFollowersByUserId({ userId: user }).then((res) => { setFollowers(res) }),
            getFolloweeByUserId({ userId: user }).then((res) => { setFollowings(res) }),
            getUserById({ userId: user }).then((res) => setUser(res))
        ]).then(() => setIsLoaded(true))
    }, [])

    const check: string = User.avatarBase256ImagePath;
    

    return (
        <SafeAreaView style={{}}>
            <View style={{ paddingVertical: vw(3), backgroundColor: Style.quibBackColor }}>
                {isLoaded ?
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3) }}>
                            <View style={{ flex: 1, }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: vw(2) }}>
                                    <View style={{ paddingHorizontal: vw(2) }}>
                                        <FastImage
                                            source={{
                                                uri: (( check.split('.').pop() == 'jpeg' || check.split('.').pop() == 'jpg' || check.split('.').pop() == 'png') ? `${image256API}${check}` : `data:image/png;base64,${User.avatarBase256ImagePath}`),
                                                priority: FastImage.priority.high,
                                                cache: FastImage.cacheControl.immutable,
                                            }}
                                            resizeMode="contain"
                                            style={{ width: vw(25), height: vw(25), borderRadius: vw(15) }}
                                        />
                                    </View>
                                    <View style={{ alignSelf: 'center', justifyContent: 'center', paddingHorizontal: vw(2) }}>
                                        <View style={{ paddingBottom: vw(1) }}>
                                            <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 16 }}>{User.userName}</Text>
                                        </View>
                                        <View style={{ paddingBottom: vw(1) }}>
                                            <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 14 }}>{User.firstName} {User.lastName}</Text>
                                        </View>
                                        <View style={{ paddingBottom: vw(0) }}>
                                            <Text style={{ color: Style.defaultTxtColor, fontWeight: '500', fontSize: 12, marginRight: vw(2), width: vw(60), }} numberOfLines={3} >{User.about}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ height: vh(100), }}>
                            <ProfileScreenTabViews quib={QuibMovies} follower={Followers} followee={Followings} navi={navigation} followerId={User.id} />
                        </View>
                    </>
                    :
                    <View style={{ height: vh(100), justifyContent: 'center', alignItems: 'center', paddingBottom: vw(35), backgroundColor: Style.quibBackColor }}>
                        <Wave size={65} color={Style.defaultRed} animating={isLoaded} />
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Style.defaultRed,
        width: vw(20),
        height: vw(6),
        borderRadius: vw(2),
        // marginBottom: 10,
    },
    buttonTxt: {
        textAlign: 'center',
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold'
    },
    pagerView: {
        width: vw(100),
        height: vw(100)
    }
})