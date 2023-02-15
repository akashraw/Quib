import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function QuibCarouselScrubber() {
    return (
        <></>
        // <View style={{
        //     position: 'absolute', borderTopLeftRadius: vw(8), borderTopRightRadius: vw(8),
        //     borderTopWidth: 0, borderTopColor: 'black', bottom: 0,
        //     overflow: 'hidden', width: vw(100), flexDirection: 'row', height: vh(21), zIndex: 100
        // }}>
        //     <BlurView
        //         style={{ height: vh(21), width: vw(100), }}
        //         blurType="light"
        //         blurAmount={10}
        //         reducedTransparencyFallbackColor='#00000000'
        //         overlayColor='#00000000'
        //     >
        //         <LinearGradient colors={['#00000020', Style.quibHeaderGrad, '#000000']} style={{ flex: 1, width: vw(100), backgroundColor: '#00000000' }} >
        //             <Slider
        //                 maximumValue={MovieLen.current}
        //                 minimumTrackTintColor='#00000000'
        //                 maximumTrackTintColor='#00000000'
        //                 // minimumTrackTintColor={Style.defaultRed}
        //                 // maximumTrackTintColor={Style.defaultTxtColor}
        //                 containerStyle={{ width: vw(85), }}
        //                 value={QuibTime}
        //                 onSlidingStart={() => isActive.current = false}
        //                 trackClickable={false}
        //                 step={1}
        //                 onSlidingComplete={value => {
        //                     value = Array.isArray(value) ? value[0] : value;
        //                     setQuibTime(value);
        //                     const Reduce = movieQuib.reduce((accumulator, current) => {
        //                         const val = Array.isArray(value) ? value[0] : value;
        //                         return Math.abs(current.time - val) < Math.abs(accumulator.time - val) ? (current) : (accumulator);
        //                     })
        //                     const ScurbIndex = movieQuib.findIndex((item, index) => {
        //                         if (item.time == Reduce.time) {

        //                             console.log(Reduce.time)
        //                             console.log(index)
        //                             // quibScrubIndexRef.current = index;
        //                             return index;
        //                         }
        //                     })
        //                     if (ScurbIndex < 0) {
        //                         flatRef.current?.scrollToOffset({
        //                             animated: true,
        //                             offset: 0
        //                         })
        //                     }
        //                     else {
        //                         toggle;
        //                         flatRef.current?.scrollToIndex({
        //                             animated: true,
        //                             index: ScurbIndex
        //                         })
        //                     }
        //                 }
        //                 }
        //                 renderThumbComponent={() => {
        //                     // if (!AllSync) {                  //used for dualSync

        //                     if (QuibTime == MovieTime) {
        //                         return <Image source={require('../../assets/bottom.png')}
        //                             style={{ width: vw(5), marginLeft: vw(-3), left: vw(2.5), height: vw(5), resizeMode: 'contain', bottom: vw(2), }}
        //                         />
        //                     } else return <Image source={require('../../assets/bottom_line.png')}
        //                         style={{ width: vw(5), marginLeft: vw(-3), left: vw(2.5), height: vw(5), resizeMode: 'contain', bottom: vw(2), }}
        //                     />
        //                     // } else return null
        //                 }}
        //                 trackStyle={{ marginLeft: vw(1), }}
        //                 animateTransitions={true}
        //             />
        //             </LinearGradient>
        //             </BlurView>
        //         </View>
                )
}

                const styles = StyleSheet.create({ })