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
import { MapPin, Star, Clock, Filter, Navigation } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';

const LocationCard = ({ location, delay = 0 }) => (
  <Animatable.View
    animation="fadeInUp"
    duration={600}
    delay={delay}
    style={styles.locationCard}
  >
    <TouchableOpacity
      onPress={() => Alert.alert('Location', `Navigate to ${location.name}`)}
      activeOpacity={0.7}
    >
      <GlassmorphicCard style={styles.locationCardContent}>
        <View style={styles.locationHeader}>
          <View style={styles.locationIcon}>
            <MapPin color="#00ff88" size={20} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{location.name}</Text>
            <Text style={styles.locationCategory}>{location.category}</Text>
          </View>
          <View style={styles.locationRating}>
            <Star color="#ffa502" size={14} />
            <Text style={styles.ratingText}>{location.rating}</Text>
          </View>
        </View>
        
        <View style={styles.locationDetails}>
          <View style={styles.detailRow}>
            <Navigation color="#0099cc" size={14} />
            <Text style={styles.detailText}>{location.distance}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock color="#6c5ce7" size={14} />
            <Text style={styles.detailText}>{location.hours}</Text>
          </View>
        </View>

        <Text style={styles.locationDescription}>
          {location.description}
        </Text>
      </GlassmorphicCard>
    </TouchableOpacity>
  </Animatable.View>
);

const FilterChip = ({ title, active, onPress, color = '#00ff88' }) => (
  <TouchableOpacity
    style={[
      styles.filterChip,
      active && { ...styles.activeFilterChip, borderColor: color }
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.filterText,
      active && { ...styles.activeFilterText, color }
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default function LocationScreen() {
  const [activeFilters, setActiveFilters] = useState(['All']);

  const filters = [
    { title: 'All', color: '#00ff88' },
    { title: 'Restaurants', color: '#ffa502' },
    { title: 'Shopping', color: '#0099cc' },
    { title: 'Coffee', color: '#6c5ce7' },
    { title: 'Gas', color: '#ff4757' },
  ];

  const locations = [
    {
      id: 1,
      name: 'Blue Bottle Coffee',
      category: 'Coffee Shop',
      rating: '4.8',
      distance: '0.2 miles',
      hours: 'Open until 8 PM',
      description: 'Artisanal coffee with a minimalist aesthetic. Perfect for work or casual meetings.',
    },
    {
      id: 2,
      name: 'Whole Foods Market',
      category: 'Grocery Store',
      rating: '4.5',
      distance: '0.5 miles',
      hours: 'Open 24 hours',
      description: 'Organic groceries, fresh produce, and prepared foods. Your one-stop healthy shopping destination.',
    },
    {
      id: 3,
      name: 'The Plant Shop',
      category: 'Garden Center',
      rating: '4.9',
      distance: '0.8 miles',
      hours: 'Open until 6 PM',
      description: 'Rare plants, gardening supplies, and expert plant care advice from passionate botanists.',
    },
    {
      id: 4,
      name: 'Tech Hub Electronics',
      category: 'Electronics Store',
      rating: '4.3',
      distance: '1.1 miles',
      hours: 'Open until 9 PM',
      description: 'Latest gadgets, computer accessories, and tech repair services with knowledgeable staff.',
    },
    {
      id: 5,
      name: 'Green Park',
      category: 'Public Park',
      rating: '4.7',
      distance: '0.3 miles',
      hours: 'Open 24 hours',
      description: 'Peaceful urban oasis with walking trails, playground, and beautiful flower gardens.',
    },
  ];

  const toggleFilter = (filter) => {
    if (filter === 'All') {
      setActiveFilters(['All']);
    } else {
      const newFilters = activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters.filter(f => f !== 'All'), filter];
      
      setActiveFilters(newFilters.length > 0 ? newFilters : ['All']);
    }
  };

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Smart Locations</Text>
            <Text style={styles.subtitle}>AI-powered place discovery</Text>
          </View>

          {/* Map Preview */}
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            style={styles.mapContainer}
          >
            <GlassmorphicCard style={styles.mapCard}>
              <View style={styles.mapPlaceholder}>
                <View style={styles.mapGrid}>
                  {[...Array(6)].map((_, i) => (
                    <View key={i} style={styles.mapGridLine} />
                  ))}
                  {[...Array(4)].map((_, i) => (
                    <View key={i} style={[styles.mapGridLine, styles.mapGridLineVertical]} />
                  ))}
                </View>
                <View style={styles.mapPins}>
                  <View style={[styles.mapPin, { top: '20%', left: '30%' }]} />
                  <View style={[styles.mapPin, { top: '60%', left: '70%' }]} />
                  <View style={[styles.mapPin, { top: '40%', left: '50%' }]} />
                </View>
                <Text style={styles.mapText}>Interactive Map View</Text>
                <Text style={styles.mapSubtext}>Tap to explore full map</Text>
              </View>
            </GlassmorphicCard>
          </Animatable.View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filtersHeader}>
              <Filter color="#00ff88" size={20} />
              <Text style={styles.filtersTitle}>Filters</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
            >
              {filters.map((filter, index) => (
                <FilterChip
                  key={filter.title}
                  title={filter.title}
                  color={filter.color}
                  active={activeFilters.includes(filter.title)}
                  onPress={() => toggleFilter(filter.title)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Locations List */}
          <View style={styles.locationsContainer}>
            <Text style={styles.sectionTitle}>Nearby Places</Text>
            {locations.map((location, index) => (
              <LocationCard
                key={location.id}
                location={location}
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#00ff88',
    opacity: 0.8,
    marginTop: 5,
  },
  mapContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  mapCard: {
    height: 200,
    padding: 0,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapGridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
  },
  mapGridLineVertical: {
    top: 0,
    bottom: 0,
    left: 'auto',
    right: 'auto',
    width: 1,
    height: 'auto',
  },
  mapPins: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapPin: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#0099cc',
    opacity: 0.8,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  filtersScroll: {
    paddingHorizontal: 0,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
  },
  filterText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    fontWeight: 'bold',
  },
  locationsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  locationCard: {
    marginBottom: 15,
  },
  locationCardContent: {
    padding: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  locationCategory: {
    fontSize: 14,
    color: '#0099cc',
  },
  locationRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#ffa502',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  locationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#ccc',
    fontSize: 14,
    marginLeft: 6,
  },
  locationDescription: {
    color: '#bbb',
    fontSize: 14,
    lineHeight: 20,
  },
});