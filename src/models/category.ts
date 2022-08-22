import storage, {load} from '@/config/storage';
import axios from 'axios';
import {Effect, Model, SubscriptionsMapObject} from 'dva-core-ts';
import {Reducer} from 'redux';
import {RootState} from './index';

const CATEGORY_URL = '/mock/11/bear/category';

export interface ICategory {
  id: string;
  name: string;
  classify?: string;
}

interface CategoryModelState {
  isEdit: boolean;
  myCategorys: ICategory[];
  categorys: ICategory[];
}

interface CategoryModel extends Model {
  namespace: 'category';
  state: CategoryModelState;
  reducers: {
    setState: Reducer<CategoryModelState>;
  };
  effects: {
    loadData: Effect;
    toggle: Effect;
  };
  subscriptions: SubscriptionsMapObject;
}

const initialState = {
  isEdit: false,
  myCategorys: [
    {id: 'home', name: '推荐'},
    {id: 'vip', name: 'Vip'},
  ],
  categorys: [],
};

const categoryModel: CategoryModel = {
  namespace: 'category',
  state: initialState,
  effects: {
    *loadData(_, {call, put}) {
      // 从storage 获取数据
      const myCategorys = yield call(load, {key: 'myCategorys'});
      const categorys = yield call(load, {key: 'categorys'});
      // 发起 action, 将数据保存都state
      if (myCategorys) {
        yield put({
          type: 'setState',
          payload: {
            myCategorys,
            categorys,
          },
        });
      } else {
        yield put({
          type: 'setState',
          payload: {
            categorys,
          },
        });
      }
    },
    *toggle({payload}, {put, select}) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const category = yield select(({category}: RootState) => category);
      yield put({
        type: 'setState',
        payload: {
          isEdit: !category.isEdit,
          myCategorys: payload.myCategorys,
        },
      });
      if (category.isEdit) {
        storage.save({
          key: 'myCategorys',
          data: payload.myCategorys,
        });
      }
    },
  },
  reducers: {
    setState(state = initialState, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({
        type: 'loadData',
      });
    },
    asyncStorage() {
      storage.sync.categorys = async () => {
        const data = await axios.get(CATEGORY_URL);
        // console.log('datasss----------:', data.data);
        return data.data;
      };
      storage.sync.myCategorys = async () => {
        return null;
      };
    },
  },
};

export default categoryModel;
