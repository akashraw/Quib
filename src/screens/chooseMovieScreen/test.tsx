import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { vw, vh } from 'rxn-units';

export default function SkeletonLoader() {

  return (
      // <SkeletonPlaceholder borderRadius={4}  >
      //   <SkeletonPlaceholder.Item alignItems='center' justifyContent='space-between' flexDirection='row' paddingVertical={vw(5)} paddingHorizontal={vw(3)}>
      //     <SkeletonPlaceholder.Item flex={1}>
      //       <SkeletonPlaceholder.Item flexDirection='row' alignItems='center' paddingTop={vw(2)} >
      //         <SkeletonPlaceholder.Item marginLeft={vw(2)} paddingHorizontal={vw(3)} width={vw(25)} height={vw(25)} borderRadius={vw(15)} />
      //         <SkeletonPlaceholder.Item alignSelf='center' justifyContent='center' paddingHorizontal={vw(2)}>
      //           <SkeletonPlaceholder.Item marginHorizontal={vw(2)} width={vw(28)} height={vw(4)} borderRadius={vw(2)} />
      //           <SkeletonPlaceholder.Item marginHorizontal={vw(2)} width={vw(28)} height={vw(4)} borderRadius={vw(2)} marginTop={vw(2)} />
      //           <SkeletonPlaceholder.Item marginHorizontal={vw(2)} width={vw(40)} height={vw(8)} borderRadius={vw(2)} marginTop={vw(2)} />
      //         </SkeletonPlaceholder.Item>
      //       </SkeletonPlaceholder.Item>
      //     </SkeletonPlaceholder.Item>
      //     <SkeletonPlaceholder.Item height={vw(12)} width={vw(95)} marginTop={vw(2)} />
      //   </SkeletonPlaceholder.Item>
      // </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
                <SkeletonPlaceholder.Item alignItems="center">
                    <SkeletonPlaceholder.Item alignItems='center'>
                        <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' flexDirection='row' width={vw(95)} marginTop={vw(2)} marginBottom={vw(2)}>
                            <SkeletonPlaceholder.Item marginLeft={vw(2)} marginHorizontal={vw(2)} width={vw(28)} height={vw(40)} borderRadius={vw(2)} />
                            <SkeletonPlaceholder.Item marginHorizontal={vw(2)} width={vw(28)} height={vw(40)} borderRadius={vw(2)} />
                            <SkeletonPlaceholder.Item marginHorizontal={vw(2)} width={vw(28)} height={vw(40)} borderRadius={vw(2)} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({})