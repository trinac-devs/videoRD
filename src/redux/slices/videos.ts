import {createSlice} from '@reduxjs/toolkit';
import {Video} from '../../utils/types';
import {videoApi} from '../apis';
import {RootState} from '../store';

// import type { RootState } from '../../app/store';

type VideoState = {
  videos: Video[];
};

const videoSlice = createSlice({
  name: 'videoReducer',
  initialState: {
    videos: [],
  } as VideoState,
  reducers: {
    // updateUser: (state, action: PayloadAction<User>) => {
    //   state.user = action.payload;
    // },
    // onUserAuth: (state, action: PayloadAction<{user: User; token: string}>) => {
    //   state.token = action.payload.token;
    //   state.user = action.payload.user;
    // },
  },
  extraReducers: builder => {
    builder.addMatcher(
      videoApi.endpoints.getAllVideos.matchFulfilled,
      (state, {payload}) => {
        state.videos = payload;
      },
    );
    // .addMatcher(
    //   notificationApi.endpoints.getUnreadNotification.matchFulfilled,
    //   (state, {payload}) => {
    //     state.unreadNotifications = payload;
    //   },
    // );
  },
});

export const videoReducer = videoSlice.reducer;

export const selectAllVideos = (state: RootState) => state.videoReducer.videos;

// export const {updateUser, onUserAuth} = videoSlice.actions;
