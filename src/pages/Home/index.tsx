import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootStackNavigation} from '@/navigator/index';
import {RootState} from '@/models/index';
import Carousel, {sideHeight} from './Carousel';
import Guess from './Guess';
import {IChannel} from '@/models/home';
import ChannelItem from './ChannelItem';
import {RouteProp} from '@react-navigation/native';
import {HomeParamList} from '@/navigator/HomeTabs';

const mapStateToProps = (
  state: RootState,
  {route}: {route: RouteProp<HomeParamList, string>},
) => {
  const {namespace} = route.params;
  const modelState = state[namespace];
  return {
    namespace,
    carousels: modelState.carousels,
    channels: modelState.channels,
    hasMore: modelState.pagination.hasMore,
    gradientVisible: modelState.gradientVisible,
    loading: state.loading.effects[namespace + '/fetchChannels'],
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  navigation: RootStackNavigation;
}

interface IState {
  refreshing: boolean;
}

class Home extends React.Component<IProps, IState> {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    const {dispatch, namespace} = this.props;
    dispatch({
      type: namespace + '/fetchCarousels',
    });
    dispatch({
      type: namespace + '/fetchChannels',
    });
  }

  onPress = (data: IChannel) => {
    console.log(data);
  };

  keyExtractor = (item: IChannel) => {
    return item.id;
  };

  // 下拉刷新
  onRefresh = () => {
    this.setState({
      refreshing: true,
    });
    const {dispatch, namespace} = this.props;
    dispatch({
      type: namespace + '/fetchChannels',
      callback: () => {
        this.setState({
          refreshing: false,
        });
      },
    });
  };

  // 上拉加载更多
  onEndReached = () => {
    const {dispatch, loading, hasMore, namespace} = this.props;
    if (loading || !hasMore) {
      return;
    }
    dispatch({
      type: namespace + '/fetchChannels',
      payload: {
        loadMore: true,
      },
    });
  };

  renderItem = ({item}: ListRenderItemInfo<IChannel>) => {
    return <ChannelItem data={item} onPress={this.onPress} />;
  };

  onScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent.contentOffset.y;
    let newGradientVisible = offsetY < sideHeight;
    const {dispatch, gradientVisible, namespace} = this.props;
    if (gradientVisible !== newGradientVisible) {
      dispatch({
        type: namespace + '/setState',
        payload: {
          gradientVisible: newGradientVisible,
        },
      });
    }
  };

  goAlbum = () => {
    alert('点击');
  };

  get header() {
    const {namespace} = this.props;
    return (
      <View>
        <Carousel />
        <View style={styles.background}>
          <Guess namespace={namespace} goAlbum={this.goAlbum} />
        </View>
      </View>
    );
  }

  get footer() {
    const {hasMore, loading, channels} = this.props;
    if (!hasMore) {
      return (
        <View style={styles.end}>
          <Text style={styles.text}>———我是有底线的———</Text>
        </View>
      );
    }
    if (loading && hasMore && channels.length > 0) {
      return (
        <View style={styles.loading}>
          <Text style={styles.text}>正在加载中···</Text>
        </View>
      );
    }
    return null;
  }
  get empty() {
    const {loading} = this.props;
    if (loading) {
      return null;
    }
    return (
      <View style={styles.empty}>
        <Text style={styles.text}>暂无数据</Text>
      </View>
    );
  }

  render() {
    const {channels} = this.props;
    const {refreshing} = this.state;
    return (
      <FlatList
        ListHeaderComponent={this.header}
        ListFooterComponent={this.footer}
        ListEmptyComponent={this.empty}
        data={channels}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onRefresh={this.onRefresh}
        refreshing={refreshing}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.2}
        onScroll={this.onScroll}
      />
    );
  }
}

const styles = StyleSheet.create({
  end: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 100,
  },
  text: {
    color: '#888',
    fontSize: 14,
  },
  background: {
    backgroundColor: '#fff',
  },
});

export default connector(Home);
