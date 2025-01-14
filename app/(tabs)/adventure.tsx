import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function adventure() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adventure</Text>
      <Text>Welcome to the Adventure screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});