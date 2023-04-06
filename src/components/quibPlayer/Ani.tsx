import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import * as React from 'react';
import {
    Vibration,
    StatusBar,
    Easing,
    TextInput,
    Dimensions,
    Animated,
    TouchableOpacity,
    FlatList,
    Text,
    View,
    StyleSheet,
} from 'react-native';
import { vh } from 'rxn-units';
const { width, height } = Dimensions.get('window');
const colors = {
    black: '#323F4E',
    red: '#F76A6A',
    text: '#ffffff',
};


const timers = [...Array(13).keys()].map(i => (i === 0 ? 1 : i * 5));
const ITEM_SIZE = width * 0.38;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;


export default function Ani() {
    const scrollX = React.useRef(new Animated.Value(0)).current;
    return (
        <View style={styles.container}>
            <View
                style={{
                    height: vh(80),
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    // top: height / 3,
                    flex: 1,
                }}>
                <AnimatedFlashList
                    data={timers}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.toString()}
                    //   horizontal
                    //   onScroll={Animated.event(
                    //     [{nativeEvent: {contentOffset: {x: scrollX}}}],
                    //     {useNativeDriver: true},
                    //   )}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollX } } }],
                        { useNativeDriver: true }
                    )}
                    bounces={false}
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        paddingVertical: ITEM_SPACING,
                        paddingHorizontal: ITEM_SPACING,
                    }}
                    snapToInterval={ITEM_SIZE}
                    decelerationRate={'fast'}
                    renderItem={({ item, index }) => {
                        const inputRange = [
                            (index - 1) * ITEM_SIZE,
                            index * ITEM_SIZE,
                            (index + 1) * ITEM_SIZE,
                        ];
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.4, 1, 0.4],
                        });
                        const scale = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.7, 1, 0.7],
                        });
                        return (
                            <View
                                style={{
                                    flex: 1,
                                    width: ITEM_SIZE,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Animated.Text
                                    style={[
                                        styles.text,
                                        {
                                            opacity,
                                            transform: [{ scale }],
                                        },
                                    ]}>
                                    {item}
                                </Animated.Text>
                            </View>
                        );
                    }}
                />
                <Text style={styles.text}>1</Text>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
    },
    roundButton: {
        width: 80,
        height: 80,
        borderRadius: 80,
        backgroundColor: colors.red,
    },
    text: {
        fontSize: ITEM_SIZE * 0.8,
        fontFamily: 'Menlo',
        color: colors.text,
        fontWeight: '900',
    },
});
