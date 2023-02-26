import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Style } from '../../constants/Styles'
import { vh, vw } from 'rxn-units'
import OtherProfileScreenTabViews from './OtherProfileScreensTabViews'
import { Shadow } from 'react-native-shadow-2'
import { FollowUser, getFolloweeByUserId, getFollowersByUserId, getMovieByUserId, getOtherUserById, getUserById } from '../../services/QuibAPIs'
import { AuthContext } from '../../Auth'
import { FollowUserAPI, isUserFollowedAPI, UnFollowUserAPI } from '../../constants/Api'
import Toast from 'react-native-toast-message'
import { Wave } from 'react-native-animated-spinkit'

interface props {
    navigation: any,
    route: any,
}
type QuibFollow = {
    FollowerId: string,
    FolloweeId: string,

}

export default function OtherProfileScreen({ navigation, route }: props) {
    const [User, setUser] = useState<any>([]);
    const [IsUserFollowed, setIsUserFollowed] = useState<boolean>()
    const [IsFollow, setIsFollow] = useState('Follow');
    const [Followings, setFollowings] = useState<any[]>([]);
    const [Followers, setFollowers] = useState<any[]>([]);
    const [QuibMovies, setQuibMovies] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const userId = route.params.userId;
    const Auth = React.useContext(AuthContext);
    const user = Auth.userName;

    useEffect(() => {
        Promise.all([
            isUserFollowed({ FolloweeId: userId, FollowerId: user }),
            getMovieByUserId({ userId: userId }).then((res) => { setQuibMovies(res) }),
            getFollowersByUserId({ userId: userId }).then((res) => { setFollowers(res) }),
            getFolloweeByUserId({ userId: userId }).then((res) => { setFollowings(res) }),
            getUserById({ userId: userId }).then((res) => setUser(res))
        ]).then(() => setIsLoaded(true)).then(() => console.log(User.id))
    }, [IsUserFollowed])

    //*********************************************************************************************\\
    async function isUserFollowed(Quib: QuibFollow) {
        const headerOption = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        try {
            let response = await fetch(`${isUserFollowedAPI}?FollowerId=${Quib.FollowerId}&FolloweeId=${Quib.FolloweeId}`, headerOption);
            let json = await response.json();
            if (response.status == 200) {
                if (json == true)
                    return setIsUserFollowed(true)
                else return setIsUserFollowed(false)
            } else {
                Toast.show({
                    visibilityTime: 5000,
                    autoHide: true,
                    type: 'error',
                    text1: 'Error',
                    text2: 'Something went wrong!',
                })
            }
            // return json;
        } catch (error) {
            console.log('isUserFollowed Api call: ' + error)
        }
    }


    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\
    async function FollowUser(Quib: QuibFollow) {
        const headerOption = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        try {
            let response = await fetch(`${FollowUserAPI}?FollowerId=${Quib.FollowerId}&FolloweeId=${Quib.FolloweeId}`, headerOption);
            if (response.status == 200) {
                setIsUserFollowed(true)
            } else {
                Toast.show({
                    visibilityTime: 5000,
                    autoHide: true,
                    type: 'error',
                    text1: 'Error',
                    text2: 'Something went wrong!',
                })
            }
            // json = await response.json();
            // return json;
        } catch (error) {
            console.log('FollowUser Api call: ' + error)
        }
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\\
    async function UnFollowUser(Quib: QuibFollow) {
        const headerOption = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        try {
            let response = await fetch(`${UnFollowUserAPI}?FollowerId=${Quib.FollowerId}&FolloweeId=${Quib.FolloweeId}`, headerOption);
            if (response.status == 200) {
                setIsUserFollowed(false)
            } else {
                Toast.show({
                    visibilityTime: 5000,
                    autoHide: true,
                    type: 'error',
                    text1: 'Error',
                    text2: 'Something went wrong!',
                })
            }
            // json = await response.json();
            // return json;
        } catch (error) {
            console.log('unFollowUser Api call: ' + error)
        }
    }


    return (
        <SafeAreaView style={{}}>
            {
                isLoaded ?
                    <View style={{ paddingVertical: vw(3), backgroundColor: Style.quibBackColor }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3) }}>
                            <View style={{ flex: 1, }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: vw(2) }}>
                                    <View style={{ paddingHorizontal: vw(2) }}>
                                        <Shadow distance={5}>
                                            <Image
                                                source={require('../../assets/Movie/arrival.jpeg')}
                                                style={{ width: vw(25), height: vw(25), borderRadius: vw(15) }}
                                            />
                                        </Shadow>
                                    </View>
                                    <View style={{ alignSelf: 'center', justifyContent: 'center', paddingHorizontal: vw(2) }}>
                                        <View style={{ paddingBottom: vw(1) }}>
                                            <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 16 }}>{User.userName}</Text>
                                        </View>
                                        <View style={{ paddingBottom: vw(1) }}>
                                            <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 14 }}>{User.firstName} {User.lastName}</Text>
                                        </View>
                                        <View style={{ paddingBottom: vw(0) }}>
                                            <Text style={{ color: Style.defaultTxtColor, fontWeight: '500', fontSize: 12, marginRight: vw(2), width: vw(60), }} numberOfLines={3} >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Leo in vitae turpis massa sed elementum tempus.</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', paddingBottom: vw(5), alignSelf: 'flex-start' , marginTop:vw(2)}}>
                                            {/* <View style={{ padding) }}> */}
                                                {
                                                    IsUserFollowed ?
                                                        <TouchableOpacity activeOpacity={.4} onPress={() => UnFollowUser({ FolloweeId: User.id, FollowerId: user })}>
                                                            <View style={styles.buttonFollowing}>
                                                                <Text style={styles.buttonTxtFollowing}>Following</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity activeOpacity={.4} onPress={() => FollowUser({ FolloweeId: User.id, FollowerId: user })}>
                                                            <View style={styles.buttonFollow}>
                                                                <Text style={styles.buttonTxtFollow}>Follow</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                }

                                            {/* </View> */}
                                            {/* <View style={{ padding: vw(2) }}>
                                <QuibButton text='Log Out' onPress={'Join'} viewStyle={styles.button} textStyle={styles.buttonTxt as any} />
                            </View> */}
                                        </View>
                                    </View>
                                </View>

                            </View>
                        </View>
                        <View style={{ height: vh(100), }}>
                            <OtherProfileScreenTabViews quib={QuibMovies} followee={Followings} follower={Followers} navi={navigation} followerId={User.id} />
                        </View>
                    </View>
                    :
                    <View style={{ height: vh(100), justifyContent: 'center', alignItems: 'center', paddingBottom: vw(35), backgroundColor: Style.quibBackColor }}>
                        <Wave size={65} color={Style.defaultRed} animating={isLoaded} />
                    </View>
            }
            <Toast />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    buttonFollow: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Style.defaultRed,
        width: vw(22),
        height: vw(7),
        borderRadius: vw(2),
        // marginBottom: 10,
    },
    buttonTxtFollow: {
        textAlign: 'center',
        fontSize: 14,
        color: '#fff',
        fontWeight: '500'
    },
    buttonFollowing: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Style.quibHeader,
        width: vw(22),
        height: vw(7),
        borderRadius: vw(2),
        // marginBottom: 10,
    },
    buttonTxtFollowing: {
        textAlign: 'center',
        fontSize: 14,
        color: Style.defaultRed,
        fontWeight: '500'
    },
    pagerView: {
        width: vw(100),
        height: vw(100)
    }
})

