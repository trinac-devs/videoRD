import React from 'react';
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';

import RootStack from './src/navigation/RootStack';

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={DefaultTheme}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

export default App;
