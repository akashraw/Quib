import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Style } from '../../constants/Styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vw, vh } from 'rxn-units';

export default function SkeletonLoader() {

  return (
    <SafeAreaView>
      <SkeletonPlaceholder borderRadius={4}>
        <SkeletonPlaceholder.Item alignItems="center">
          <SkeletonPlaceholder.Item alignItems='center'>
            {/* <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' flexDirection='row' width={vw(95)} height={vh(12)} borderRadius={vw(2)} >
              <SkeletonPlaceholder.Item width={vw(15)} height={vw(20)} borderRadius={vw(2)} />
              <SkeletonPlaceholder.Item alignItems='flex-start' flexDirection='column' marginHorizontal={vw(2)} >
                <SkeletonPlaceholder.Item width={vw(55)} height={vw(3.5)} borderRadius={vw(1)} />
                <SkeletonPlaceholder.Item width={vw(20)} height={vw(3)} borderRadius={vw(1)} marginTop={vw(1)} />
                <SkeletonPlaceholder.Item width={vw(20)} height={vw(3)} borderRadius={vw(1)} marginTop={vw(1)} />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item alignItems='center' alignSelf='center' width={vw(16)} height={vw(16)} borderRadius={vw(2)} />
            </SkeletonPlaceholder.Item> */}
            <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' flexDirection='row' width={vw(95)} marginTop={vw(2)}>
              <SkeletonPlaceholder.Item marginLeft={vw(2)} marginHorizontal={vw(2)} width={vw(28)} height={vw(40)} borderRadius={vw(2)} />
              <SkeletonPlaceholder.Item marginHorizontal={vw(2)} width={vw(28)} height={vw(40)} borderRadius={vw(2)} />
              <SkeletonPlaceholder.Item marginHorizontal={vw(2)} width={vw(28)} height={vw(40)} borderRadius={vw(2)} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
      {/* <SkeletonPlaceholder borderRadius={4} >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 60, height: 60, borderRadius: 50 }} />
          <View style={{ marginLeft: 20 }}>
            <Image style={{ width: 120, height: 20 }} />
            <Text style={{ marginTop: 6, fontSize: 14, color: Style.defaultRed, lineHeight: 18 }}>Hello world</Text>
          </View>
        </View>
      </SkeletonPlaceholder> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({})