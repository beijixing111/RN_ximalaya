import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import VideoControls from 'react-native-video-custom-controls';

import {IFound} from '@/models/found';

interface IProps {
  data: IFound;
  paused: boolean;
  setCurrentId: (id: string) => void;
}

class Item extends React.PureComponent<IProps> {
  onPlay = () => {
    const {data, setCurrentId} = this.props;
    setCurrentId(data.id);
  };
  onPause = () => {
    const {setCurrentId} = this.props;
    setCurrentId('');
  };
  render() {
    const {data, paused} = this.props;
    return (
      <View style={styles.itemWrapper}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{data.title}</Text>
        </View>
        <VideoControls
          source={{uri: data.videoUrl}}
          onPlay={this.onPlay}
          onPause={this.onPause}
          paused={paused}
          style={styles.video}
          posterResizeMode="cover"
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{data.user.name}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemWrapper: {
    height: 300,
    position: 'relative',
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: 220,
  },
  title: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
    padding: 10,
  },
  titleText: {
    fontSize: 15,
    color: '#fff',
  },
  userInfo: {
    position: 'absolute',
    left: 0,
    top: 220,
    padding: 10,
  },
  name: {
    fontSize: 14,
    color: '#666',
  },
});

export default Item;
