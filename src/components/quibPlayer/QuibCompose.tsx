import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native'
import React, { memo, useRef, useState } from 'react'
import { vh, vw } from 'rxn-units';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Style } from '../../constants/Styles';
import { quibPlayerStyles } from './QuibPlayerStyle';

type FD = {
  Quib: string;
  hours: number;
  min: number;
  sec: number;
}
interface props {
  hour: number,
  mins: number,
  secs: number
}

function QuibCompose({ hour, mins, secs }: props) {
  const [QuibInput, setQuibInput] = useState<string>('');
  const [FlatData, setFlatData] = useState<any>([]);
  // const [isVisible, setIsVisible] = useState(true)
  const DataRef = useRef<FD[]>(
    [

    ]
  );
  const setData = () => {
    DataRef.current.push({
      Quib: QuibInput,
      hours: hour,
      min: mins,
      sec: secs
    })
    setFlatData([...DataRef.current]);
    // console.log(DataRef.current)

  }
  const Quibs = ({ item, index }: any) => {
    console.log(item);

    return (
      <View style={{ width: vw(100) }} key={index}>
        <ScrollView style={{ width: vw(80), height: vh(25), alignSelf: 'center', backgroundColor: '#fff', borderWidth: 1, elevation: 4, shadowColor: 'black', borderColor: Style.borderColor, marginVertical: vw(2) }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={[...[quibPlayerStyles.timer], { width: vw(14), height: vw(4), marginVertical: vw(1) }]}>
              <Text style={{ textAlign: 'center', color: '#fff', fontSize: vw(2.6), }}>{(item.hours < 10) ? `0${item.hours}` : `${item.hours}`}:{(item.min < 10) ? (`0${item.min}`) : `${item.min}`}:{(item.sec < 10) ? (`0${item.sec}`) : `${item.sec}`}</Text>
            </View>
          </View>
          <View style={{ width: vw(75), height: vh(15), alignSelf: 'center', borderWidth: 1, borderColor: Style.borderColor, padding: vw(2) }}>
            <Text style={{ color: Style.defaultTxtColor, textAlign: 'left' }}>{item.Quib}</Text>
          </View>
          <View style={{justifyContent:'space-around', flexDirection:'row',}}>
            <TouchableOpacity style={{ paddingTop: vw(1), zIndex: 2 }} activeOpacity={.4} disabled={false} >
              <View style={[...[styles.button], ]}>
                <Text style={styles.buttonTxt}>Delete</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingTop: vw(1), zIndex: 2 }} activeOpacity={.4} disabled={false} >
              <View style={styles.button}>
                <Text style={styles.buttonTxt}>Post</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: vw(3) }}>
      <View style={{ backgroundColor: '#e2e2e2', borderWidth: 1, borderRadius: 2, borderColor: '#fff', width: vw(85), zIndex: 2 }}>
        <TextInput placeholder='Write a Quib here..' multiline={true} onChange={({ nativeEvent: { text } }) => setQuibInput(text)} />
      </View>
      <TouchableOpacity style={{ paddingTop: vw(1), zIndex: 2 }} activeOpacity={.4} disabled={false} onPress={setData}>
        <View style={styles.button}>
          <Text style={styles.buttonTxt}>Save</Text>
        </View>
      </TouchableOpacity>
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          style={{ alignSelf: 'center', marginHorizontal: vw(2) }}
          contentContainerStyle={{ justifyContent: 'center', alignSelf: 'center', marginHorizontal: vw(2) }}
          data={FlatData}
          extraData={FlatData}
          renderItem={({ item, index }) => < Quibs item={item} index={index} />}
          initialNumToRender={10}
          windowSize={5}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={30}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          initialScrollIndex={0}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#990000',
    width: 100,
    height: 32,
    borderRadius: 16,
    paddingTop: 6,
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff'
  },
})

export default memo(QuibCompose);