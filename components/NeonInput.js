import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function NeonInput({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  style 
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Animatable.View
      animation={isFocused ? 'pulse' : undefined}
      duration={1000}
      iterationCount={isFocused ? 'infinite' : 1}
      style={[styles.container, style]}
    >
      <TextInput
        style={[
          styles.input,
          isFocused && styles.focusedInput
        ]}
        placeholder={placeholder}
        placeholderTextColor="rgba(0, 255, 136, 0.5)"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginVertical: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    borderRadius: 15,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    color: '#fff',
    fontSize: 16,
  },
  focusedInput: {
    borderColor: '#00ff88',
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
});