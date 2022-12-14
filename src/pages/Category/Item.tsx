import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ICategory} from '@/models/category';
import {viewportWidth} from '@/utils/index';

interface IProps {
  isEdit: boolean;
  selected: boolean;
  data: ICategory;
  disabled?: boolean;
}

export const parentWidth = viewportWidth - 10;
export const itemWidth = parentWidth / 4;
export const itemHeight = 48;
export const margin = 5;

class Item extends React.PureComponent<IProps> {
  render() {
    const {data, isEdit, selected, disabled} = this.props;
    return (
      <View key={data.id} style={styles.itemWrapper}>
        <View style={[styles.item, disabled && styles.disabled]}>
          <Text>{data.name}</Text>
          {isEdit && !disabled && (
            <View style={styles.icon}>
              <Text style={styles.iconText}>{selected ? '-' : '+'}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemWrapper: {
    width: itemWidth,
    height: itemHeight,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    margin: margin,
    borderRadius: 4,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  icon: {
    position: 'absolute',
    top: -5,
    right: -5,
    height: 16,
    width: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f86442',
    borderRadius: 8,
  },
  iconText: {
    color: '#fff',
    lineHeight: 15,
  },
});

export default Item;
