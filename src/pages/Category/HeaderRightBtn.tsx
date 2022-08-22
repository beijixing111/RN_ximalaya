import {RootState} from '@/models/index';
import React from 'react';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {connect, ConnectedProps} from 'react-redux';

const mapStateToProps = ({category}: RootState) => {
  return {
    idEdit: category.isEdit,
  };
};

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {
  onSubmit: () => void;
}

class HeaderRightBtn extends React.PureComponent<IProps> {
  render() {
    const {onSubmit, idEdit} = this.props;
    return (
      <HeaderButtons>
        <Item
          key={'1'}
          title={idEdit ? '完成' : '编辑'}
          color="#333"
          onPress={onSubmit}
        />
      </HeaderButtons>
    );
  }
}

export default connector(HeaderRightBtn);
