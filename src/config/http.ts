import axios from 'axios';
import Config from 'react-native-config';
import apiKeyCode from '@/config/key';

axios.defaults.baseURL = Config.API_URL;

// 请求拦截器
axios.interceptors.request.use(
  function (config) {
    console.log('请求config', config);
    config.headers = {
      icode: apiKeyCode, // 填写自己的key值
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// 响应拦截器
axios.interceptors.response.use(
  function (response) {
    console.log('响应response', response);
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  },
);
