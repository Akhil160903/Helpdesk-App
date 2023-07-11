/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Navigation from './src/navigation';
import { AppProvider } from './src/context/AppContext';

const App = () => {
  return (
    <AppProvider>
      <SafeAreaView style={styles.root}>
        <Navigation />
      </SafeAreaView>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
});

export default App;
