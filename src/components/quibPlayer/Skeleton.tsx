import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Style } from '../../constants/Styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vw, vh } from 'rxn-units';

export default function Skeleton() {

    return (
            <SkeletonPlaceholder borderRadius={4}>
                <SkeletonPlaceholder.Item alignItems="center">
                    <SkeletonPlaceholder.Item alignItems='center'>
                        <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' flexDirection='row' width={vw(95)} marginTop={vw(2)} marginBottom={vw(2)}>
                            <SkeletonPlaceholder.Item marginLeft={vw(2)} marginHorizontal={vw(2)} width={vw(90)} height={vw(60)} borderRadius={vw(2)} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
    );
};

const styles = StyleSheet.create({})