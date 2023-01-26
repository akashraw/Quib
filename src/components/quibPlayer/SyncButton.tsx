import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { LocalSvg } from 'react-native-svg'
import { vw } from 'rxn-units'

type Sync = {
    isSync: boolean,
    isMovieSync: boolean,
    syncMovie?: (event: GestureResponderEvent) => void,
    syncQuib?: (event: GestureResponderEvent) => void,
    // onLongPress?: (event: GestureResponderEvent) => void,
    toggleAllSync?: (event: GestureResponderEvent) => void,
    movieTime: number,
    quibTime: number,
    isMovieMove?: boolean,
    isQuibMove?: boolean,
}

export default function SyncButton(props: Sync) {
    const checkSync = () => {

    }
    if (props.isSync) {
        return (
            <TouchableOpacity onPress={props.toggleAllSync} >
                <LocalSvg
                    style={{ marginTop: vw(-1), marginLeft: vw(0) }}
                    width={vw(20)}
                    height={vw(20)}
                    asset={require('../../assets/SVG/sync.svg')}
                />
            </TouchableOpacity>
        )
    } else if (props.movieTime === props.quibTime) {
        return (
            <View style={{ position: 'absolute', justifyContent: 'center', width: vw(19), height: vw(19),  }}>
                <TouchableOpacity onLongPress={props.toggleAllSync} >
                    <LocalSvg
                        style={{ marginBottom: vw(-4.5), }}
                        width={vw(19)}
                        height={vw(19)}
                        asset={require('../../assets/SVG/movie-sync-up.svg')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onLongPress={props.toggleAllSync}>
                    <LocalSvg
                        style={{ marginTop: vw(-4.5), marginLeft: vw(1) }}
                        width={vw(19)}
                        height={vw(19)}
                        asset={require('../../assets/SVG/quib-sync-down.svg')}
                    // asset={require('../../assets/SVG/movie-sync-down.svg')}
                    />
                </TouchableOpacity>
            </View>
        )
    }
    else if (props.isMovieMove == true && props.isQuibMove==false) return (
        <View style={{ position: 'absolute', justifyContent: 'center', width: vw(19), height: vw(19) }}>
            <TouchableOpacity onLongPress={props.toggleAllSync} onPress={props.syncQuib} >
                <LocalSvg
                    style={{ marginBottom: vw(-4.5), }}
                    width={vw(19)}
                    height={vw(19)}
                    asset={require('../../assets/SVG/quib-sync-up.svg')}
                />
            </TouchableOpacity>
            <TouchableOpacity onLongPress={props.toggleAllSync} onPress={props.syncMovie}>
                <LocalSvg
                    style={{ marginTop: vw(-4.5), marginLeft: vw(1) }}
                    width={vw(19)}
                    height={vw(19)}
                    asset={require('../../assets/SVG/quib-sync-down.svg')}
                />
            </TouchableOpacity>
        </View>
    )
    else if (props.isMovieMove == false && props.isQuibMove==true) return (
        <View style={{ position: 'absolute', justifyContent: 'center', width: vw(19), height: vw(19) }}>
            <TouchableOpacity onPress={props.syncQuib} onLongPress={props.toggleAllSync} >
                <LocalSvg
                    style={{ marginBottom: vw(-4.5), }}
                    width={vw(19)}
                    height={vw(19)}
                    asset={require('../../assets/SVG/movie-sync-up.svg')}
                />
            </TouchableOpacity>
            <TouchableOpacity onLongPress={props.toggleAllSync} onPress={props.syncMovie}>
                <LocalSvg
                    style={{ marginTop: vw(-4.5), marginLeft: vw(1) }}
                    width={vw(19)}
                    height={vw(19)}
                    //asset={require('../../assets/SVG/quib-sync-down.svg')}
                    asset={require('../../assets/SVG/movie-sync-down.svg')}
                />
            </TouchableOpacity>
        </View>
    )
    else return (
        <View style={{ position: 'absolute', justifyContent: 'center', width: vw(19), height: vw(19) }}>
            <TouchableOpacity onPress={props.syncQuib} onLongPress={props.toggleAllSync} >
                <LocalSvg
                    style={{ marginBottom: vw(-4.5), }}
                    width={vw(19)}
                    height={vw(19)}
                    asset={require('../../assets/SVG/quib-sync-up.svg')}
                />
            </TouchableOpacity>
            <TouchableOpacity onLongPress={props.toggleAllSync} onPress={props.syncMovie}>
                <LocalSvg
                    style={{ marginTop: vw(-4.5), marginLeft: vw(1) }}
                    width={vw(19)}
                    height={vw(19)}
                    //asset={require('../../assets/SVG/quib-sync-down.svg')}
                    asset={require('../../assets/SVG/movie-sync-down.svg')}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({})