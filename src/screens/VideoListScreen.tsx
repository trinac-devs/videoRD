import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useSelector} from 'react-redux';

import {useGetAllVideosQuery} from '../redux/apis';
import {selectAllVideos} from '../redux/slices';

const VideoListScreen = () => {
  const {isLoading, isFetching, refetch} = useGetAllVideosQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const videos = useSelector(selectAllVideos);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">VideoListScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default VideoListScreen;
