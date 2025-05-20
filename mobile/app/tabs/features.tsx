import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Zap, Server, Activity, Shield, Cpu, RefreshCw, Wrench, Award } from 'lucide-react-native';
import { cardShadow } from '../../constants/Shadows';

export default function FeaturesScreen(): React.ReactElement {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DazBox Features</Text>
        <Text style={styles.headerSubtitle}>
          A Lightning node optimized for both performance and ease-of-use
        </Text>
      </View>

      <View style={styles.featureSection}>
        <View style={styles.featureCard}>
          <Server size={32} color="#F7931A" style={styles.featureIcon} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Powerful Hardware</Text>
            <Text style={styles.featureDescription}>
              4GB RAM, 128GB SSD, and quad-core processor to handle your routing needs
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Shield size={32} color="#F7931A" style={styles.featureIcon} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Enterprise Security</Text>
            <Text style={styles.featureDescription}>
              Hardware security module, encrypted storage, and automatic backups
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <RefreshCw size={32} color="#F7931A" style={styles.featureIcon} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Auto-Updates</Text>
            <Text style={styles.featureDescription}>
              Stay current with automatic software updates and security patches
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <Activity size={32} color="#F7931A" style={styles.featureIcon} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Performance Analytics</Text>
            <Text style={styles.featureDescription}>
              Monitor your node's performance and earnings in real-time
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.daziaSection}>
        <Text style={styles.sectionTitle}>Dazia AI Integration</Text>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.daziaImage}
          resizeMode="cover"
        />
        <Text style={styles.daziaDescription}>
          Dazia is our proprietary AI system that continuously optimizes your Lightning node configuration:
        </Text>
        
        <View style={styles.daziaFeatures}>
          <View style={styles.daziaFeatureItem}>
            <Cpu size={24} color="#F7931A" />
            <Text style={styles.daziaFeatureText}>Automatic channel optimization</Text>
          </View>

          <View style={styles.daziaFeatureItem}>
            <Wrench size={24} color="#F7931A" />
            <Text style={styles.daziaFeatureText}>Fee structure recommendations</Text>
          </View>

          <View style={styles.daziaFeatureItem}>
            <Award size={24} color="#F7931A" />
            <Text style={styles.daziaFeatureText}>Revenue maximization strategies</Text>
          </View>

          <View style={styles.daziaFeatureItem}>
            <Zap size={24} color="#F7931A" />
            <Text style={styles.daziaFeatureText}>Liquidity management</Text>
          </View>
        </View>
      </View>

      <View style={styles.comparisonSection}>
        <Text style={styles.sectionTitle}>Why Choose DazBox?</Text>
        <View style={styles.comparisonTable}>
          <View style={styles.comparisonHeader}>
            <Text style={styles.comparisonHeaderCell}>Feature</Text>
            <Text style={styles.comparisonHeaderCell}>DazBox</Text>
            <Text style={styles.comparisonHeaderCell}>DIY Node</Text>
          </View>
          
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonCell}>Setup Time</Text>
            <Text style={styles.comparisonCellHighlight}>5 minutes</Text>
            <Text style={styles.comparisonCell}>8+ hours</Text>
          </View>
          
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonCell}>Technical Knowledge</Text>
            <Text style={styles.comparisonCellHighlight}>None</Text>
            <Text style={styles.comparisonCell}>Advanced</Text>
          </View>
          
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonCell}>AI Optimization</Text>
            <Text style={styles.comparisonCellHighlight}>Included</Text>
            <Text style={styles.comparisonCell}>Not Available</Text>
          </View>
          
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonCell}>24/7 Support</Text>
            <Text style={styles.comparisonCellHighlight}>Included</Text>
            <Text style={styles.comparisonCell}>None</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>Buy DazBox Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#0F3B82',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 22,
  },
  featureSection: {
    padding: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...cardShadow,
  },
  featureIcon: {
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
  },
  daziaSection: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 16,
  },
  daziaImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  daziaDescription: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 20,
  },
  daziaFeatures: {
    marginTop: 10,
  },
  daziaFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  daziaFeatureText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#333333',
  },
  comparisonSection: {
    padding: 20,
  },
  comparisonTable: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  comparisonHeader: {
    flexDirection: 'row',
    backgroundColor: '#F7931A',
  },
  comparisonHeaderCell: {
    flex: 1,
    padding: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  comparisonCell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    color: '#444444',
  },
  comparisonCellHighlight: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    fontWeight: '600',
    color: '#F7931A',
  },
  ctaButton: {
    backgroundColor: '#F7931A',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});