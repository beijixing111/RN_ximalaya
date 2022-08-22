import React from 'react';
import {StyleSheet} from 'react-native';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import Home from '@/pages/Home';
import TopTabBarWrapper from '@/pages/views/TopTabBarWrapper';
import {RootState} from '../models/index';
import {connect, ConnectedProps} from 'react-redux';
import {ICategory} from '@/models/category';
import {createHomeModel} from '@/config/dva';

export type HomeParamList = {
  [key: string]: {
    namespace: string;
  };
};

const Tab = createMaterialTopTabNavigator<HomeParamList>();

const mapStateToProps = ({category}: RootState) => {
  return {
    myCategorys: category.myCategorys,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {}

class HomeTabs extends React.Component<IProps> {
  renderTabBar = (props: MaterialTopTabBarProps) => {
    return <TopTabBarWrapper {...props} />;
  };

  renderScreen = (item: ICategory) => {
    createHomeModel(item.id);
    return (
      <Tab.Screen
        key={item.id}
        name={item.id}
        component={Home}
        options={{tabBarLabel: item.name}}
        initialParams={{
          namespace: item.id,
        }}
      />
    );
  };

  render() {
    const {myCategorys} = this.props;
    console.log('HomeTabs: ', myCategorys);

    return (
      <Tab.Navigator
        tabBar={this.renderTabBar}
        sceneContainerStyle={styles.sceneContainer}
        screenOptions={{
          lazy: true,
          tabBarScrollEnabled: true,
          tabBarItemStyle: {width: 80},
          tabBarIndicatorStyle: {
            height: 4,
            width: 20,
            marginLeft: 30,
            borderRadius: 2,
            backgroundColor: 'pink',
          },
          tabBarActiveTintColor: 'pink',
          tabBarInactiveTintColor: '#333',
          tabBarStyle: {
            elevation: 0,
            flex: 1,
            overflow: 'hidden',
            backgroundColor: 'transparent',
          },
        }}>
        {myCategorys.map(this.renderScreen)}
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  sceneContainer: {
    backgroundColor: 'transparent',
  },
});

export default connector(HomeTabs);
