import * as React from 'react';
import { View, useWindowDimensions, Text, StatusBar, Animated, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlatList } from 'react-native-gesture-handler';
import { TabView, SceneMap, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import { vh, vw } from 'rxn-units';
import { API } from '../../constants/Api';
import { Style } from '../../constants/Styles';
import MovieCard from '../visitScreens/MovieCard';

const Dummy = [
    { key: 1, title: 'Arrival', year: 2015, director: 'Test Testing' },
    { key: 2, title: 'Arrival', year: 2015, director: 'Test Testing' },
    { key: 3, title: 'Arrival', year: 2015, director: 'Test Testing' },
    { key: 4, title: 'Arrival', year: 2015, director: 'Test Testing' },
    { key: 5, title: 'Arrival', year: 2015, director: 'Test Testing' },
    { key: 6, title: 'Arrival', year: 2015, director: 'Test Testing' },
    { key: 7, title: 'Arrival', year: 2015, director: 'Test Testing' },
    { key: 8, title: 'Arrival', year: 2015, director: 'Test Testing' },
    { key: 9, title: 'Arrival', year: 2015, director: 'Test Testing' },
    { key: 10, title: 'Arrival', year: 2015, director: 'Test Testing' },
    { key: 11, title: 'Arrival', year: 2015, director: 'Test Testing' },
    { key: 12, title: 'Arrival', year: 2015, director: 'Test Testing' },
]

type Route = {
    key: string;
    title: string;
    // icon: React.ComponentProps<typeof Ionicons>['name'];
};

type State = NavigationState<Route>;

const Quibbed = () => {
    return (
        // <View style={{ backgroundColor: Style.quibHeader, width: vw(95), height: vw(10), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3), alignSelf: 'center', alignItems: 'center', marginTop: vw(3), paddingLeft: vw(3) }}>
        //     <Text style={{ color: Style.defaultRed, fontSize: 18, fontWeight: 'bold' }}>Quibbed</Text>
        //     <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
        //         <Text style={{ color: Style.defaultTxtColor, fontSize: 18, fontWeight: 'normal' }}>0</Text>
        //         <Icon name='chevron-right' color={Style.defaultTxtColor} size={18} style={{ paddingTop: vw(.6), paddingLeft: vw(4) }} />
        //     </View>
        // </View>
        <View>
            <FlatList
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                data={Dummy}
                numColumns={3}
                renderItem={({ item, index }: any) => (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}><MovieCard key={index} title={item.title} year={item.year} director={item.director} /></View>)}
            />
        </View>
    )
}
const Following = () => {
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
const Followers = () => {
    return (
        <TouchableOpacity
        //  onPress={() => props.navigation.navigate("Qplayer", { MovieId: item.id, Movietitle: item.title})}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems:'center', alignSelf:'center' }}>
                {/* bannner top */}
                <View style={styles.movieBanner}>
                    <Image
                        style={{ width: vw(15), height: vw(15), borderRadius:vw(7), marginHorizontal: vw(2), resizeMode: 'contain' }}
                        //   resizeMode={FastImage.resizeMode.contain}
                        source={require('../../assets/Movie/arrival.jpeg')} />
                    <View>
                        <Text style={[styles.title, styles.txt, {fontSize:14}]}>@itzTimmy</Text>
                        <Text style={[styles.year, styles.txt, {fontSize:12, textAlign:'center'}]}>Timithoe</Text>
                    </View>
                </View>
                <View>
                    
                </View>
            </View>
        </TouchableOpacity>
    )
}


export default function ProfileScreenTabViews() {
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
                            <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
                        </Animated.View>
                        <Animated.View
                            style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}
                        >
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
            swipeEnabled={false}
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
        borderRadius: vw(1),
        marginBottom: vw(2),
        marginHorizontal: vw(1),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Style.quibPlayColor,
        elevation: 2,
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
        alignSelf:'center',
        width: vw(95),
        height: vw(18),
        borderRadius: vw(2),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent:'center',
        elevation: 2,
        zIndex: 2,
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