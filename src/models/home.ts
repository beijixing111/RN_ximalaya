import {Effect, Model} from 'dva-core-ts';
import {Reducer} from 'redux';
import axios from 'axios';
import {RootState} from './index';

// 轮播图
const CAROUSEL_URL = '/mock/11/bear/carousel';
// 猜你喜欢
const GUESS_URL = '/mock/11/bear/guess';
// 首页列表
const CHANNEL_URL = '/mock/11/bear/channel';

export interface ICarousel {
  id: string;
  image: string;
  colors: [string, string];
}

export interface IGuess {
  id: string;
  title: string;
  image: string;
}

export interface IChannel {
  id: string;
  title: string;
  image: string;
  remark: string;
  played: number;
  playing: number;
}

export interface IPagination {
  current: number;
  total: number;
  hasMore: boolean;
}

export interface HomeState {
  carousels: ICarousel[];
  activeCarouselIndex: number; //轮播图的下标
  gradientVisible: boolean; //渐变色组件是否显示状态
  guess: IGuess[];
  channels: IChannel[];
  pagination: IPagination;
}

interface HomeModel extends Model {
  namespace: 'home';
  state: HomeState;
  reducers: {
    setState: Reducer<HomeState>;
  };
  effects: {
    fetchCarousels: Effect;
    fetchGuess: Effect;
    fetchChannels: Effect;
  };
}

const initialState: HomeState = {
  carousels: [],
  activeCarouselIndex: 0,
  gradientVisible: true,
  guess: [],
  channels: [],
  pagination: {
    current: 1,
    total: 0,
    hasMore: true,
  },
};

const homeModel: HomeModel = {
  namespace: 'home',
  state: initialState,
  reducers: {
    setState(state = initialState, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    *fetchCarousels(_, {call, put}) {
      const {data} = yield call(axios.get, CAROUSEL_URL);
      console.log('Carousels', data);
      yield put({
        type: 'setState',
        payload: {
          carousels: data,
        },
      });
    },
    *fetchGuess(_, {call, put}) {
      const {data} = yield call(axios.get, GUESS_URL);
      // console.log(data);
      yield put({
        type: 'setState',
        payload: {
          guess: data,
        },
      });
    },
    *fetchChannels({callback, payload}, {call, put, select}) {
      const {channels, pagination} = yield select(
        (state: RootState) => state.home,
      );
      let page = 1;
      if (payload && payload.loadMore) {
        page = pagination.current + 1;
      }
      console.log('page', page);
      const {data} = yield call(axios.get, CHANNEL_URL, {
        params: {
          page,
        },
      });
      let newChannels = data.results;
      if (payload && payload.loadMore) {
        newChannels = channels.concat(newChannels);
      }
      let paginationRes = data.pagination;
      // console.log(paginationRes);
      yield put({
        type: 'setState',
        payload: {
          channels: newChannels,
          pagination: {
            current: paginationRes.current,
            total: paginationRes.total,
            hasMore: newChannels.length < 20, // paginationRes.total,
          },
        },
      });
      if (typeof callback === 'function') {
        callback();
      }
    },
  },
};

export default homeModel;
