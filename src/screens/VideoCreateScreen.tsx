import React, {FunctionComponent, useEffect, useState, useRef} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from '../navigation/RootStack';
import {ActivityIndicator, MD3Colors} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import {Camera, useCameraDevices, VideoFile} from 'react-native-vision-camera';
import {useDispatch} from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';

import {uploadVideo} from '../redux/slices';

interface VideoCreateScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'VideoCreateScreen'> {}

const VideoCreateScreen: FunctionComponent<VideoCreateScreenProps> = props => {
  const {navigation} = props;

  const cameraRef = useRef<Camera | null>(null);

  const devices = useCameraDevices();
  const dispatch = useDispatch();

  const backDevice = devices.back;
  const frontDevice = devices.front;

  const [isLoading, setIsLoading] = useState(true);
  const [isBackCameraSelected, setIsBackCameraSelected] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [hasFinishedRecording, setHasFinishedRecording] = useState(false);
  const [videoFile, setVideoFile] = useState<null | VideoFile>(null);

  const isFocused = useIsFocused();

  // console.log(videoFile);

  useEffect(() => {
    validatePermission();
  }, []);

  const validatePermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const microphonePermission = await Camera.getMicrophonePermissionStatus();

    let hasPermission = false;

    if (
      cameraPermission === 'authorized' &&
      microphonePermission === 'authorized'
    ) {
      hasPermission = true;
    }

    if (cameraPermission !== 'authorized') {
      const newCameraPermission = await Camera.requestCameraPermission();

      if (newCameraPermission === 'authorized') {
        hasPermission = true;
      } else {
        hasPermission = false;
      }
    }

    if (microphonePermission !== 'authorized') {
      const newMicrophonePermission =
        await Camera.requestMicrophonePermission();

      if (newMicrophonePermission === 'authorized') {
        hasPermission = true;
      } else {
        hasPermission = false;
      }
    }

    if (hasPermission) {
      setIsLoading(false);
    } else {
      Linking.openSettings();
    }
  };

  const renderCameraView = () => {
    if (isLoading || !backDevice || !frontDevice) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <Camera
          style={StyleSheet.absoluteFill}
          device={isBackCameraSelected ? backDevice : frontDevice || backDevice}
          isActive={isFocused}
          ref={cameraRef}
          video={true}
          audio={true}
          photo={true}
          preset="medium"
          orientation="portrait"
          frameProcessorFps={1}
        />
      );
    }
  };

  const recordVideo = async () => {
    if (!isRecording) {
      cameraRef.current?.startRecording({
        flash: !isBackCameraSelected ? 'off' : isFlashOn ? 'on' : 'off',
        onRecordingFinished: video => {
          setVideoFile(video);
        },
        onRecordingError: error => console.error(error, 'recording_error'),
        fileType: 'mp4',
      });

      setIsRecording(true);
    } else {
      await cameraRef.current?.stopRecording();
      setIsRecording(false);
      setHasFinishedRecording(true);
    }
  };

  const renderComponent = () => {
    if (!hasFinishedRecording) {
      return (
        <>
          <TouchableOpacity
            style={styles.videoCancel}
            onPress={() => {
              navigation.pop();
            }}>
            <Ionicons color="#fff" size={27} name="chevron-back" />
          </TouchableOpacity>
          {renderCameraView()}
          <View style={styles.controlContainer}>
            <TouchableOpacity
              disabled={isRecording}
              style={styles.controlButton}
              onPress={() => setIsBackCameraSelected(prevState => !prevState)}>
              <Ionicons color="#fff" size={25} name="camera-reverse-outline" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.recordButton} onPress={recordVideo}>
              {isRecording && (
                <Ionicons color={MD3Colors.error50} size={25} name="square" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isRecording}
              style={styles.controlButton}
              onPress={() => setIsFlashOn(prevState => !prevState)}>
              <Ionicons
                color={isFlashOn ? 'yellow' : '#fff'}
                size={25}
                name="flash"
              />
            </TouchableOpacity>
          </View>
        </>
      );
    } else {
      return (
        <View style={styles.videoContainer}>
          <TouchableOpacity
            style={styles.videoCancel}
            onPress={() => {
              setIsRecording(false);
              setHasFinishedRecording(false);
              setVideoFile(null);
            }}>
            <Ionicons color="#fff" size={27} name="close" />
          </TouchableOpacity>
          {videoFile && isFocused && (
            <Video
              source={{
                uri: videoFile.path,
              }}
              style={StyleSheet.absoluteFill}
              controls
            />
          )}

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => {
              // @ts-ignore
              dispatch(uploadVideo(videoFile!.path!));

              // console.log(uploadData, 'uploadData');
              navigation.pop();
              // setIsRecording(false);
              // setHasFinishedRecording(false);
              // setVideoFile(null);
            }}>
            <Ionicons color="#fff" size={27} name="cloud-upload-outline" />
          </TouchableOpacity>
        </View>
      );
    }
  };

  return <View style={styles.container}>{renderComponent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },

  controlContainer: {
    position: 'absolute',
    bottom: 20,
    zIndex: 10,
    left: 0,
    right: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },

  controlButton: {
    height: 45,
    width: 45,
    backgroundColor: 'rgba(255, 255, 255, .3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },

  recordButton: {
    height: 65,
    width: 65,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  videoContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
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

  uploadButton: {
    height: 55,
    width: 55,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, .3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 20,
  },
});

export default VideoCreateScreen;
