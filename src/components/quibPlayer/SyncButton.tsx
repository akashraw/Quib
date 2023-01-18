import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { LocalSvg } from 'react-native-svg'
import { vw } from 'rxn-units'

type Sync = {
    isSync: boolean,
    isMovieSync: boolean,
    onPress?: (event: GestureResponderEvent) => void,
    onLongPress?: (event: GestureResponderEvent) => void,
    disableAllSync?: (event: GestureResponderEvent) => void,
}

export default function SyncButton(props: Sync) {
    if (props.isSync) {
        return (
            <TouchableOpacity onPress={props.disableAllSync} >
                <LocalSvg
                    style={{ marginTop: vw(-1), marginLeft: vw(0) }}
                    width={vw(17)}
                    height={vw(17)}
                    asset={require('../../assets/SVG/sync.svg')}
                />
            </TouchableOpacity>
        )
    } else if (props.isMovieSync == true) {
        return (
            <View style={{ position: 'absolute', justifyContent: 'center', width: vw(16), height: vw(15) }}>
                <TouchableOpacity onPress={props.onPress} onLongPress={props.onLongPress} activeOpacity={.5}>
                    <LocalSvg
                        style={{ marginBottom: vw(-4) ,   }}
                        width={vw(16)}
                        height={vw(16)}
                        asset={require('../../assets/SVG/movie-sync-up.svg')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onLongPress={props.onLongPress} onPress={props.onPress}>
                    <LocalSvg
                        style={{ marginBottom: vw(-4) , marginLeft:vw(1)  }}
                        width={vw(16)}
                        height={vw(16)}
                        asset={require('../../assets/SVG/movie-sync-down.svg')}
                    />
                </TouchableOpacity>
            </View>
        )
    }
    else return (
        <View style={{ position: 'absolute', justifyContent: 'center', width: vw(16), height: vw(16) , paddingBottom:vw(1)}}>
            <TouchableOpacity onLongPress={props.onLongPress} onPress={props.onPress} activeOpacity={.5}>
                <LocalSvg
                    style={{ marginBottom: vw(-4) , }}
                    width={vw(16)}
                    height={vw(16)}
                    asset={require('../../assets/SVG/quib-sync-up.svg')}
                />
            </TouchableOpacity>
            <TouchableOpacity onLongPress={props.onLongPress} onPress={props.onPress}>
                <LocalSvg
                    style={{ marginTop: vw(-4), marginLeft:vw(1)}}
                    width={vw(16)}
                    height={vw(16)}
                    asset={require('../../assets/SVG/quib-sync-down.svg')}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({})