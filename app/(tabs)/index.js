import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalBackground from '../../components/GlobalBackground';
import GlassmorphicCard from '../../components/GlassmorphicCard';
import NeonInput from '../../components/NeonInput';
import { Mic, Camera, Search, Zap, MapPin, Clock } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';

const FeatureCard = ({ icon: Icon, title, description, color, delay = 0 }) => (
  <Animatable.View
    animation="fadeInUp"
    duration={800}
    delay={delay}
    style={styles.featureCard}
  >
    <TouchableOpacity
      onPress={() => Alert.alert('Feature', `${title} coming soon!`)}
      activeOpacity={0.7}
    >
      <GlassmorphicCard style={styles.featureCardContent}>
        <View style={styles.featureIcon}>
          <Icon color={color} size={32} />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </GlassmorphicCard>
    </TouchableOpacity>
  </Animatable.View>
);

const RecentSearch = ({ query, time, delay = 0 }) => (
  <Animatable.View
    animation="fadeInRight"
    duration={600}
    delay={delay}
    style={styles.recentSearchItem}
  >
    <TouchableOpacity style={styles.recentSearchContent}>
      <View style={styles.recentSearchIcon}>
        <Search color="#00ff88" size={16} />
      </View>
      <View style={styles.recentSearchText}>
        <Text style={styles.recentSearchQuery}>{query}</Text>
        <Text style={styles.recentSearchTime}>{time}</Text>
      </View>
    </TouchableOpacity>
  </Animatable.View>
);

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      icon: Camera,
      title: 'Visual Search',
      description: 'Snap a photo to discover and identify anything',
      color: '#00ff88',
      delay: 0,
    },
    {
      icon: Mic,
      title: 'Voice Assistant',
      description: 'Ask questions and get intelligent answers',
      color: '#0099cc',
      delay: 200,
    },
    {
      icon: MapPin,
      title: 'Smart Locations',
      description: 'Find places with AI-powered recommendations',
      color: '#6c5ce7',
      delay: 400,
    },
    {
      icon: Zap,
      title: 'Quick Actions',
      description: 'Automate tasks based on your discoveries',
      color: '#ffa502',
      delay: 600,
    },
  ];

  const recentSearches = [
    { query: 'Coffee shops nearby', time: '2 hours ago' },
    { query: 'Blue sports car model', time: '1 day ago' },
    { query: 'Plant identification', time: '3 days ago' },
  ];

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animatable.View
            animation="fadeInDown"
            duration={1000}
            style={styles.header}
          >
            <Text style={styles.greeting}>Good morning! 👋</Text>
            <Text style={styles.question}>What's on your mind?</Text>
          </Animatable.View>

          {/* Search Bar */}
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={300}
            style={styles.searchContainer}
          >
            <GlassmorphicCard style={styles.searchCard}>
              <View style={styles.searchContent}>
                <NeonInput
                  placeholder="Ask anything or describe what you see..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
                <View style={styles.searchActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Voice', 'Voice search activated')}
                  >
                    <Mic color="#00ff88" size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Camera', 'Camera search activated')}
                  >
                    <Camera color="#0099cc" size={24} />
                  </TouchableOpacity>
                </View>
              </View>
            </GlassmorphicCard>
          </Animatable.View>

          {/* Feature Cards */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Discover with AI</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </View>
          </View>

          {/* Recent Searches */}
          <View style={styles.recentContainer}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.map((search, index) => (
              <RecentSearch 
                key={index} 
                {...search} 
                delay={index * 100} 
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GlobalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  question: {
    fontSize: 18,
    color: '#00ff88',
    opacity: 0.8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  searchCard: {
    padding: 20,
  },
  searchContent: {
    width: '100%',
  },
  searchInput: {
    marginBottom: 15,
  },
  searchActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    marginBottom: 15,
  },
  featureCardContent: {
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
  },
  featureIcon: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 16,
  },
  recentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  recentSearchItem: {
    marginBottom: 10,
  },
  recentSearchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
  },
  recentSearchIcon: {
    marginRight: 15,
  },
  recentSearchText: {
    flex: 1,
  },
  recentSearchQuery: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  recentSearchTime: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
});