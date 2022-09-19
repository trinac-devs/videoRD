/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {ActivityIndicator, FAB} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import PagerView from 'react-native-pager-view';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useGetAllVideosQuery} from '../redux/apis';
import {selectAllVideos} from '../redux/slices';
import {RootStackParamList} from '../navigation/RootStack';
import {useIsFocused} from '@react-navigation/native';

interface VideoListScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'VideoListScreen'> {}

const VideoListScreen: FunctionComponent<VideoListScreenProps> = ({
  navigation,
}) => {
  const {isLoading, isFetching, refetch} = useGetAllVideosQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const [paused, setPaused] = useState(false);
  const [currPage, setCurrPage] = useState(0);

  const videos = useSelector(selectAllVideos);

  useEffect(() => {
    // DeviceInfo.getUniqueId().then(id => {
    //   console.log(id);
    // });
  }, []);

  const isFocused = useIsFocused();

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => {
            navigation.push('VideoCreateScreen');
          }}
        />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isFocused) {
    return (
      <View style={styles.container}>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => {
            navigation.push('VideoCreateScreen');
          }}
        />

        {videos.length > 0 ? (
          <TouchableOpacity
            style={styles.fullVideoPreviewBtn}
            onPress={() => {
              navigation.push('FullVideoScreen', {
                video: videos[currPage],
              });
            }}>
            <Ionicons color="#fff" size={27} name="videocam-outline" />
          </TouchableOpacity>
        ) : null}

        <PagerView
          onPageSelected={e => {
            setCurrPage(e.nativeEvent.position);
            setPaused(false);
          }}
          style={styles.pagerView}
          orientation="vertical"
          // @ts-ignore
          maxRenderWindow={11}
          initialPage={0}>
          {videos.map((item, index) => (
            <View key={item.id} style={styles.videoContainer}>
              <Video
                key={item.id}
                resizeMode="contain"
                poster={item.thumbnailUrl}
                source={{
                  uri: item.shortUrl,
                }}
                style={StyleSheet.absoluteFill}
                controls={false}
                repeat
                paused={currPage !== index ? true : paused}
                onError={error => {
                  console.log(error, 'error+loading_video');
                }}
                onBuffer={buffer => {
                  // console.log(buffer, 'buffer_data');
                }}
                useTextureView={false}
                playInBackground={true}
                disableFocus={true}
              />
            </View>
          ))}
        </PagerView>
      </View>
    );
  }

  return null;

  // </ScrollView>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },

  pagerView: {
    flex: 1,
  },

  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },

  fullVideoPreviewBtn: {
    height: 55,
    width: 55,
    // borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, .3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 20,
    borderRadius: 5,
  },
});

export default VideoListScreen;
