import {createApi} from '@reduxjs/toolkit/query/react';

import {axiosBaseQuery, GET_ALL_VIDEOS} from '.';
import {Video} from '../../utils/types';

export const videoApi = createApi({
  reducerPath: 'videoApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Videos'],

  endpoints(builder) {
    return {
      getAllVideos: builder.query<Video[], void>({
        query: () => ({
          url: GET_ALL_VIDEOS,
          method: 'get',
        }),
        providesTags: ['Videos'],
      }),
    };
  },
});

export const {useGetAllVideosQuery} = videoApi;
