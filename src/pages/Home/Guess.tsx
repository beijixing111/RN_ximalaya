import Touchable from '@/components/Touchable';
import {IGuess} from '@/models/home';
import {RootState} from '@/models/index';
import React from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import Icon from '@/assets/iconfont/index';

const mapStateToProps = ({home}: RootState) => {
  return {
    guess: home.guess,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  namespace: string;
  goAlbum: () => void;
}

class Guess extends React.PureComponent<IProps> {
  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const {dispatch, namespace} = this.props;
    dispatch({
      type: namespace + '/fetchGuess',
    });
  };

  renderItem = ({item}: {item: IGuess}) => {
    const {goAlbum} = this.props;
    return (
      <Touchable style={styles.item} onPress={goAlbum}>
        <Image source={{uri: item.image}} style={styles.image} />
        <Text numberOfLines={2}>{item.title}</Text>
      </Touchable>
    );
  };

  render() {
    const {guess} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon name="icon-xihuan" />
            <Text style={styles.headerTitle}>猜你喜欢</Text>
          </View>
          <View style={styles.headerLeft}>
            <Text style={styles.moreText}>更多</Text>
            <Icon name="icon-more" />
          </View>
        </View>
        <FlatList
          style={styles.list}
          numColumns={3}
          data={guess}
          renderItem={this.renderItem}
        />
        <Touchable style={styles.changeGuess} onPress={this.fetch}>
          <Icon name="icon-huanyipi" color="#f00" size={13} />
          <Text style={styles.changeGuessText}>换一批</Text>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
  },
  item: {
    flex: 1,
    marginVertical: 6,
    marginHorizontal: 10,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomColor: '#efefef',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 5,
    color: '#333',
  },
  moreText: {
    color: '#6f6f6f',
  },
  changeGuess: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  changeGuessText: {
    marginLeft: 5,
  },
  list: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
});

export default connector(Guess);
