import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0f0f23',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00ff88',
    marginBottom: 20,
  },
  link: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  linkText: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: '500',
  },
});