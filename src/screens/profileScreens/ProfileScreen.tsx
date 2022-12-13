import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Slider } from '@miblanchard/react-native-slider';

export default function ProfileScreen() {
  const [Val, setVal] = useState(.2)
  return (
    <View style={styles.container}>
        <Slider
            value={Val}
            onValueChange={value => setVal(value as number)}
        />
        <Text>Value: {Val}</Text>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
});

