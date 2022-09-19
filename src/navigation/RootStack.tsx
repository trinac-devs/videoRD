import React, {FunctionComponent} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VideoListScreen from '../screens/VideoListScreen';

const Stack = createNativeStackNavigator();

const RootStack: FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={{header: () => null}}>
      <Stack.Screen name="VideoListScreen" component={VideoListScreen} />
    </Stack.Navigator>
  );
};

export default RootStack;
