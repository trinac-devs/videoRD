import React, {FunctionComponent, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {MD3Colors, Text} from 'react-native-paper';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';

import {resetVideoUploader, selectUploader} from '../redux/slices';
import {Video} from '../utils/types';

import VideoListScreen from '../screens/VideoListScreen';
import VideoCreateScreen from '../screens/VideoCreateScreen';
import FullVideoScreen from '../screens/FullVideoScreen';

export type RootStackParamList = {
  VideoListScreen: undefined;
  VideoCreateScreen: undefined;
  FullVideoScreen: {video: Video};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {uploadPercentage, isUploading, hasUploaded} =
    useSelector(selectUploader);

  useEffect(() => {
    if (hasUploaded) {
      setTimeout(() => {
        dispatch(resetVideoUploader());
      }, 5000);
    }
  }, [hasUploaded, dispatch]);

  return (
    <View style={{flex: 1}}>
      {isUploading && (
        <View style={styles.uploadIndicator}>
          <Text style={styles.indicatorText} variant="labelMedium">
            Uploading {uploadPercentage}%
          </Text>
        </View>
      )}

      {hasUploaded && (
        <View
          style={[
            styles.uploadIndicator,
            {backgroundColor: 'green', height: 45},
          ]}>
          <Text style={styles.indicatorText} variant="labelMedium">
            Your video has been uploaded and is being processed, you would be
            notified once it's ready.
          </Text>
        </View>
      )}
      <Stack.Navigator screenOptions={{header: () => null}}>
        <Stack.Screen name="VideoListScreen" component={VideoListScreen} />
        <Stack.Screen name="VideoCreateScreen" component={VideoCreateScreen} />
        <Stack.Screen name="FullVideoScreen" component={FullVideoScreen} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadIndicator: {
    height: 42,
    backgroundColor: MD3Colors.error50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  indicatorText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default RootStack;
