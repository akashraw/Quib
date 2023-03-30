import {StatusBar, StyleSheet} from 'react-native';
import {vw, vh} from 'rxn-units';
import {Style} from '../../constants/Styles';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    // zIndex:1,
    justifyContent:'space-around',
    alignItems: 'center',
    width: vw(100),
    flexDirection:'row',
    paddingTop: StatusBar.currentHeight,
    // overflow: 'hidden',
    // padding: vw(3),
  },
  heading: {
    fontSize: vw(6.1),
    fontWeight: 'bold',
    // marginBottom:-80,
    paddingTop: vw(2),
    color: Style.defaultTxtColor,
  },
  image: {
    resizeMode: 'contain',
    width: vw(70),
    height: vh(50),
    margin: vw(5),
  },
  quibScrubber: {
    flexDirection: 'row',
    // flex: 1,
    justifyContent: 'center',
    // alignSelf:'center',
    // alignItems:'center',
    marginHorizontal: vw(3),
    paddingTop: vw(1.5),
    // paddingBottom: vw(1.5)
  },
  quibZero: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    marginHorizontal: vw(3),
    backgroundColor: Style.defaultRed,
    width: vw(25),
    flexDirection: 'row',
    height: vw(6),
    borderRadius: vw(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatlistComps: {
    flex: 1,
    paddingVertical: vw(2),
    marginVertical: vw(1.5),
  },
  flatlistContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    width: vw(70),
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Style.quibPlayerCardBack,
    borderRadius: vw(1),
    // borderWidth: 1,
    // borderColor: Style.borderColor,
    paddingVertical: vw(0),
    paddingHorizontal: vw(3),
    marginVertical: vw(4),
  },
  loadingActivity: {
    zIndex: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // opacity: 0.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Style.defaultRed,
    width: vw(30),
    height: vw(8),
    borderRadius: vw(2),
    marginVertical: vw(4),
    marginHorizontal: vw(2),
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: vw(3.6),
    color: '#fff',
    fontWeight: 'bold',
  },
  avatar: {
    width: vw(6),
    height: vw(6),
    // marginTop: vw(-2.5),
    borderRadius: vw(0.5),
    marginRight: vw(1),
  },
  timelineRapper: {
    position: 'absolute',
    borderTopLeftRadius: vw(8),
    borderTopRightRadius: vw(8),
    borderTopWidth: 0,
    borderTopColor: 'black',
    bottom: 0,
    overflow: 'hidden',
    width: vw(100),
    flexDirection: 'row',
    height: vh(18),
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  movieScrub: {
    width: vw(5),
    marginLeft: vw(-3),
    left: vw(2.5),
    height: vw(5),
    resizeMode: 'contain',
    bottom: vw(2.5),
  },
  quibScrub: {
    width: vw(5),
    marginLeft: vw(-3),
    left: vw(2.5),
    height: vw(5),
    resizeMode: 'contain',
    bottom: vw(2),
  },
});

export const stylesTab = StyleSheet.create({
  container: {
    flex: 1,
    // zIndex:1,
    flexDirection:'row',
    // alignItems: 'center',
    width: vw(100),
    paddingTop: StatusBar.currentHeight,
    // overflow: 'hidden',
    // padding: vw(3),
  },
  heading: {
    fontSize: vw(5),
    fontWeight: 'bold',
    // marginBottom:-80,
    paddingTop: vw(2),
    color: Style.defaultTxtColor,
  },
  image: {
    resizeMode: 'contain',
    width: vw(70),
    height: vh(50),
    margin: vw(5),
  },
  quibScrubber: {
    flexDirection: 'row',
    // flex: 1,
    justifyContent: 'center',
    // alignSelf:'center',
    // alignItems:'center',
    marginHorizontal: vw(3),
    paddingTop: vw(1.5),
    // paddingBottom: vw(1.5)
  },
  quibZero: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    marginHorizontal: vw(2),
    backgroundColor: Style.defaultRed,
    width: vw(25),
    flexDirection: 'row',
    height: vw(6),
    borderRadius: vw(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatlistComps: {
    flex: 1,
    paddingVertical: vw(2),
    marginVertical: vw(1),
  },
  flatlistContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    width: vw(70),
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Style.quibPlayerCardBack,
    borderRadius: vw(1),
    // borderWidth: 1,
    // borderColor: Style.borderColor,
    paddingVertical: vw(0),
    paddingHorizontal: vw(3),
    marginVertical: vw(4),
  },
  loadingActivity: {
    zIndex: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // opacity: 0.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Style.defaultRed,
    width: vw(30),
    height: vw(8),
    borderRadius: vw(2),
    marginVertical: vw(4),
    marginHorizontal: vw(2),
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: vw(3),
    color: '#fff',
    fontWeight: 'bold',
  },
  avatar: {
    width: vw(4),
    height: vw(4),
    // marginTop: vw(2.5),
    borderRadius: vw(0.5),
    marginRight: vw(1),
  },
  timelineRapper: {
    position: 'absolute',
    borderTopLeftRadius: vw(8),
    borderTopRightRadius: vw(8),
    borderTopWidth: 0,
    borderTopColor: 'black',
    bottom: 0,
    overflow: 'hidden',
    width: vw(100),
    flexDirection: 'row',
    height: vh(18),
    zIndex: 100,
  },
  movieScrub: {
    width: vw(4),
    marginLeft: vw(-3),
    left: vw(2.5),
    height: vw(4),
    resizeMode: 'contain',
    bottom: vw(2),
  },
  quibScrub: {
    width: vw(4),
    marginLeft: vw(-3),
    left: vw(2.5),
    height: vw(4),
    resizeMode: 'contain',
    bottom: vw(1),
  },
});
