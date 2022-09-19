import type {BaseQueryFn} from '@reduxjs/toolkit/query';
import type {AxiosRequestConfig, AxiosError} from 'axios';
import axios from 'axios';

import {parseAxiosError} from '../../utils';

const BASE_URL = 'https://mydoormot.xyz';

// NOTE: MEDIA_API
const MEDIA_ROUTE = `${BASE_URL}/api/v1/media`;

export const GET_ALL_VIDEOS = `${MEDIA_ROUTE}/get-all-videos`;

const axiosBaseQuery = (): BaseQueryFn<
  {
    url: string;
    method?: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
  },
  unknown,
  {
    status?: number;
    data: any;
    errorMessage: string;
  }
> => {
  return async ({url, method = 'get', data, params}) => {
    try {
      const result = await axios({url, method, data, params});

      return {
        data: result.data.data,
        meta: {token: result.data.token},
      };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
          errorMessage: parseAxiosError(err),
        },
      };
    }
  };
};

export {axiosBaseQuery, BASE_URL};
