import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View, ViewProps } from 'react-native';
import { vw } from 'rxn-units';
import { Style } from '../constants/Styles';

type PageHeaderProps = {
  leftNode?: JSX.Element;
  rightNode?: JSX.Element;
  headerNode?: JSX.Element;
  handleOnPressLeftNode?: (event: GestureResponderEvent) => void;
  handleOnPressRightNode?: (event: GestureResponderEvent) => void;
  handleOnPressHeadNode?:  (event: GestureResponderEvent) => void;
  rightContainerStyle?: ViewProps['style'] | null;
  leftContainerStyle?: ViewProps['style'] | null;
  headContainerStyle?: ViewProps['style'] | null;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  leftNode = null,
  rightNode = null,
  headerNode = null,
  handleOnPressLeftNode = null,
  handleOnPressRightNode = null,
  handleOnPressHeadNode = null,
  rightContainerStyle = null,
  leftContainerStyle = null,
  headContainerStyle = null,
}) => {
  return (
    <View style={styles.pageHeaderContainer}>
      <Pressable onPress={handleOnPressLeftNode} style={leftContainerStyle || styles.leftItem}>
        {leftNode}
      </Pressable>
      <Pressable onPress={handleOnPressHeadNode} style={headContainerStyle || styles.headerItem} >
        {headerNode}
      </Pressable>
      <Pressable onPress={handleOnPressRightNode} style={rightContainerStyle || styles.rightItem}>
        {rightNode}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  pageHeaderContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:Style.quibHeader,
    // padding:vw(1),
  },
  leftItem: {
    // flex:1
  },
  rightItem: {
    
  },
  headerItem: {
    // alignSelf:'center',
    // textAlign:'center',
    // flex:1
  }
});

export default PageHeader;