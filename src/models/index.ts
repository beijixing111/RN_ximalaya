import {DvaLoadingState} from 'dva-loading-ts';
import home from './home';
import category from './category';
import found from './found';

const models = [home, category, found];

export type RootState = {
  home: typeof home.state;
  category: typeof category.state;
  loading: DvaLoadingState;
} & {
  [key: string]: typeof home.state;
};

export default models;
