import React from 'react';
import {FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import {RootStackNavigation} from '@/navigator/index';
import {connect, ConnectedProps} from 'react-redux';
import {IFound} from '@/models/found';
import Item from './Item';

const connector = connect();

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  navigation: RootStackNavigation;
}

interface IState {
  list: IFound[];
  currentId: string;
}

class Found extends React.Component<IProps, IState> {
  state = {
    list: [],
    currentId: '',
  };
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'found/fetchList',
      callback: (data: IFound[]) => {
        console.log('foundData', data);
        this.setState({
          list: data,
        });
      },
    });
  }

  setCurrentId = (id: string) => {
    this.setState({
      currentId: id,
    });
    // 播放视频时暂停音频
    if (id) {
      // ////
    }
  };

  renderItem = ({item}: ListRenderItemInfo<IFound>) => {
    const paused = item.id !== this.state.currentId;
    return (
      <Item
        data={item}
        key={item.id}
        paused={paused}
        setCurrentId={this.setCurrentId}
      />
    );
  };

  render() {
    const {list, currentId} = this.state;
    return (
      <FlatList
        data={list}
        renderItem={this.renderItem}
        extraData={currentId}
      />
    );
  }
}

export default connector(Found);
