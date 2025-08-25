import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import GlobalBackground from '../../components/GlobalBackground';
import GlassmorphicCard from '../../components/GlassmorphicCard';
import NeonButton from '../../components/NeonButton';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, Crown, Activity, Calendar } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';

const StatCard = ({ icon: Icon, value, label, color, delay = 0 }) => (
  <Animatable.View
    animation="fadeInUp"
    duration={600}
    delay={delay}
    style={styles.statCard}
  >
    <GlassmorphicCard style={styles.statCardContent}>
      <Icon color={color} size={24} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </GlassmorphicCard>
  </Animatable.View>
);

const MenuOption = ({ icon: Icon, title, subtitle, onPress, color = '#fff', delay = 0 }) => (
  <Animatable.View
    animation="fadeInRight"
    duration={600}
    delay={delay}
  >
    <TouchableOpacity
      style={styles.menuOption}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuOptionContent}>
        <View style={[styles.menuIcon, { backgroundColor: `${color}20` }]}>
          <Icon color={color} size={20} />
        </View>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
          }
        </View>
        <Text style={styles.menuArrow}>›</Text>
      </View>
    </TouchableOpacity>
  </Animatable.View>
);

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => router.replace('/auth')
        },
      ]
    );
  };

  const stats = [
    {
      icon: Activity,
      value: '147',
      label: 'Searches',
      color: '#00ff88',
      delay: 0,
    },
    {
      icon: Calendar,
      value: '23',
      label: 'Tasks Done',
      color: '#0099cc',
      delay: 200,
    },
    {
      icon: Crown,
      value: '12',
      label: 'Discoveries',
      color: '#ffa502',
      delay: 400,
    },
  ];

  const menuOptions = [
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences and customization',
      color: '#0099cc',
      onPress: () => Alert.alert('Settings', 'Settings coming soon'),
      delay: 0,
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      color: '#6c5ce7',
      onPress: () => Alert.alert('Notifications', 'Notification settings'),
      delay: 100,
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Control your data and privacy settings',
      color: '#00ff88',
      onPress: () => Alert.alert('Privacy', 'Privacy settings'),
      delay: 200,
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help or contact our support team',
      color: '#ffa502',
      onPress: () => Alert.alert('Support', 'Help & Support'),
      delay: 300,
    },
  ];

  return (
    <GlobalBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Manage your Lookate experience</Text>
          </View>

          {/* User Profile Card */}
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            style={styles.profileContainer}
          >
            <GlassmorphicCard style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <User color="#00ff88" size={40} />
                </View>
                <View style={styles.profileBadge}>
                  <Crown color="#ffa502" size={16} />
                </View>
              </View>
              <Text style={styles.userName}>Alex Johnson</Text>
              <Text style={styles.userEmail}>alex.johnson@lookate.app</Text>
              <Text style={styles.memberSince}>Member since March 2024</Text>
            </GlassmorphicCard>
          </Animatable.View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Your Activity</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </View>
          </View>

          {/* Menu Options */}
          <View style={styles.menuContainer}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {menuOptions.map((option, index) => (
              <MenuOption key={index} {...option} />
            ))}
          </View>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <NeonButton
              title="Sign Out"
              onPress={handleLogout}
              variant="secondary"
              style={styles.logoutButton}
            />
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
  profileContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  profileCard: {
    padding: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: 3,
    borderColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 165, 2, 0.1)',
    borderWidth: 2,
    borderColor: '#ffa502',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#0099cc',
    marginBottom: 10,
  },
  memberSince: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  statCardContent: {
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuOption: {
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  menuArrow: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    borderColor: '#ff4757',
  },
});