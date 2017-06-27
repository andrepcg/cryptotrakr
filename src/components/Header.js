import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { DARKER_BLUE } from '../styles';

export default function Header({ openDrawer, openSettings }) {
  return (
    <View style={styles.toolbar}>
      <Icon onPress={openDrawer} style={styles.toolbarButton} name="menu" size={30} color="#fff" />
      <Text style={styles.toolbarTitle}>Teste cenas</Text>
      <TouchableOpacity onPress={openSettings}>
        <Icon style={styles.toolbarButton} name="settings" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: DARKER_BLUE,
    paddingTop: 20,
    flexDirection: 'row',
    height: 80,
  },
  toolbarButton: {
    width: 50,
    color: '#fff',
    textAlign: 'center',
  },
  toolbarTitle: {
    color: '#fff',
    // textAlign: 'center',
    paddingLeft: 30,
    paddingTop: 0,
    flex: 1,
  },
});
