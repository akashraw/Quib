import { StyleSheet, Text, View, TouchableOpacity, SectionList, TouchableWithoutFeedback, Pressable } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Style } from '../../constants/Styles'
import { vw, vh } from 'rxn-units';
import { API } from '../../constants/Api';
import { getAllMovies, getMostActiveMovies, getRecentMovies } from '../../services/QuibAPIs';
import { Wave } from 'react-native-animated-spinkit'
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome'
// import QuibButton from '../../components/QuibButton';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useBottomSheetBackHandler } from './useBottomSheetBack';
import { RadioButton } from 'react-native-paper';
import MovieCard from './MovieCard';
import { FlatList } from 'react-native-gesture-handler';
import { Shadow } from 'react-native-shadow-2';
// import BottomTabNavigation from '../../components/BottomTabNavigation';
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
  // const isFav = useRef(false);
  // const [Star, setStar] = useState('star-o')



  useEffect(() => {
    setTimeout(() => {
      Promise.all([
        getAllMovies().then(res => setallMovieRes(res)),
        getRecentMovies().then(res => setRecentMovies(res)),
        getMostActiveMovies().then(res => setActiveMovies(res))
      ]).then(() => setIsLoading(false))
    }, 1000);
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
        opacity={.6}
        onPress={bottomSheetModalRef.current?.dismiss}
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
        <TouchableWithoutFeedback onPress={() => bottomSheetModalRef.current?.close()} style={{ width: vw(100), height: vh(100) }}>
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
    const [Star, setStar] = useState('star-o')
    const check: string = item.posterContentThumb;
    const IconChange = () => {
      if (Star == 'star')
        return setStar('star-o')
      else return setStar('star')
    }
    let FS = check.split('.').pop();
    return (

      <View style={{ flex: 1, margin: vw(2), flexDirection: 'row', justifyContent: 'center', }}>
        {/* bannner top */}
        <View key={index} style={styles.movieBanner}>
          <TouchableOpacity onPress={() => props.navigation.navigate("Qplayer", { MovieId: item.id, Movietitle: item.title })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              {/* <Shadow distance={1} style={{ borderRadius: vw(2) }} > */}
              <FastImage
                style={{ width: vw(15), height: vw(20), marginHorizontal: vw(2), borderRadius: vw(1) }}
                // resizeMode={FastImage.resizeMode.contain}
                source={{
                  uri: ((FS == 'jpeg' || FS == 'jpg') ? `${API}${item.posterContentThumb}` : `data:image/png;base64,${item.posterContentThumb}`),
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable
                }} />
              {/* </Shadow> */}
              <View>
                <Text style={[[styles.title, styles.txt], { width: vw(60), paddingRight: vw(1) }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[...[styles.txt], { fontSize: 12 }]}>{item.releaseYear}</Text>
                <Text style={[...[styles.txt], { fontSize: 12 }]}>{item.director}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ alignItems: 'center', marginRight: vw(2) }}>
            <View style={{ alignItems: 'center', alignSelf: 'flex-end', }}>
              <View style={{ width: vw(14), height: vw(14), marginBottom: vw(1), }}>
                <View style={{ width: vw(14), height: vw(7), borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Style.defaultRed, borderColor: Style.defaultRed, borderTopRightRadius: vw(4), borderTopLeftRadius: vw(4), borderBottomWidth: 0 }}>
                  <Text style={{ color: '#fff', fontWeight: '500', fontSize: 14, alignSelf: 'center' }}>4.2k</Text>
                </View>
                <View style={{ width: vw(14), height: vw(7), borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: Style.defaultRed, borderBottomLeftRadius: vw(4), borderBottomRightRadius: vw(4), borderTopWidth: 0 }}>
                  <Text style={{ fontSize: 9, fontWeight: '500', color: Style.defaultTxtColor, textAlign: 'center', alignSelf: 'center' }}>Total Quibs</Text>
                </View>
              </View>
              <TouchableOpacity onPress={IconChange}>
                <Icon name={Star} size={20} color={Style.defaultRed} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )

  }
  const SectionHeading = (section: any) => {
    if (!section.sort) {
      return (
        <View style={{
          justifyContent: 'center', marginTop: vw(2), paddingLeft: vw(2)
        }}>
          <Text style={{ color: Style.defaultRed, fontSize: 20, fontWeight: 'bold' }}>{section.title}</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={section.data}
            renderItem={({ item, index }: any) => <MovieCards item={item} index={index} />}
          />
          <TouchableOpacity>
            <Text style={{ color: Style.defaultRed, fontSize: 12, fontWeight: 'bold', alignSelf: 'flex-end', flex: 1, right: vw(4), marginBottom: vw(2) }}>see more</Text>
          </TouchableOpacity>
        </View>
      )
    } else return (
      <View style={{
        // backgroundColor: Style.quibHeader, 
        // width: vw(95), 
        justifyContent: 'space-between', alignItems: 'center', marginTop: vw(2),
        paddingLeft: vw(2), flex: 1, flexDirection: 'row',
      }}>
        <Text style={{ color: Style.defaultRed, fontSize: 20, fontWeight: 'bold' }}>{section.title}</Text>
        {/* <View style={{ }}>
        </View> */}
        <TouchableOpacity activeOpacity={.4} onPress={handlePresentModalPress} >
          <View style={styles.button}>
            {/* <Text style={styles.buttonTxt}>Sort </Text> */}
            <Icon name='sort' size={20} color={Style.defaultRed} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  const MovieCards = ({ item, index }: any) => {

    return (
      <MovieCard key={index} title={item.title} year={item.releaseYear} director={item.director} viewStyle={undefined} textStyle={undefined} linearGradStyle={undefined} />
    )
  }

  const Loaded = () => {
    if (isLoading) {
      return (
        <View style={{ height: vh(100), justifyContent: 'center', alignItems: 'center', paddingBottom: vw(35), backgroundColor: Style.quibBackColor }}>
          <Wave size={65} color={Style.defaultRed} animating={isLoading} />
        </View>
      )

    } else return (
      <SectionList
        bounces={false}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        sections={[
          { title: 'Recent Quib', sort: false, data: RecentMovies, renderItem: ({ item, index }) => { return null } },
          { title: 'Most Active Quib', sort: false, data: ActiveMovies, renderItem: ({ item, index }) => { return null } },
          { title: 'All Movies', sort: true, data: allMovieRes, renderItem: ({ item, index }) => MovieBanner({ item, index }) }
        ]}
        renderSectionHeader={({ section }) => SectionHeading(section)}
      />
    )
  }

  return (
    <BottomSheetModalProvider>
      {/* <SafeAreaView> */}
      <View style={{ alignItems: 'center', backgroundColor: Style.quibBackColor, height:vh(100) }}>
        <Loaded />
        <BottomSheet />
      </View>
      {/* <BottomTabNavigation/> */}
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
    justifyContent: 'space-between',
    borderRadius: vw(2),
    width: vw(95),
    height: vh(12),
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    // backgroundColor: 'Style.quibColor',
    alignItems: 'center',
  },
  txt: {
    fontSize: 14,
    color: Style.quibText,
    fontWeight: 'bold'
  },
  button: {
    marginRight: vw(4),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: Style.defaultRed,
    // backgroundColor: Style.defaultRed,
    width: vw(8),
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

