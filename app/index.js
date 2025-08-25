import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import GlobalBackground from '../components/GlobalBackground';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const zoomAnimation = {
  0: { scale: 0.5, opacity: 0 },
  0.6: { scale: 1.1, opacity: 1 },
  1: { scale: 1, opacity: 1 },
};

const fadeInUp = {
  0: { opacity: 0, translateY: 50 },
  1: { opacity: 1, translateY: 0 },
};

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GlobalBackground>
      <View style={styles.container}>
        <Animatable.View
          animation={zoomAnimation}
          duration={2000}
          style={styles.logoContainer}
        >
          <LinearGradient
            colors={['#00ff88', '#0099cc', '#6c5ce7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Text style={styles.logo}>LOOKATE</Text>
          </LinearGradient>
        </Animatable.View>

        <Animatable.View
          animation={fadeInUp}
          duration={1500}
          delay={2000}
          style={styles.taglineContainer}
        >
          <Text style={styles.tagline}>
            Snap it. Find it. Do it. Smarter.
          </Text>
          <Text style={styles.subtitle}>
            AI-Powered Discovery & Task Intelligence
          </Text>
        </Animatable.View>

        {/* Animated Car Path */}
        <Animatable.View
          animation={{
            0: { translateX: -width },
            1: { translateX: width }
          }}
          duration={3000}
          delay={1000}
          style={styles.carContainer}
        >
          <View style={styles.car}>
            <Text style={styles.carIcon}>🚗</Text>
          </View>
        </Animatable.View>
      </View>
    </GlobalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 50,
    borderRadius: 20,
    padding: 2,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  logoGradient: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 18,
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 255, 136, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 20,
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#0099cc',
    textAlign: 'center',
    opacity: 0.8,
  },
  carContainer: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
  },
  car: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  carIcon: {
    fontSize: 24,
  },
});