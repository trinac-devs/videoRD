import React, {FunctionComponent} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';

import {RootStackParamList} from '../navigation/RootStack';
import {useIsFocused} from '@react-navigation/native';

interface FullVideoScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'FullVideoScreen'> {}

const FullVideoScreen: FunctionComponent<FullVideoScreenProps> = ({
  navigation,
  route,
}) => {
  const {video} = route.params;
  const isFocused = useIsFocused();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.videoCancel}
        onPress={() => {
          navigation.pop();
        }}>
        <Ionicons color="#fff" size={27} name="chevron-back" />
      </TouchableOpacity>

      {isFocused && (
        <Video
          source={{
            uri: video.streamingUrl,
          }}
          style={StyleSheet.absoluteFill}
          controls
          poster={video.thumbnailUrl}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },

  videoCancel: {
    height: 55,
    width: 55,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, .3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 20,
  },
});

export default FullVideoScreen;
