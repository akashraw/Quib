// import * as React from 'react';
// import {
//     Animated,
//     View,
//     Text,
//     TouchableWithoutFeedback,
//     StyleSheet,
// } from 'react-native';
// import {
//     TabView,
//     SceneMap,
//     NavigationState,
//     SceneRendererProps,
// } from 'react-native-tab-view';
// import Icon from 'react-native-vector-icons/FontAwesome'
// import { vw } from 'rxn-units'
// import { Style } from '../../constants/Styles'

// type Route = {
//     key: string;
//     title: string;
//     //   icon: React.ComponentProps<typeof Ionicons>['name'];
// };

// type State = NavigationState<Route>;


// const Quibbed = () => {
//     return (
//         <View style={{ backgroundColor: Style.quibHeader, width: vw(95), height: vw(10), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3), alignSelf: 'center', alignItems: 'center', marginTop: vw(3), paddingLeft: vw(3) }}>
//             <Text style={{ color: Style.defaultRed, fontSize: 18, fontWeight: 'bold' }}>Quibbed</Text>
//             <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
//                 <Text style={{ color: Style.defaultTxtColor, fontSize: 18, fontWeight: 'normal' }}>0</Text>
//                 <Icon name='chevron-right' color={Style.defaultTxtColor} size={18} style={{ paddingTop: vw(.6), paddingLeft: vw(4) }} />
//             </View>
//         </View>
//     )
// }
// const Following = () => {
//     return (
//         <View style={{ backgroundColor: Style.quibHeader, width: vw(95), height: vw(10), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3), alignSelf: 'center', alignItems: 'center', marginTop: vw(3), paddingLeft: vw(3) }}>
//             <Text style={{ color: Style.defaultRed, fontSize: 18, fontWeight: 'bold' }}>Following</Text>
//             <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
//                 <Text style={{ color: Style.defaultTxtColor, fontSize: 18, fontWeight: 'normal' }}>0</Text>
//                 <Icon name='chevron-right' color={Style.defaultTxtColor} size={18} style={{ paddingTop: vw(.6), paddingLeft: vw(4) }} />
//             </View>
//         </View>
//     )
// }
// const Followers = () => {
//     return (

//         <View style={{ backgroundColor: Style.quibHeader, width: vw(95), height: vw(10), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3), alignSelf: 'center', alignItems: 'center', marginTop: vw(3), paddingLeft: vw(3) }}>
//             <Text style={{ color: Style.defaultRed, fontSize: 18, fontWeight: 'bold' }}>Followers</Text>
//             <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
//                 <Text style={{ color: Style.defaultTxtColor, fontSize: 18, fontWeight: 'normal' }}>0</Text>
//                 <Icon name='chevron-right' color={Style.defaultTxtColor} size={18} style={{ paddingTop: vw(.6), paddingLeft: vw(4) }} />
//             </View>
//         </View>
//     )
// }


// export default function CustomTabBarExample() {
//     const [navigation, setNavigation] = React.useState({
//         index: 0,
//         routes: [
//             { key: 'first', title: 'Quibbed' },
//             { key: 'second', title: 'Following' },
//             { key: 'thrid', title: 'Followers' },
//         ],
//     });
//     // const [index, onIndexChange] = React.useState(0);
//     // const [routes] = React.useState<Route[]>([
//     //     { key: 'first', title: 'Quibbed' },
//     //     { key: 'second', title: 'Following' },
//     //     { key: 'thrid', title: 'Followers' },
//     // ]);

//     // const renderItem =
//     //     ({
//     //         navigationState,
//     //         position,
//     //     }: {
//     //         navigationState: State;
//     //         position: Animated.AnimatedInterpolation<number>;
//     //     }) =>
//     //         ({ route, index }: { route: Route; index: number }) => {
//     //             const inputRange = navigationState.routes.map((_, i) => i);

//     //             const activeOpacity = position.interpolate({
//     //                 inputRange,
//     //                 outputRange: inputRange.map((i: number) => (i === index ? 1 : 0)),
//     //             });
//     //             const inactiveOpacity = position.interpolate({
//     //                 inputRange,
//     //                 outputRange: inputRange.map((i: number) => (i === index ? 0 : 1)),
//     //             });

//     //             return (
//     //                 <View style={styles.tab}>
//     //                     <Animated.View style={[styles.item, { opacity: inactiveOpacity }]}>

//     //                         <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
//     //                     </Animated.View>
//     //                     <Animated.View
//     //                         style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}
//     //                     >
//     //                         <Text style={[styles.label, styles.active]}>{route.title}</Text>
//     //                     </Animated.View>
//     //                 </View>
//     //             );
//     //         };

//     // const renderTabBar = (
//     //     props: SceneRendererProps & { navigationState: State }
//     // ) => (
//     //     <View style={styles.tabbar}>
//     //         {props.navigationState.routes.map((route: Route, index: number) => {
//     //             return (
//     //                 <TouchableWithoutFeedback
//     //                     key={route.key}
//     //                     onPress={() => props.jumpTo(route.key)}
//     //                 >
//     //                     {renderItem(props)({ route, index })}
//     //                 </TouchableWithoutFeedback>
//     //             );
//     //         })}
//     //     </View>
//     // );

//     const renderScene = SceneMap({
//         first: Quibbed,
//         second: Following,
//         third: Followers,
//     });

//     return (
//         <TabView
//             navigationState={navigation}
//             renderScene={renderScene}
//             // tabBarPosition="bottom"
//             onIndexChange={index => {
//                 setNavigation({ ...navigation, index: index });
//             }
//         }
//         />
//     );
// };

// CustomTabBarExample.backgroundColor = '#fafafa';



// const styles = StyleSheet.create({
//     tabbar: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         backgroundColor: '#fafafa',
//     },
//     tab: {
//         flex: 1,
//         alignItems: 'center',
//         borderTopWidth: StyleSheet.hairlineWidth,
//         borderTopColor: 'rgba(0, 0, 0, .2)',
//     },
//     item: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingTop: 4.5,
//     },
//     activeItem: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//     },
//     active: {
//         color: '#0084ff',
//     },
//     inactive: {
//         color: '#939393',
//     },
//     icon: {
//         height: 26,
//         width: 26,
//     },
//     label: {
//         fontSize: 10,
//         marginTop: 3,
//         marginBottom: 1.5,
//         backgroundColor: 'transparent',
//     },
// });
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function ProfileScreenTabView() {
  return (
    <View>
      <Text>ProfileScreenTabView</Text>
    </View>
  )
}

const styles = StyleSheet.create({})