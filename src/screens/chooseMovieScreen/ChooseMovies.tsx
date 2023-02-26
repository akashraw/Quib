import { StyleSheet, Text, View, TouchableOpacity, SectionList, TouchableWithoutFeedback, Pressable, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Style } from '../../constants/Styles'
import { vw, vh } from 'rxn-units';
import { API } from '../../constants/Api';
import { getAllMovies, getFolloweeByUserId, getMostActiveMovies, getRecentMovies } from '../../services/QuibAPIs';
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
import { FlashList } from '@shopify/flash-list';
import { AuthContext } from '../../Auth';
import Modal from 'react-native-modal';
import QuibButton from '../../components/QuibButton';
import SkeletonLoader from './SkeletonLoader';
import SkeletonHorizontal from './SkeletonHorizontal';
import SkeletonVertical from './SkeletonVertical';
import { LogBox } from 'react-native';
import Formatter from './Formatter';
// import BottomTabNavigation from '../../components/BottomTabNavigation';
const deviceHeight = Dimensions.get('screen').height;

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
  const [isLoading, setIsLoading] = useState(false);
  // const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { handleSheetPositionChange } = useBottomSheetBackHandler(bottomSheetModalRef);
  const isActiveMovieWorking = useRef<boolean>(true);
  const isRecentMovieWorking = useRef<boolean>(true);
  const Auth = React.useContext(AuthContext);
  const AllMovieRef = useRef<any>([]);
  // const [Star, setStar] = useState('star-o')
  LogBox.ignoreLogs(['FlashList']);
  console.log(Auth.userName);

  useEffect(() => {
    console.log(Auth.isGuest)
    Promise.all([
      getAllMovies().then(res => { if (res === undefined) { return isRecentMovieWorking.current = false } else { setallMovieRes(res); return AllMovieRef.current = res; } }),
      getRecentMovies().then(res => { if (res === undefined) { return isRecentMovieWorking.current = false } else { return setRecentMovies(res) } }),
      getMostActiveMovies().then(res => { if (res === undefined) { return isActiveMovieWorking.current = false } else { return setActiveMovies(res) } }),
    ])
  }, []);

  //=============================Login Modal=========================================================\\
  const LoginModal = useCallback(() => {

    const modalToggle = () => {
      Auth.dispatch({
        type: 'MODAL',
        name: null,
        isGuest: true,
        modal: false,
      })
    }

    return (
      <Modal isVisible={Auth.Modal} coverScreen={true} hasBackdrop={true} backdropColor='black' backdropOpacity={.6}
        onBackdropPress={() => modalToggle()} onBackButtonPress={() => modalToggle()} useNativeDriver={true}
        useNativeDriverForBackdrop={true} statusBarTranslucent={true} style={{ height: vh(100), }} deviceHeight={deviceHeight} >
        <View style={{
          flex: 1, justifyContent: 'center',
          alignItems: 'center', flexDirection: 'column',
        }}>
          <Text style={{ color: '#fff', fontSize: vw(5), fontWeight: '400' }}>Please login to access this feature</Text>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center', flexDirection: 'row'
          }}>
            <QuibButton text={'Do it later'} onPressed={() => { modalToggle() }} viewStyle={[[styles.buttonModal], { backgroundColor: Style.defaultGrey }]} textStyle={styles.buttonTxtModal} />
            <QuibButton text={'Ok, let dot it'} onPressed={() => { props.navigation.navigate('Login') }} viewStyle={styles.buttonModal} textStyle={styles.buttonTxtModal} />
          </View>
        </View>
      </Modal>
    )
  }, [Auth.Modal])
  //=================================login modal ends=================================================\\

  // variables
  const snapPoints = useMemo(() => ['38%'], []);

  // ===================================callbacks====================================================\\
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

  //=========================FOR bottom sheet modal for sorting function===================================\\
  const BottomSheet = () => {
    const [value, setValue] = React.useState('A-Z');
    const Sorting = (params: string) => {
      setValue(params);
      // if (params == 'A-Z') {
      //   setallMovieRes(AllMovieRef.current)
      //   return console.log(allMovieRes)
      // } else if (params == 'Z-A') {
      //   let temp = AllMovieRef.current
      //   let rev = temp.reverse();
      //   setallMovieRes(rev)
      //   return console.log(temp)
      // } else if (params == 'acend') {
      //   return
      // } 
      switch (params) {
        case 'A-Z':
          {
            setallMovieRes(AllMovieRef.current)
            return console.log('A-Z' + AllMovieRef.current[1])
          }
        case 'Z-A':
          {
            var temp = AllMovieRef.current
            setallMovieRes(() => temp.reverse())
            return console.log('Z-A')
          }
        case 'ascend':
          {
            setallMovieRes(AllMovieRef.current)
            return console.log('ascend')
          }
        case 'descend':
          {
            setallMovieRes(AllMovieRef.current)
            return console.log('descend')
          }
      }
    }
    // renders
    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetPositionChange}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
      >
        <TouchableWithoutFeedback onPress={() => bottomSheetModalRef.current?.close()} style={{ width: vw(100), height: vh(100) }}>
          <View style={styles.contentContainer}>

            <View style={{ paddingBottom: vw(2) }}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>Sort By</Text>
            </View>
            <RadioButton.Group onValueChange={value => Sorting(value)} value={value} >
              <RadioButton.Item style={{ width: vw(100), paddingHorizontal: vw(10) }} labelStyle={{ fontSize: 14, fontWeight: 'bold' }} color={Style.defaultRed} label="Alphabetical A-Z" value="A-Z" />
              <RadioButton.Item style={{ width: vw(100), paddingHorizontal: vw(10) }} labelStyle={{ fontSize: 14, fontWeight: 'bold' }} color={Style.defaultRed} label="Alphabetical Z-A" value="Z-A" />
              <RadioButton.Item style={{ width: vw(100), paddingHorizontal: vw(10) }} labelStyle={{ fontSize: 14, fontWeight: 'bold' }} color={Style.defaultRed} label="Year wise ascending" value="ascend" />
              <RadioButton.Item style={{ width: vw(100), paddingHorizontal: vw(10) }} labelStyle={{ fontSize: 14, fontWeight: 'bold' }} color={Style.defaultRed} label="Year wise descending" value="descend" />
            </RadioButton.Group>

          </View>
        </TouchableWithoutFeedback>
      </BottomSheetModal>
    );
  };

  //======================================All Movies=======================================================\\
  const AllMovies = useCallback(() => {

    return (
      < FlatList
        // bounces={false}
        style={{ width: vw(100), flex: 1 }
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        data={allMovieRes}
        renderItem={({ item, index }: any) => <MovieBanner item={item} index={index} />
        }
        // estimatedItemSize={vh(12)}
        ListEmptyComponent={() => <SkeletonVertical />}
      />

    )
  }, [allMovieRes]);


  // for rending movie card list 
  const MovieBanner = ({ item, index }: any) => {
    const check: string = item.posterContentThumb;
    let FS = check.split('.').pop();
    let length = item.length;
    let a = 2;
    let total = Formatter(length);
    return (

      <View style={{ flex: 1, margin: vw(2), flexDirection: 'row', justifyContent: 'center', }}>
        {/* bannner top */}
        <TouchableOpacity onPress={() => props.navigation.navigate("Qplayer", { MovieId: item.id, Movietitle: item.title })}>
          <View key={index} style={styles.movieBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              {/* <Shadow distance={1} style={{ borderRadius: vw(2) }} > */}
              <FastImage
                style={{ width: vw(15), height: vw(20), marginRight: vw(2), borderRadius: vw(1) }}
                // resizeMode={FastImage.resizeMode.contain}
                source={{
                  uri: ((FS == 'jpeg' || FS == 'jpg') ? `${API}${item.posterContentThumb}` : `data:image/png;base64,${item.posterContentThumb}`),
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable
                }} />
              {/* </Shadow> */}
              <View>
                <Text style={[[styles.title, styles.txt], { width: vw(55), paddingRight: vw(1) }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[...[styles.txt], { fontSize: vw(3) }]}>{item.releaseYear}</Text>
                <Text style={[...[styles.txt], { fontSize: vw(3) }]}>{item.director}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'center', marginRight: vw(0) }}>
              <View style={{ alignItems: 'center', alignSelf: 'flex-end', }}>
                <View style={{ width: vw(16), height: vw(16), marginBottom: vw(1), }}>
                  <View style={{ width: vw(16), height: vw(8), borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Style.defaultRed, borderColor: Style.defaultRed, borderTopRightRadius: vw(4), borderTopLeftRadius: vw(4), borderBottomWidth: 0 }}>
                    <Text style={{ color: '#fff', fontWeight: '500', fontSize: 14, alignSelf: 'center' }}>{total}</Text>
                  </View>
                  <View style={{ width: vw(16), height: vw(8), borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: Style.defaultRed, borderBottomLeftRadius: vw(4), borderBottomRightRadius: vw(4), borderTopWidth: 0 }}>
                    <Text style={{ fontSize: 9, fontWeight: '500', color: Style.defaultTxtColor, textAlign: 'center', alignSelf: 'center' }}>Total Quibs</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )

  }

  const SectionHeading = (section: any) => {
    if (!section.sort) {
      if (!section.recent) {
        return (
          <View style={{
            justifyContent: 'center', marginTop: vw(2), paddingLeft: vw(2),
          }}>
            <Text style={{ color: Style.defaultRed, fontSize: 20, fontWeight: 'bold' }}>{section.title}</Text>
            <FlatList
              horizontal
              style={{ width: vw(100) }}
              showsHorizontalScrollIndicator={false}
              data={section.data}
              renderItem={({ item, index }: any) => <MovieCards item={item} index={index} />}
              ListEmptyComponent={() => <SkeletonHorizontal />}
            // estimatedItemSize={vw(40)}
            />
            <TouchableOpacity onPress={() => props.navigation.navigate('SeeMostActive', { Data: section.data })} >
              <Text style={{ color: Style.defaultRed, fontSize: 12, fontWeight: 'bold', alignSelf: 'flex-end', flex: 1, right: vw(4), marginBottom: vw(2) }}>see more</Text>
            </TouchableOpacity>
          </View>
        )
      } else return (
        <View style={{
          justifyContent: 'center', marginTop: vw(2), paddingLeft: vw(2),
        }}>
          <Text style={{ color: Style.defaultRed, fontSize: 20, fontWeight: 'bold' }}>{section.title}</Text>
          <FlatList
            horizontal
            style={{ width: vw(100) }}
            showsHorizontalScrollIndicator={false}
            data={section.data}
            renderItem={({ item, index }: any) => <MovieCards item={item} index={index} />}
            ListEmptyComponent={() => <SkeletonHorizontal />}
          // estimatedItemSize={vw(40)}
          />
          <TouchableOpacity onPress={() => props.navigation.navigate('SeeRecent', { Data: section.data })} >
            <Text style={{ color: Style.defaultRed, fontSize: 12, fontWeight: 'bold', alignSelf: 'flex-end', flex: 1, right: vw(4), marginBottom: vw(2) }}>see more</Text>
          </TouchableOpacity>
        </View>
      )
    } else return (
      <View style={{
        justifyContent: 'center', marginTop: vw(2),
      }}>
        <View style={{
          justifyContent: 'space-between', alignItems: 'center',
          paddingLeft: vw(2), flex: 1, flexDirection: 'row',
        }}>
          <Text style={{ color: Style.defaultRed, fontSize: 20, fontWeight: 'bold' }}>{section.title}</Text>
          <TouchableOpacity activeOpacity={.4} onPress={handlePresentModalPress} >
            <View style={styles.button}>
              {/* <Text style={styles.buttonTxt}>Sort </Text> */}
              <Icon name='sort' size={22} color={Style.defaultRed} />
            </View>
          </TouchableOpacity>
        </View>
        <AllMovies />
      </View>
    )
  };

  const MovieCards = ({ item, index }: any) => {

    return (
      <TouchableOpacity onPress={() => props.navigation.navigate("Qplayer", { MovieId: item.id, Movietitle: item.title })}>
        <MovieCard key={index} title={item.title} year={item.releaseYear} director={item.director} viewStyle={undefined} textStyle={undefined} linearGradStyle={undefined} imgSrc={item.posterContentThumb} />
      </TouchableOpacity>

    )
  }

  const Loaded = () => {
    const Sections = () => {
      if (Auth.isGuest == true) {
        const sect: any[] = [
          { title: 'All Movies', sort: true, data: allMovieRes, renderItem: ({ item, index }: any) => <MovieBanner item={item} index={index} /> },
        ]
        return sect;
      }
      else {
        const sect: any[] = [
          { title: 'Recent Quib', sort: false, recent: true, data: RecentMovies, renderItem: () => { return null } },
          { title: 'Most Active Quib', sort: false, recent: false, data: ActiveMovies, renderItem: () => { return null } },
          { title: 'All Movies', sort: true, recent: false, data: allMovieRes, renderItem: () => { return null } },
        ]
        return sect
      }
    }
    // if (isLoading) {
    //   return (
    //     <View style={{ height: vh(100), justifyContent: 'center', alignItems: 'center', paddingBottom: vw(35), backgroundColor: Style.quibBackColor }}>
    //       <Wave size={65} color={Style.defaultRed} animating={isLoading} />
    //     </View>
    //   )

    // } else
    return (
      <SectionList
        ListEmptyComponent={() => <SkeletonVertical />}
        contentContainerStyle={{ paddingBottom: vh(10) }}
        getItemLayout={(data, index) => (
          { length: vh(12), offset: vh(12) * index, index }
        )}
        bounces={false}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        sections={Sections()}
        style={{ width: vw(100) }}
        renderSectionHeader={({ section }) => SectionHeading(section)}
      />
    )
  }

  return (
    <BottomSheetModalProvider>
      {/* <SafeAreaView> */}
      <View style={{ alignItems: 'center', backgroundColor: Style.quibBackColor, height: vh(100) }}>
        <Loaded />
        <BottomSheet />
      </View>
      {/* <BottomTabNavigation/> */}
      {/* </SafeAreaView> */}
      <LoginModal />
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
    paddingHorizontal: vw(2),
    // backgroundColor: 'Style.quibColor',
    alignItems: 'center',
  },
  txt: {
    fontSize: vw(3.5),
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
  title: {

  },
  year: {

  },
  director: {

  },
  buttonModal: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Style.defaultRed,
    width: vw(30),
    height: vw(8),
    borderRadius: vw(2),
    marginVertical: vw(4),
    marginHorizontal: vw(2)
  },
  buttonTxtModal: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  },
})

