import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import GlobalBackground from '../components/GlobalBackground';
import GlassmorphicCard from '../components/GlassmorphicCard';
import NeonButton from '../components/NeonButton';
import NeonInput from '../components/NeonInput';
import * as Animatable from 'react-native-animatable';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (pwd) => {
    if (pwd.length < 6) return { strength: 0, color: '#ff4757', text: 'Weak' };
    if (pwd.length < 8) return { strength: 1, color: '#ffa502', text: 'Fair' };
    if (pwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
      return { strength: 2, color: '#00ff88', text: 'Strong' };
    }
    return { strength: 1, color: '#ffa502', text: 'Fair' };
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, always succeed
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = !isLogin ? getPasswordStrength(password) : null;

  return (
    <GlobalBackground>
      <View style={styles.container}>
        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          style={styles.content}
        >
          <GlassmorphicCard style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.title}>
                {isLogin ? 'Welcome Back' : 'Join Lookate'}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin ? 'Sign in to continue' : 'Create your account'}
              </Text>

              <View style={styles.form}>
                <NeonInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
                
                <NeonInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                {!isLogin && (
                  <>
                    <NeonInput
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                    />
                    
                    {password.length > 0 && (
                      <View style={styles.passwordStrength}>
                        <View style={styles.strengthBar}>
                          <View
                            style={[
                              styles.strengthFill,
                              { 
                                width: `${((passwordStrength.strength + 1) / 3) * 100}%`,
                                backgroundColor: passwordStrength.color
                              }
                            ]}
                          />
                        </View>
                        <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                          {passwordStrength.text}
                        </Text>
                      </View>
                    )}
                  </>
                )}

                <NeonButton
                  title={loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                  onPress={handleAuth}
                  disabled={loading}
                  style={styles.authButton}
                />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <NeonButton
                  title="Continue with Google"
                  onPress={() => Alert.alert('Demo', 'Google sign-in integration')}
                  variant="secondary"
                  style={styles.socialButton}
                />

                <TouchableOpacity
                  style={styles.switchMode}
                  onPress={() => setIsLogin(!isLogin)}
                >
                  <Text style={styles.switchText}>
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <Text style={styles.switchLink}>
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </GlassmorphicCard>
        </Animatable.View>
      </View>
    </GlobalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    minHeight: 400,
  },
  cardContent: {
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#00ff88',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  form: {
    width: '100%',
  },
  authButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 255, 136, 0.3)',
  },
  dividerText: {
    color: '#0099cc',
    marginHorizontal: 15,
    fontSize: 14,
  },
  socialButton: {
    marginBottom: 20,
  },
  switchMode: {
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    color: '#ccc',
    fontSize: 14,
  },
  switchLink: {
    color: '#00ff88',
    fontWeight: '600',
  },
  passwordStrength: {
    marginTop: 10,
    marginBottom: 10,
  },
  strengthBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 5,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    textAlign: 'right',
  },
});