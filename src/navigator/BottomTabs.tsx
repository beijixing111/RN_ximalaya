import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import Home from '@/pages/Home';
import Listen from '@/pages/Listen';
import Found from '@/pages/Found';
import Account from '@/pages/Account';
import Icon from '@/assets/iconfont/index';
import {RootStackNavigation, RootStackParamList} from '@/navigator/index';
import {
  RouteProp,
  TabNavigationState,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import HomeTabs from './HomeTabs';

export type BottomTabParamList = {
  HomeTabs: undefined;
  Listen: undefined;
  Found: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

type Route = RouteProp<RootStackParamList, 'BottomTabs'> & {
  state?: TabNavigationState<BottomTabParamList>;
};

interface IProps {
  navigation: RootStackNavigation;
  route: Route;
}

const getHeaderTitle = (route: Route): string => {
  const routeName = getFocusedRouteNameFromRoute(route) || 'HomeTabs';
  switch (routeName) {
    case 'HomeTabs':
      return '首页';
    case 'Listen':
      return '我听';
    case 'Found':
      return '发现';
    case 'Account':
      return '账户';
    default:
      return '首页';
  }
};

class BottomTabs extends React.Component<IProps> {
  componentDidMount() {
    this.setOptions();
  }
  componentDidUpdate() {
    this.setOptions();
  }

  setOptions = () => {
    const {navigation, route} = this.props;
    const routeName = getFocusedRouteNameFromRoute(route) || 'HomeTabs';
    if (routeName === 'HomeTabs') {
      navigation.setOptions({
        headerTransparent: true,
        headerTitle: '',
      });
    } else {
      navigation.setOptions({
        headerTransparent: false,
        headerTitle: getHeaderTitle(route),
      });
    }
  };

  render() {
    return (
      // <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'pink',
          headerShown: false,
        }}>
        <Tab.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{
            tabBarLabel: '首页',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="icon-shouye" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Listen"
          component={Listen}
          options={{
            tabBarLabel: '我听',
            tabBarIcon: ({color, size}) => (
              <Icon name="icon-shoucang" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Found"
          component={Found}
          options={{
            tabBarLabel: '发现',
            tabBarIcon: ({color, size}) => (
              <Icon name="icon-faxian" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarLabel: '我的',
            tabBarIcon: ({color, size}) => (
              <Icon name="icon-user" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
      // </NavigationContainer>
    );
  }
}

export default BottomTabs;
