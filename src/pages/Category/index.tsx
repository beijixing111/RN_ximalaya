import {ICategory} from '@/models/category';
import {RootState} from '@/models/index';
import React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import _ from 'lodash';
import {DragSortableView} from 'react-native-drag-sort';
import Item, {itemHeight, itemWidth, margin, parentWidth} from './Item';
import {RootStackNavigation} from '@/navigator/index';
import HeaderRightBtn from './HeaderRightBtn';
import Touchable from '@/components/Touchable';

const mapStateToProps = ({category}: RootState) => {
  return {
    myCategorys: category.myCategorys,
    categorys: category.categorys,
    isEdit: category.isEdit,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  navigation: RootStackNavigation;
}

interface IState {
  myCategorys: ICategory[];
}

const fixedItem = [0, 1];

class Category extends React.Component<IProps, IState> {
  state = {
    myCategorys: this.props.myCategorys,
  };

  constructor(props: IProps) {
    super(props);
    props.navigation.setOptions({
      headerRight: () => <HeaderRightBtn onSubmit={this.onSubmit} />,
    });
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'category/setState',
      payload: {
        isEdit: false,
      },
    });
  }

  onSubmit = () => {
    const {dispatch, navigation, isEdit} = this.props;
    const {myCategorys} = this.state;
    dispatch({
      type: 'category/toggle',
      payload: {
        myCategorys,
      },
    });
    if (isEdit) {
      navigation.goBack();
    }
  };
  onLongPress = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'category/setState',
      payload: {
        isEdit: true,
      },
    });
  };

  onPress = (item: ICategory, index: number, selected: boolean) => {
    const {isEdit} = this.props;
    const {myCategorys} = this.state;
    const disabled = fixedItem.indexOf(index) > -1;
    if (selected && disabled) return;
    if (isEdit) {
      if (selected) {
        this.setState({
          myCategorys: myCategorys.filter(inItem => inItem.id !== item.id),
        });
      } else {
        this.setState({
          myCategorys: myCategorys.concat([item]),
        });
      }
    }
  };
  onClickItem = (data: ICategory[], item: ICategory) => {
    this.onPress(item, data.indexOf(item), true);
  };
  onDataChange = (data: ICategory[]) => {
    this.setState({
      myCategorys: data,
    });
  };

  renderItem = (item: ICategory, index: number) => {
    const {isEdit} = this.props;
    const disabled = fixedItem.indexOf(index) > -1;
    return (
      <Item
        data={item}
        isEdit={isEdit}
        disabled={disabled}
        selected
        key={item.id}
      />
    );
  };

  renderUnSelectedItem = (item: ICategory, index: number) => {
    const {isEdit} = this.props;
    return (
      <Touchable
        key={item.id}
        onPress={() => this.onPress(item, index, false)}
        onLongPress={this.onLongPress}>
        <Item data={item} isEdit={isEdit} selected={false} />
      </Touchable>
    );
  };

  render() {
    const {categorys, isEdit} = this.props;
    const {myCategorys} = this.state;
    console.log('myCategorys', myCategorys);
    const classifyGroup = _.groupBy(categorys, item => item.classify);
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.classifyName}>我的分类</Text>
        <View style={styles.classifyView}>
          <DragSortableView
            dataSource={myCategorys}
            fixedItems={fixedItem}
            renderItem={this.renderItem}
            sortable={isEdit}
            keyExtractor={item => item.id}
            onDataChange={this.onDataChange}
            parentWidth={parentWidth}
            childrenWidth={itemWidth}
            childrenHeight={itemHeight}
            marginChildrenTop={margin}
            onClickItem={this.onClickItem}
          />
          {/* {myCategorys.map(this.renderItem)} */}
        </View>
        <View style={styles.bot}>
          {Object.keys(classifyGroup).map(classify => {
            return (
              <View key={classify}>
                <Text style={styles.classifyName}>{classify}</Text>
                <View style={styles.classifyView}>
                  {classifyGroup[classify].map((item, index) => {
                    if (
                      myCategorys.find(
                        selectedItem => selectedItem.id === item.id,
                      )
                    ) {
                      return null;
                    }
                    return this.renderUnSelectedItem(item, index);
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  classifyName: {
    fontSize: 16,
    marginTop: 14,
    marginBottom: 8,
    marginLeft: 10,
  },
  classifyView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  bot: {
    paddingBottom: 25,
  },
});

export default connector(Category);
