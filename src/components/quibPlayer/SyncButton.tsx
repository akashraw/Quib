import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { LocalSvg } from 'react-native-svg'
import { vw } from 'rxn-units'

type Sync = {
    isSync: boolean,
    isMovieSync: boolean,

}

export default function SyncButton(props: Sync) {
    if (props.isSync) {
        return (
            <TouchableOpacity>
                <LocalSvg
                    style={{ marginTop: vw(-2.5), marginLeft: vw(.6) }}
                    width={vw(10)}
                    height={vw(10)}
                    asset={require('../../assets/SVG/sync.svg')}
                />
            </TouchableOpacity>
        )
    } else if (props.isMovieSync == true) {
        return (
            <View style={{ position: 'absolute', justifyContent: 'center', width: vw(10), height: vw(10) }}>
                <TouchableOpacity activeOpacity={.5}>
                    <LocalSvg
                        style={{ marginBottom: vw(-2.5) }}
                        width={vw(10)}
                        height={vw(10)}
                        asset={require('../../assets/SVG/movie-sync-up.svg')}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <LocalSvg
                        style={{ marginTop: vw(-2.5), marginLeft: vw(.6) }}
                        width={vw(10)}
                        height={vw(10)}
                        asset={require('../../assets/SVG/movie-sync-down.svg')}
                    />
                </TouchableOpacity>
            </View>
        )
    }
    else return (
        <View style={{ position: 'absolute', justifyContent: 'center', width: vw(10), height: vw(10) }}>
                <TouchableOpacity activeOpacity={.5}>
                    <LocalSvg
                        style={{ marginBottom: vw(-2.5) }}
                        width={vw(10)}
                        height={vw(10)}
                        asset={require('../../assets/SVG/quib-sync-up.svg')}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <LocalSvg
                        style={{ marginTop: vw(-2.5), marginLeft: vw(.6) }}
                        width={vw(10)}
                        height={vw(10)}
                        asset={require('../../assets/SVG/quib-sync-down.svg')}
                    />
                </TouchableOpacity>
            </View>
    )
}

const styles = StyleSheet.create({})