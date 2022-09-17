import React from 'react';
import {StyleSheet, View} from 'react-native';

import Video from 'react-native-video';

const VideoScreen = () => {
  return (
    <View style={styles.container}>
      <Video
        source={{
          // uri: 'https://f9de-185-192-71-81.ngrok.io/videos/myvid/test-video.m3u8',
          // uri: 'https://f9de-185-192-71-81.ngrok.io/videos/test-video.mp4',
          uri: 'https://f9de-185-192-71-81.ngrok.io/videos/video-large/test-video.m3u8',
          // uri: 'https://f9de-185-192-71-81.ngrok.io/videos/video-large.mp4',
        }}
        style={StyleSheet.absoluteFill}
        controls
        repeat
        onError={error => {
          console.log(error, 'error+loading_video');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default VideoScreen;
