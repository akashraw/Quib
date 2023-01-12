import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, SectionList, Button, BackHandler, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Style } from '../../constants/Styles'
import { vmin, vmax, vw, vh, percentage } from 'rxn-units';
import { API } from '../../constants/Api';
import { getAllMovies, getMostActiveMovies, getRecentMovies } from '../../services/QuibAPIs';
import { Bounce, CircleFade, Pulse, Wave } from 'react-native-animated-spinkit'
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign'
import OnLandingButton from '../../components/OnLandingButton';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useBottomSheetBackHandler } from './useBottomSheetBack';
import { RadioButton } from 'react-native-paper';
interface props {
  navigation: any;
}
interface Movies {
  id: number,
  title: string,
  length: number,
  posterContentThumb: string,
  releaseYear: number,
  director: string,
  isActive: true
}

export default function ChooseMovies(props: props) {
  const [allMovieRes, setallMovieRes] = useState([]);
  const [RecentMovies, setRecentMovies] = useState([]);
  const [ActiveMovies, setActiveMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { handleSheetPositionChange } = useBottomSheetBackHandler(bottomSheetModalRef);
  const [value, setValue] = React.useState('first');


  useEffect(() => {
    setTimeout(() => {
      Promise.all([getRecentMovies().then(res => setRecentMovies(res)),
      getAllMovies().then(res => setallMovieRes(res)),
      getMostActiveMovies().then(res => setActiveMovies(res))
      ]).then(() => setIsLoading(false))
    }, 1000);

    // getRecentMovies().then(res => setRecentMovies(res));
    // getAllMovies().then(res => setallMovieRes(res));
    // getMostActiveMovies().then(res => setActiveMovies(res));
  }, []);

  // variables
  const snapPoints = useMemo(() => ['15%', '35 %'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        // disappearsOnIndex=s{1}
        // appearsOnIndex={2}
        opacity={.6}
        onPress={bottomSheetModalRef.current?.dismiss()}
        pressBehavior='collapse'
      />
    ),
    []
  );

  //FOR bottom sheet modal for sorting function
  const BottomSheet = () => {

    // renders
    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetPositionChange}
        // containerStyle={{ width: vw(100), height: vh(100), backgroundColor: 'grey' }}
        backdropComponent={renderBackdrop}

      >
        <TouchableWithoutFeedback onPress={() => bottomSheetModalRef.current?.close()} style={{ width: vw(100), height: vh(100), backgroundColor: 'grey' }}>
          <View style={styles.contentContainer}>

            <View style={{ paddingBottom: vw(2) }}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>Sort By</Text>
            </View>
            <RadioButton.Group onValueChange={value => setValue(value)} value={value} >
              <RadioButton.Item style={{ width: vw(100), paddingHorizontal: vw(10) }} labelStyle={{ fontSize: 14, fontWeight: 'bold' }} color={Style.defaultRed} label="Alphabetical Z-A" value="Alphabetical Z-A" />
              <RadioButton.Item style={{ width: vw(100), paddingHorizontal: vw(10) }} labelStyle={{ fontSize: 14, fontWeight: 'bold' }} color={Style.defaultRed} label="Alphabetical A-Z" value="Alphabetical A-Z" />
              <RadioButton.Item style={{ width: vw(100), paddingHorizontal: vw(10) }} labelStyle={{ fontSize: 14, fontWeight: 'bold' }} color={Style.defaultRed} label="Year wise ascending" value="Year wise ascending" />
              <RadioButton.Item style={{ width: vw(100), paddingHorizontal: vw(10) }} labelStyle={{ fontSize: 14, fontWeight: 'bold' }} color={Style.defaultRed} label="Year wise descending" value="Year wise descending" />
            </RadioButton.Group>

          </View>
        </TouchableWithoutFeedback>
      </BottomSheetModal>
    );
  };

  // for rending movie card list 
  const MovieBanner = ({ item, index }: any) => {
    const check: string = item.posterContentThumb;
    let FS = check.split('.').pop();
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate("Qplayer", { MovieId: item.id, Movietitle: item.title })}>
        <View style={{ margin: vw(2), flexDirection: 'row', justifyContent: 'center' }}>
          {/* bannner top */}
          <View key={index} style={styles.movieBanner}>
            <FastImage
              style={{ width: 45, height: 60, marginHorizontal: vw(2) }}
              resizeMode={FastImage.resizeMode.contain}
              source={{
                uri: ((FS == 'jpeg' || FS == 'jpg') ? `${API}${item.posterContentThumb}` : `data:image/png;base64,${item.posterContentThumb}`),
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable
              }} />
            <View>
              <Text style={[styles.title, styles.txt]}>{item.title}</Text>
              <Text style={[styles.year, styles.txt]}>{item.releaseYear}</Text>
              <Text style={[styles.director, styles.txt]}>{item.director}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )

  }
  const SectionHeading = (section: any) => {
    if (!section.sort) {
      return (
        <View style={{ backgroundColor: Style.quibHeader, width: vw(95), height: vw(10), justifyContent: 'center', marginTop: vw(3), paddingLeft: vw(8) }}>
          <Text style={{ color: Style.defaultRed, fontSize: 20, fontWeight: 'bold' }}>{section.title}</Text>
          {/* <Icon name='swap' size={36} color={Style.defaultTxtColor} /> */}
        </View>
      )
    } else return (
      <View style={{
        backgroundColor: Style.quibHeader, width: vw(95), height: vw(10),
        justifyContent: 'space-between', alignItems: 'center', marginTop: vw(3),
        paddingLeft: vw(8), flex: 1, flexDirection: 'row', alignSelf: 'center'
      }}>
        <Text style={{ color: Style.defaultRed, fontSize: 20, fontWeight: 'bold' }}>{section.title}</Text>
        {/* <View style={{ }}>
        </View> */}
        <TouchableOpacity activeOpacity={.4} onPress={handlePresentModalPress} >
          <View style={styles.button}>
            {/* <Text style={styles.buttonTxt}>Sort </Text> */}
            <Icon name='swap' size={20} color={Style.defaultRed} style={{ transform: [{ rotate: '90deg' }] }} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const Loaded = () => {
    if (isLoading) {
      return (<View style={{ top: vw(50), }}>
        <Wave size={65} color={Style.defaultRed} animating={isLoading} />
      </View>)

    } else return (
      <SectionList
        bounces={false}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        sections={[
          { title: 'Recent Quib', sort: false, data: RecentMovies, renderItem: ({ item, index }) => MovieBanner({ item, index }) },
          { title: 'Most Active Quib', sort: false, data: ActiveMovies, renderItem: ({ item, index }) => MovieBanner({ item, index }) },
          { title: 'All Movies', sort: true, data: allMovieRes, renderItem: ({ item, index }) => MovieBanner({ item, index }) }
        ]}
        renderSectionHeader={({ section }) => SectionHeading(section)}
      />
    )
  }

  return (
    <BottomSheetModalProvider>
      {/* <SafeAreaView> */}
      <View style={{ alignItems: 'center', }}>
        <Loaded />
        <BottomSheet />
      </View>
      {/* </SafeAreaView> */}
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {

    flex: 1,
    alignItems: 'center',
  },
  movieBanner: {
    width: vw(80),
    height: vh(10),
    flexDirection: 'row',
    backgroundColor: Style.quibColor,
    alignItems: 'center',
  },
  txt: {
    fontSize: 14,
    color: Style.quibText,
    fontWeight: 'bold'
  },
  button: {
    marginRight: vw(8),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Style.defaultRed,
    // backgroundColor: Style.defaultRed,
    width: vw(30),
    height: vw(8),
    borderRadius: vw(2),
    // marginBottom: 10,
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: 14,
    // color: '#EDEDED',
    fontWeight: '500'
  },
  title: {},
  year: {},
  director: {},
})

