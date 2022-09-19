import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useSelector} from 'react-redux';

import DeviceInfo from 'react-native-device-info';
import PagerView from 'react-native-pager-view';
import Video from 'react-native-video';

import {useGetAllVideosQuery} from '../redux/apis';
import {selectAllVideos} from '../redux/slices';

const VideoListScreen = () => {
  const {isLoading, isFetching, refetch} = useGetAllVideosQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const [paused, setPaused] = useState(true);

  const videos = useSelector(selectAllVideos);

  console.log(videos);

  useEffect(() => {
    DeviceInfo.getUniqueId().then(id => {
      console.log(id);
    });
  }, []);

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pagerView}
        orientation="vertical"
        initialPage={0}>
        {videos.map(item => (
          <View key={item.id} style={{backgroundColor: '#000'}}>
            <Video
              poster={item.thumbnailUrl}
              source={{
                uri: item.shortUrl,
              }}
              style={StyleSheet.absoluteFill}
              controls={false}
              repeat
              paused={paused}
              onError={error => {
                console.log(error, 'error+loading_video');
              }}
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  pagerView: {
    flex: 1,
  },
});

export default VideoListScreen;
