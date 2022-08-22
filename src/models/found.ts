import {Model, Effect} from 'dva-core-ts';
import axios from 'axios';

const FOUND_URL = '/mock/11/bear/found/list';

interface IUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface IFound {
  id: string;
  title: string;
  videoUrl: string;
  user: IUser;
}

interface FoundModel extends Model {
  namespace: 'found';
  effects: {
    fetchList: Effect;
  };
}

const foundModel: FoundModel = {
  namespace: 'found',
  state: {},
  effects: {
    *fetchList({callback}, {call}) {
      const {data} = yield call(axios.get, FOUND_URL);
      if (typeof callback === 'function') {
        callback(data);
      }
    },
  },
};

export default foundModel;
