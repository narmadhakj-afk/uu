import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';

const bounceAnimation = {
  0: { scale: 1 },
  0.5: { scale: 0.95 },
  1: { scale: 1 },
};

export default function NeonButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  style,
  disabled = false 
}) {
  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress && onPress();
    }
  };

  return (
    <Animatable.View
      animation={bounceAnimation}
      duration={200}
      useNativeDriver
    >
      <TouchableOpacity
        style={[
          styles.button,
          variant === 'secondary' && styles.secondaryButton,
          disabled && styles.disabledButton,
          style
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.buttonText,
          variant === 'secondary' && styles.secondaryButtonText,
          disabled && styles.disabledButtonText
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: 2,
    borderColor: '#00ff88',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: 'rgba(0, 153, 204, 0.1)',
    borderColor: '#0099cc',
    shadowColor: '#0099cc',
  },
  disabledButton: {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderColor: '#666',
    shadowColor: 'transparent',
  },
  buttonText: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#0099cc',
  },
  disabledButtonText: {
    color: '#666',
  },
});