"use client";
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Image } from 'react-native';
import { User, Bell, ChevronRight, Shield, LogOut, Settings, CircleHelp as HelpCircle } from 'lucide-react-native';

type MenuItem = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: () => void;
  hasToggle?: boolean;
  defaultToggle?: boolean;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

export default function AccountScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // For toggle switches
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  
  const handleLogin = () => {
    if (name && email) {
      setIsLoggedIn(true);
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setName('');
    setEmail('');
  };

  const accountMenu: MenuSection[] = [
    {
      title: 'Account Settings',
      items: [
        {
          icon: <User size={22} color="#F7931A" />,
          title: 'My Profile',
          description: 'Manage your personal information',
        },
        {
          icon: <Bell size={22} color="#F7931A" />,
          title: 'Notifications',
          description: 'Configure notification preferences',
          hasToggle: true,
          defaultToggle: notifications,
        },
        {
          icon: <Shield size={22} color="#F7931A" />,
          title: 'Two-Factor Authentication',
          description: 'Additional security for your account',
          hasToggle: true,
          defaultToggle: twoFactor,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle size={22} color="#F7931A" />,
          title: 'Help Center',
          description: 'Frequently asked questions and guides',
        },
        {
          icon: <Settings size={22} color="#F7931A" />,
          title: 'Node Settings',
          description: 'Advanced configuration options',
        },
      ],
    },
    {
      title: 'Application',
      items: [
        {
          icon: <LogOut size={22} color="#F7931A" />,
          title: 'Logout',
          action: handleLogout,
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Account</Text>
        <Text style={styles.headerSubtitle}>
          Manage your profile and DazBox settings
        </Text>
      </View>

      {isLoggedIn ? (
        <>
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <User size={40} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>

          <View style={styles.nodeStatus}>
            <Text style={styles.nodeStatusTitle}>My DazBox Status</Text>
            
            <View style={styles.statusCard}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Status</Text>
                <View style={styles.activeStatus}>
                  <View style={styles.activeIndicator} />
                  <Text style={styles.activeText}>Active</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Channels</Text>
                <Text style={styles.statusValue}>12</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Earnings (30d)</Text>
                <Text style={styles.earnings}>0.00042 BTC</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.nodeDetailsButton}>
              <Text style={styles.nodeDetailsText}>View Details</Text>
              <ChevronRight size={16} color="#F7931A" />
            </TouchableOpacity>
          </View>

          {accountMenu.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>{section.title}</Text>
              
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={itemIndex} 
                  style={styles.menuItem}
                  onPress={item.action}
                >
                  <View style={styles.menuItemContent}>
                    <View style={styles.menuItemIcon}>
                      {item.icon}
                    </View>
                    <View style={styles.menuItemTexts}>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                      {item.description && (
                        <Text style={styles.menuItemDescription}>{item.description}</Text>
                      )}
                    </View>
                  </View>
                  
                  {item.hasToggle ? (
                    <Switch
                      value={item.title === 'Notifications' ? notifications : twoFactor}
                      onValueChange={(val) => {
                        if (item.title === 'Notifications') {
                          setNotifications(val);
                        } else if (item.title === 'Two-Factor Authentication') {
                          setTwoFactor(val);
                        }
                      }}
                      trackColor={{ false: '#E5E5E5', true: '#F7931A' }}
                      thumbColor="#FFFFFF"
                    />
                  ) : item.action ? null : (
                    <ChevronRight size={18} color="#999999" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </>
      ) : (
        <View style={styles.loginContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/6781008/pexels-photo-6781008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
            style={styles.loginImage}
            resizeMode="cover"
            alt="Login background"
          />
          
          <View style={styles.formContainer}>
            <Text style={styles.loginTitle}>Sign In</Text>
            <Text style={styles.loginSubtitle}>
              Create or access your DazBox account
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#999999"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#999999"
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.loginButton, !(name && email) && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={!(name && email)}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
            
            <Text style={styles.termsText}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      )}
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F7931A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666666',
  },
  nodeStatus: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  nodeStatusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 15,
  },
  statusCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666666',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  activeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  activeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  earnings: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F7931A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 8,
  },
  nodeDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  nodeDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F7931A',
    marginRight: 5,
  },
  menuSection: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    marginRight: 15,
  },
  menuItemTexts: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111111',
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  loginContainer: {
    flex: 1,
  },
  loginImage: {
    width: '100%',
    height: 180,
  },
  formContainer: {
    padding: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111111',
  },
  loginButton: {
    backgroundColor: '#F7931A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#F7931A80',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
});