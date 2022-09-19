import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getUniqueId} from 'react-native-device-info';
import RNFS from 'react-native-fs';

import {UPLOAD_VIDEO} from '../apis';
import {RootState} from '../store';

// First, create the thunk
const uploadVideo = createAsyncThunk(
  'video-uploader/upload',
  async (videoPath: string, thunkApi) => {
    const userId = await getUniqueId();

    console.log(videoPath, 'videoPath');

    try {
      const parsedFile = await RNFS.stat(videoPath);

      const uploadData = await RNFS.uploadFiles({
        toUrl: UPLOAD_VIDEO,
        files: [
          {
            name: 'video',
            filename: 'video.mp4',
            filepath: parsedFile.originalFilepath,
            filetype: 'video/mp4',
          },
        ],
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },

        fields: {
          userId,
        },
        // begin: uploadBegin,
        progress: response => {
          const percentage = Math.floor(
            (response.totalBytesSent / response.totalBytesExpectedToSend) * 100,
          );
          console.log('UPLOAD IS ' + percentage + '% DONE!');

          thunkApi.dispatch(updatePercentage(percentage));
        },
      }).promise;

      return uploadData;
    } catch (error) {
      console.log(error, 'error_upload');
    }
    // const response = await userAPI.fetchById(userId);
    // return response.data;
  },
);

interface VideoUploaderState {
  token: null | string;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  isUploading: boolean;
  uploadPercentage: number;
  hasUploaded: boolean;
}

const INITIAL_STATE = {
  token: null,
  loading: 'idle',
  isUploading: false,
  uploadPercentage: 0,
  hasUploaded: false,
} as VideoUploaderState;

// Then, handle actions in your reducers:
const videoUploaderSlice = createSlice({
  name: 'videoUploader',
  initialState: INITIAL_STATE,
  reducers: {
    updatePercentage: (state, action: PayloadAction<number>) => {
      state.uploadPercentage = action.payload;
    },

    resetVideoUploader: state => {
      state.loading = 'idle';
      state.uploadPercentage = 0;
      state.hasUploaded = false;
    },

    // resetVideoUploader(state) {
    //   state.loading = 'idle';
    //   state.uploadPercentage = 0;
    //   state.hasUploaded = false;
    // },
  },

  extraReducers: builder => {
    builder.addCase(uploadVideo.pending, state => {
      state.isUploading = true;
    });

    builder.addCase(uploadVideo.fulfilled, state => {
      state.isUploading = false;
      state.hasUploaded = true;
    });
  },
});

export const videoUploaderReducer = videoUploaderSlice.reducer;
export const selectUploader = (state: RootState) => state.videoUploaderReducer;
export const {updatePercentage, resetVideoUploader} =
  videoUploaderSlice.actions;
export {uploadVideo};
