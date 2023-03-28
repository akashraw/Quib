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
  const isActiveMovieWorking = useRef<boolean>(true);
  const isRecentMovieWorking = useRef<boolean>(true);
  const Auth = React.useContext(AuthContext);
  LogBox.ignoreLogs(['FlashList']);

  useEffect(() => {
    Promise.all([
      getAllMovies().then(res => { if (res === undefined) { return isRecentMovieWorking.current = false } else { setallMovieRes(res)} }),
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


  const AllMovies = useCallback(() => {
    return (
      < FlatList
        // bounces={false}
        style={{ width: vw(100), flex: 1 }
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        data={allMovieRes}
        renderItem={MovieBanner}
        ListFooterComponent={<></>}
        ListFooterComponentStyle={{ paddingBottom: vw(10) }}
        // estimatedItemSize={vw(24)}
        ListEmptyComponent={SkeletonVertical}
      />

    )
  }, [allMovieRes]);


  // for rending movie card list 
  const MovieBanner = useCallback(({ item, index }: any) => {
    // console.log(item[0])
    const check: string = item.posterContentThumb;
    let FS: any;
    if (check != null) {
      FS = check.split('.').pop();
    } else { FS = null }
    let length = item.length;
    let total = Formatter(length);
    return (

      <View style={{ flex: 1, margin: vw(2), flexDirection: 'row', justifyContent: 'center', }}>
        {/* bannner top */}
        <TouchableOpacity onPress={() => props.navigation.navigate("Qplayer", { MovieId: item.id, Movietitle: item.title })}>
          <View key={index} style={styles.movieBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              {/* <Shadow distance={1} style={{ borderRadius: vw(2) }} > */}
              <FastImage
                style={{ width: vw(15), height: vw(20), marginRight: vw(2), borderRadius: vw(1), marginVertical: vw(2) }}
                // resizeMode={FastImage.resizeMode.contain}
                source={{
                  uri: ((FS == 'jpeg' || FS == 'jpg' || FS == 'png') ? `${API}${item.posterContentThumb}` : `data:image/png;base64,${item.posterContentThumb}`),
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
            <View style={{ alignItems: 'center', marginRight: vw(0), justifyContent: 'center' }}>
              <View style={{ alignItems: 'center', alignSelf: 'flex-end', }}>
                <View style={{ width: vw(16), height: vw(16), marginBottom: vw(1), }}>
                  <View style={{ width: vw(16), height: vw(8), borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Style.defaultRed, borderColor: Style.defaultRed, borderTopRightRadius: vw(4), borderTopLeftRadius: vw(4), borderBottomWidth: 0 }}>
                    <Text style={{ color: '#fff', fontWeight: '500', fontSize: (Auth.DeviceType ? vw(3) : vw(3.6)), alignSelf: 'center' }}>{total}</Text>
                  </View>
                  <View style={{ width: vw(16), height: vw(8), borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: Style.defaultRed, borderBottomLeftRadius: vw(4), borderBottomRightRadius: vw(4), borderTopWidth: 0 }}>
                    <Text style={{ fontSize: (Auth.DeviceType ? vw(2.2) : vw(2.5)), fontWeight: '500', color: Style.defaultTxtColor, textAlign: 'center', alignSelf: 'center' }}>Total Quibs</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )

  },[allMovieRes])

  const SectionHeading = (section: any) => {
    if (!section.sort) {
      if (!section.recent) {
        return (
          // Most Active
          <View style={{
            justifyContent: 'center', marginTop: vw(2), paddingLeft: vw(2),
          }}>
            <Text style={{ color: Style.defaultRed, fontSize: (Auth.DeviceType ? vw(3.8) : vw(5.2)), fontWeight: 'bold' }}>{section.title}</Text>
            <FlatList
              horizontal
              style={{ width: vw(100) }}
              showsHorizontalScrollIndicator={false}
              data={section.data}
              renderItem={({ item, index }: any) => <MovieCards item={item} index={index} />}
              ListEmptyComponent={() => <SkeletonHorizontal />}
            // estimatedItemSize={vw(40)}
            />
            <TouchableOpacity onPress={() => props.navigation.navigate('SeeMostActive', { Data: section.data, Auth:Auth.DeviceType })} >
              <Text style={{ color: Style.defaultRed, fontSize: vw(2.5), fontWeight: 'bold', alignSelf: 'flex-end', flex: 1, right: vw(4), marginBottom: vw(2) }}>see more</Text>
            </TouchableOpacity>
          </View>
        )
      } else return (
        //  Recent
        <View style={{
          justifyContent: 'center', marginTop: vw(2), paddingLeft: vw(2),
        }}>
          <Text style={{ color: Style.defaultRed, fontSize: (Auth.DeviceType ? vw(3.8) : vw(5.2)), fontWeight: 'bold' }}>{section.title}</Text>
          <FlatList
            horizontal
            style={{ width: vw(100) }}
            showsHorizontalScrollIndicator={false}
            data={section.data}
            renderItem={({ item, index }: any) => <MovieCards item={item} index={index} />}
            ListEmptyComponent={() => <SkeletonHorizontal />}
          // estimatedItemSize={vw(40)}
          />
          <TouchableOpacity onPress={() => props.navigation.navigate('SeeRecent', { Data: section.data, Auth:Auth.DeviceType})} >
            <Text style={{ color: Style.defaultRed, fontSize: vw(2.5), fontWeight: 'bold', alignSelf: 'flex-end', flex: 1, right: vw(4), marginBottom: vw(2) }}>see more</Text>
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
          <Text style={{ color: Style.defaultRed, fontSize: (Auth.DeviceType ? vw(3.8) : vw(5.2)), fontWeight: 'bold' }}>{section.title}</Text>
          {/* <TouchableOpacity activeOpacity={.4} onPress={handlePresentModalPress} >
            <View style={styles.button}> */}
          {/* <Text style={styles.buttonTxt}>Sort </Text> */}
          {/* <Icon name='sort' size={22} color={Style.defaultRed} />
            </View>
          </TouchableOpacity> */}
        </View>
        <AllMovies />
      </View>
    )
  };

  const MovieCards = ({ item, index }: any) => {

    return (
      <TouchableOpacity onPress={() => props.navigation.navigate("Qplayer", { MovieId: item.id, Movietitle: item.title })}>
        <MovieCard key={index} title={item.title} year={item.releaseYear} director={item.director} 
        viewStyle={Auth.DeviceType ? styles.viewStyle : styles.viewStyle} 
        textStyle={Auth.DeviceType ? styles.txtStyle : styles.txtStyle} 
        linearGradStyle={undefined} 
        imgSrc={item.posterContentThumb} />
      </TouchableOpacity>

    )
  }

  const Loaded = () => {
    const Sections = () => {
      if (Auth.isGuest == true) {
        const sect: any[] = [
          // { title: 'All Movies', sort: true, data: allMovieRes, renderItem: ({ item, index }: any) => <MovieBanner item={item} index={index} /> },
          { title: 'All Movies', sort: true, data: allMovieRes, renderItem: () =>  null },
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
    // height: vh(12),
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
  viewStyle: {
    width: vw(28),
    height: vw(40),
    borderColor: '#fff',
    borderRadius: vw(2)
  },
  txtStyle: {
      bottom: 0,
      fontSize: vw(3),
      // fontFamily: 'Roboto',
      // textAlign: 'center',
      color: '#ffffff',
      backgroundColor: 'transparent',
  }
})
