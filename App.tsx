import React from 'react';
import {SafeAreaView} from 'react-native';
import VideoScreen from './src/screens/VideoScreen';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <VideoScreen />
    </SafeAreaView>
  );
};

export default App;
