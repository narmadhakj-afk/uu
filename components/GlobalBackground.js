import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Svg, { 
  Defs, 
  Pattern, 
  Rect, 
  Line, 
  Circle,
  LinearGradient as SvgLinearGradient,
  Stop 
} from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const pulseAnimation = {
  0: { opacity: 0.4 },
  0.5: { opacity: 1 },
  1: { opacity: 0.4 },
};

export default function GlobalBackground({ children }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f0f23', '#16213e', '#1a1a2e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      
      {/* Technology Map Grid */}
      <Svg 
        height={height} 
        width={width} 
        style={styles.svgBackground}
      >
        <Defs>
          <Pattern
            id="grid"
            patternUnits="userSpaceOnUse"
            width="40"
            height="40"
          >
            <Line
              x1="0"
              y1="0"
              x2="40"
              y2="0"
              stroke="rgba(0, 255, 136, 0.2)"
              strokeWidth="0.5"
            />
            <Line
              x1="0"
              y1="0"
              x2="0"
              y2="40"
              stroke="rgba(0, 255, 136, 0.2)"
              strokeWidth="0.5"
            />
          </Pattern>
          <SvgLinearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00ff88" stopOpacity="1" />
            <Stop offset="100%" stopColor="#0099cc" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        
        <Rect width={width} height={height} fill="url(#grid)" />
        
        {/* Glowing Map Pins */}
        <Circle cx={width * 0.2} cy={height * 0.3} r="4" fill="url(#pinGrad)" opacity="0.8" />
        <Circle cx={width * 0.7} cy={height * 0.2} r="4" fill="url(#pinGrad)" opacity="0.8" />
        <Circle cx={width * 0.5} cy={height * 0.6} r="4" fill="url(#pinGrad)" opacity="0.8" />
        <Circle cx={width * 0.8} cy={height * 0.7} r="4" fill="url(#pinGrad)" opacity="0.8" />
        <Circle cx={width * 0.3} cy={height * 0.8} r="4" fill="url(#pinGrad)" opacity="0.8" />
      </Svg>

      {/* Pulsing Overlay */}
      <Animatable.View
        animation={pulseAnimation}
        iterationCount="infinite"
        duration={3000}
        style={styles.pulseOverlay}
      />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  pulseOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 255, 136, 0.02)',
  },
});