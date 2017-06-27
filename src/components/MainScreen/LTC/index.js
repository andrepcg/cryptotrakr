import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, Text, Animated } from 'react-native';

import drill from '../../../assets/driller.png';

export default class BTC extends PureComponent {
  state = {
    anim: new Animated.Value(0),
  }

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    Animated.sequence([
      Animated.timing(this.state.anim, {
        toValue: 1,
        duration: 4000,
      }),
      Animated.timing(this.state.anim, {
        toValue: 0,
        duration: 4000,
      }),
    ]).start(this.startAnimation);
  }

  render() {
    const { anim } = this.state;
    return (
      <View style={styles.container}>
        <Animated.Image
          source={drill}
          style={[styles.image, {
            transform: [
              { scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }) },
              { rotate: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ['-10deg', '10deg'],
              }) },
            ] },
          ]}
        />
        <Text style={styles.progress}>In progress...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
  container: {
    paddingTop: 40,
    paddingBottom: 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: SUPER_DARKER_BLUE,
  },
  progress: {
    // color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
