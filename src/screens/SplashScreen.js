import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#F0C4BF',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 6000,
      useNativeDriver: true,
    }).start();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setTimeout(() => {
          navigation.navigate('Start');
        }, 6000);
      } else {
        setTimeout(() => {
          navigation.navigate('Main');
        }, 6000);
      }
    });

    return () => unsubscribe();
  }, [auth, progress, navigation]);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        source={require('../assets/lingon-splash.json')}
        autoPlay
        loop={false}
      />
    </View>
  );
}

export default SplashScreen;
