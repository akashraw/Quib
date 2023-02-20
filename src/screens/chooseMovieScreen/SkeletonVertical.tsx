import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { vh, vw } from 'rxn-units'

export default function SkeletonVertical() {
    return (
        <SkeletonPlaceholder borderRadius={4}>
            <SkeletonPlaceholder.Item alignItems="center">
                <SkeletonPlaceholder.Item alignItems='center' marginTop={vw(0)}>
                    <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' flexDirection='row' width={vw(95)} height={vh(12)} borderRadius={vw(2)} marginTop={vw(3)} />
                    <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' flexDirection='row' width={vw(95)} height={vh(12)} borderRadius={vw(2)} marginTop={vw(3)} />
                    <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' flexDirection='row' width={vw(95)} height={vh(12)} borderRadius={vw(2)} marginTop={vw(3)} />
                    <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' flexDirection='row' width={vw(95)} height={vh(12)} borderRadius={vw(2)} marginTop={vw(3)} />
                    <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' flexDirection='row' width={vw(95)} height={vh(12)} borderRadius={vw(2)} marginTop={vw(3)} />
                    <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' flexDirection='row' width={vw(95)} height={vh(12)} borderRadius={vw(2)} marginTop={vw(3)} />
                    <SkeletonPlaceholder.Item alignItems='center' justifyContent='center' flexDirection='row' width={vw(95)} height={vh(12)} borderRadius={vw(2)} marginTop={vw(3)} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    )
}

const styles = StyleSheet.create({})