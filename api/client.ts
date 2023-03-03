import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import cusToast from '../components/navigation/CusToast';

const client = axios.create({
  baseURL: 'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:4000/api',
  headers: { 'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjEsImlhdCI6MTY3MzQ4MzQ2NX0.ZbFX8K1lEEX2Ce-2dPQl7hyq6Y4DBlzL_4fdIu9TzH8` },
  timeout: 1500,
  maxRedirects: 3,
  beforeRedirect: (res) => {
    console.log('beforeRedirect', res);

    // if (error.response && error.response.status == '409' && error.response.data) {
    //   // console.log('error.response', error.response);
    //   // console.log('Request: failed ', config.config.method, config.config.url, error.response.data);
    //   if (error.response.data.message) cusToast(error.response.data.message);
    //   // return Promise.reject(error);
    //   return Promise.reject(error);
  }

  // },
  // transformRequest: [(data, headers) => {
  //   return data;
  // }],
  // transformResponse: [(data) => {
  //   console.log('transformResponse', data);

  //   return data;
  // }]
});

// client.defaults.baseURL =
//   '';
// client.defaults.headers.common[
//   'Authorization'
// ] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjEsImlhdCI6MTY3MzQ4MzQ2NX0.ZbFX8K1lEEX2Ce-2dPQl7hyq6Y4DBlzL_4fdIu9TzH8`;

// client.defaults.timeout = 1500;


//3회 반복하는 소스

interface AxiosCustomRequestConfig extends AxiosRequestConfig {
  retryCount: number
}

const MAX_RETRY_COUNT = 2

client.interceptors.response.use(
  (config) => {
    //성공시 진입
    console.log('Request: Success', config.config.method, config.config.url, config.data)
    return config
  },
  (error: AxiosError) => {

    //실패시 진입
    const config = error.config as AxiosCustomRequestConfig
    config.retryCount = config.retryCount ?? 0

    console.log('Request: failed ', config.method, config.url, config.data);
    //error.response.status == '409'
    if (error.response && error.response.data && error.response.data.message) {
      // console.log('error.response', error.response);
      // console.log('Request: failed ', config.config.method, config.config.url, error.response.data);
      if (error.response.data.message) cusToast(error.response.data.message);
      // return Promise.reject(error);

    } else {

      // console.log('RETRY COUNT:', config.retryCount)

      // const shouldRetry = config.retryCount < MAX_RETRY_COUNT
      // if (shouldRetry) {
      //   config.retryCount += 1
      //   return client.request(config)
      // }

      // return Promise.reject(error);
    }
    return Promise.reject(error);
  }
)

export default client;
