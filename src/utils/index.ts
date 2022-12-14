import {NavigationState} from '@react-navigation/native';
import {Dimensions} from 'react-native';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

// 根据百分比获取宽度
function wp(pct: number) {
  const value = (pct * viewportWidth) / 100;
  return Math.round(value);
}

// 根据百分比获取高度
function hp(pct: number) {
  const value = (pct * viewportHeight) / 100;
  return Math.round(value);
}

function getActiveRouteName(state: NavigationState) {
  let route;
  route = state.routes[state.index];
  while (route.state && route.state.index) {
    route = route.state.routes[route.state.index];
  }
  return route.name;
}

export {viewportWidth, viewportHeight, wp, hp, getActiveRouteName};
