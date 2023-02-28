import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Style } from '../../constants/Styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vw, vh } from 'rxn-units';
import ProfileScreenTabViews from '../profileScreens/ProfileScreenTabViews';

export default function SkeletonLoader() {

  return (
    <SkeletonPlaceholder borderRadius={4}>
      <>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: vw(3), marginVertical: vw(3) }}>
          <View style={{ flex: 1, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: vw(2) }}>
              <View style={{ paddingHorizontal: vw(2) }}>
                <Image
                  resizeMode="contain"
                  style={{ width: vw(25), height: vw(25), borderRadius: vw(15) }}
                />
              </View>
              <View style={{ alignSelf: 'center', justifyContent: 'center', paddingHorizontal: vw(2) }}>
                <View style={{ paddingBottom: vw(1) }}>
                  <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 16 }}></Text>
                </View>
                <View style={{ paddingBottom: vw(1) }}>
                  <Text style={{ color: Style.defaultTxtColor, fontWeight: 'bold', fontSize: 14 }}></Text>
                </View>
                <View style={{ paddingBottom: vw(0) }}>
                  <Text style={{ color: Style.defaultTxtColor, fontWeight: '500', fontSize: 12, marginRight: vw(2), width: vw(60), }} numberOfLines={3} ></Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            
          </View>
        </View>
      </>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({})