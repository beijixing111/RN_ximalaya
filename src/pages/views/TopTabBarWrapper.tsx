import Touchable from '@/components/Touchable';
import {RootState} from '@/models/index';
import {getActiveRouteName} from '@/utils/index';
import {
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
// import LinearGradient from 'react-native-linear-gradient';
import LinearAnimatedGradientTransition from 'react-native-linear-animated-gradient-transition';
import {connect, ConnectedProps} from 'react-redux';

const mapStateToProps = (state: RootState, props: MaterialTopTabBarProps) => {
  const routeName = getActiveRouteName(props.state);
  const modelState = state[routeName];
  return {
    gradientVisible: modelState.gradientVisible,
    linearColors:
      modelState.carousels && modelState.carousels.length > 0
        ? modelState.carousels[modelState.activeCarouselIndex]
          ? modelState.carousels[modelState.activeCarouselIndex].colors
          : undefined
        : undefined,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

type IProps = MaterialTopTabBarProps & ModelState;

class TopTabBarWrapper extends React.Component<IProps> {
  goCategory = () => {
    const {navigation} = this.props;
    navigation.navigate('Category');
  };
  get linearGradient() {
    const {gradientVisible, linearColors = ['#ccc', '#e2e2e2']} = this.props;
    if (!gradientVisible) {
      return null;
    }
    return (
      <LinearAnimatedGradientTransition
        colors={linearColors}
        style={styles.gradient}
      />
    );
  }

  render() {
    const {gradientVisible, ...restProps} = this.props;
    let textStyle = styles.text;
    if (gradientVisible) {
      textStyle = styles.whiteText;
    }
    return (
      <View style={styles.container}>
        {this.linearGradient}
        <View style={styles.topTabBarView}>
          <MaterialTopTabBar {...restProps} />
          <Touchable style={styles.categoryBtn} onPress={this.goCategory}>
            <Text style={textStyle}>分类</Text>
          </Touchable>
        </View>
        <View style={styles.bottom}>
          <Touchable style={styles.searchBtn}>
            <Text style={textStyle}>搜索按钮</Text>
          </Touchable>
          <Touchable style={styles.historyBtn}>
            <Text style={textStyle}>历史记录</Text>
          </Touchable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: getStatusBarHeight(),
  },
  topTabBarView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBtn: {
    paddingHorizontal: 10,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#ccc',
  },
  bottom: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  searchBtn: {
    flex: 1,
    paddingLeft: 12,
    height: 30,
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,.1)',
  },
  historyBtn: {
    marginLeft: 24,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    height: 260,
  },
  text: {
    color: '#333',
  },
  whiteText: {
    color: '#fff',
  },
});

export default connector(TopTabBarWrapper);
