import * as React from 'react';
import { View, useWindowDimensions, Text, StatusBar, Animated, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { TabView, SceneMap, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import { vh, vw } from 'rxn-units';
import { Style } from '../../constants/Styles';

type Route = {
    key: string;
    title: string;
    // icon: React.ComponentProps<typeof Ionicons>['name'];
};

type State = NavigationState<Route>;

const Quibbed = () => {
    return (
        <TouchableOpacity
        //  onPress={() => props.navigation.navigate("Qplayer", { MovieId: item.id, Movietitle: item.title})}
        >
            <View style={{ margin: vw(2), flexDirection: 'row', justifyContent: 'center' }}>
                {/* bannner top */}
                <View style={styles.movieBanner}>
                    {/* <ImageBackground source={require('../../assets/Movie/arrival.jpeg')} style={{ width: vw(30), height: vw(40), justifyContent: 'flex-end' }} imageStyle={{ resizeMode: 'cover', alignSelf: 'center' }} >
                        <View style={{ alignItems: 'center', }}>
                            <Text style={[styles.title, styles.txt]}>Arrival</Text>
                            <Text style={[styles.year, styles.txt]}>2015</Text>
                            <Text style={[styles.director, styles.txt]}>test</Text>
                        </View>
                    </ImageBackground> */}
                    <Image
                        style={{ width: vw(30), height: vw(35), marginHorizontal: vw(2), resizeMode: 'cover', borderRadius: vw(1) }}
                        //   resizeMode={FastImage.resizeMode.contain}
                        source={require('../../assets/Movie/arrival.jpeg')}
                    />
                    <View style={{width:vw(30), overflow:'hidden'}}>
                        <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                            <Text style={[styles.title, styles.txt]} numberOfLines={1}>Arrival </Text>
                            <Text style={[styles.year, styles.txt]}>(2015) </Text>
                        </View>
                        <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                            <Text style={[styles.director, styles.txt,]}>Test Testing</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>

    )
}
const Following = () => {
    return (
        // <View style={{ backgroundColor: Style.quibHeader, width: vw(95), height: vw(10), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3), alignSelf: 'center', alignItems: 'center', marginTop: vw(3), paddingLeft: vw(3) }}>
        //     <Text style={{ color: Style.defaultRed, fontSize: 18, fontWeight: 'bold' }}>Following</Text>
        //     <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
        //         <Text style={{ color: Style.defaultTxtColor, fontSize: 18, fontWeight: 'normal' }}>0</Text>
        //         <Icon name='chevron-right' color={Style.defaultTxtColor} size={18} style={{ paddingTop: vw(.6), paddingLeft: vw(4) }} />
        //     </View>
        // </View>
        <TouchableOpacity
        //  onPress={() => props.navigation.navigate("Qplayer", { MovieId: item.id, Movietitle: item.title})}
        >
            <View style={{ margin: vw(2), flexDirection: 'row', justifyContent: 'center' }}>
                {/* bannner top */}
                <View style={styles.movieBanner}>
                    <Image
                        style={{ width: 45, height: 60, marginHorizontal: vw(2), resizeMode: 'contain' }}
                        //   resizeMode={FastImage.resizeMode.contain}
                        source={require('../../assets/Movie/arrival.jpeg')} />
                    <View>
                        <Text style={[styles.title, styles.txt]}>Arrival</Text>
                        <Text style={[styles.year, styles.txt]}>2015</Text>
                        <Text style={[styles.director, styles.txt]}>test</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}
const Followers = () => {
    return (
        <TouchableOpacity
        //  onPress={() => props.navigation.navigate("Qplayer", { MovieId: item.id, Movietitle: item.title})}
        >
            <View style={{ margin: vw(2), flexDirection: 'row', justifyContent: 'center' }}>
                {/* bannner top */}
                <View style={styles.movieBanner}>
                    <Image
                        style={{ width: 45, height: 60, marginHorizontal: vw(2), resizeMode: 'contain' }}
                        //   resizeMode={FastImage.resizeMode.contain}
                        source={require('../../assets/Movie/arrival.jpeg')} />
                    <View>
                        <Text style={[styles.title, styles.txt]}>Arrival</Text>
                        <Text style={[styles.year, styles.txt]}>2015</Text>
                        <Text style={[styles.director, styles.txt]}>test</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}


export default function QuibComposeTabView() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Quibbed' },
        { key: 'second', title: 'Following' },
        { key: 'thrid', title: 'Followers' },

    ]);

    const renderScene = SceneMap({
        first: Quibbed,
        second: Following,
        thrid: Followers,
    });
    const renderItem =
        ({
            navigationState,
            position,
        }: {
            navigationState: State;
            position: Animated.AnimatedInterpolation<number>;
        }) =>
            ({ route, index }: { route: Route; index: number }) => {
                const inputRange = navigationState.routes.map((_, i) => i);

                const activeOpacity = position.interpolate({
                    inputRange,
                    outputRange: inputRange.map((i: number) => (i === index ? 1 : 0)),
                });
                const inactiveOpacity = position.interpolate({
                    inputRange,
                    outputRange: inputRange.map((i: number) => (i === index ? 0 : 1)),
                });

                return (
                    <View style={styles.tab}>
                        <Animated.View style={[styles.item, { opacity: inactiveOpacity }]}>
                            {/* <Ionicons
              name={route.icon}
              size={26}
              style={[styles.icon, styles.inactive]}
            /> */}
                            <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
                        </Animated.View>
                        <Animated.View
                            style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}
                        >
                            {/* <Ionicons
              name={route.icon}
              size={26}
              style={[styles.icon, styles.active]}
            /> */}
                            <Text style={[styles.label, styles.active]}>{route.title}</Text>
                        </Animated.View>
                    </View>
                );
            };

    const renderTabBar = (
        props: SceneRendererProps & { navigationState: State }
    ) => (
        <View style={styles.tabbar}>
            {props.navigationState.routes.map((route: Route, index: number) => {
                return (
                    <TouchableWithoutFeedback
                        key={route.key}
                        onPress={() => props.jumpTo(route.key)}
                    >
                        {renderItem(props)({ route, index })}
                    </TouchableWithoutFeedback>
                );
            })}
        </View>
    );

    return (
        <TabView
            style={{ marginTop: StatusBar.currentHeight, }}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    );
}
const styles = StyleSheet.create({
    tabbar: {
        marginHorizontal: vw(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Style.quibPlayColor,
        elevation: 5,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
        shadowOffset: {
            height: StyleSheet.hairlineWidth,
            width: 0,
        },
        zIndex: 1,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(0, 0, 0, .2)',
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 0,
    },
    activeItem: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    active: {
        color: Style.defaultRed,
    },
    inactive: {
        color: '#939393',
    },
    icon: {
        height: 26,
        width: 26,
    },
    label: {
        fontSize: 18,
        marginVertical: vw(1.5),
        backgroundColor: 'transparent',
        fontWeight: 'bold'
    },
    movieBanner: {
        overflow: 'hidden',
        // overlayColor:,
        width: vw(38),
        height: vw(50),
        paddingTop: vw(2),
        borderRadius: vw(2),
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: Style.quibPlayColor,
        alignItems: 'center',
        elevation: 4,
        zIndex: 4,
    },
    txt: {
        fontSize: 14,
        color: Style.defaultTxtColor,
        fontWeight: 'bold',
        // textAlign: 'center'
    },
    title: {},
    year: {},
    director: {},
});