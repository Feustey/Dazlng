import React from 'react';
import { Tabs, useRootNavigation } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image, Pressable, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Colors from '../../../constants/Colors';
import Footer from '../../../components/Footer';
import { useEffect, useState } from 'react';

export default function TabLayout(): React.ReactElement {
  const _rootNavigation = useRootNavigation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.inactive,
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.white,
            headerTitle: () => (
              <Link href="/" asChild>
                <Pressable>
                  <Image
                    source={require('@/assets/images/logo.png')}
                    alt="Logo"
                    style={styles.logo}
                  />
                </Pressable>
              </Link>
            ),
            headerRight: () => (
              <Link href="/login" asChild>
                <Pressable style={styles.userIcon}>
                  <FontAwesome5 name="user-circle" size={24} color={Colors.white} />
                </Pressable>
              </Link>
            ),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Accueil',
              tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="dazbox"
            options={{
              title: 'Dazbox',
              tabBarIcon: ({ color }) => <FontAwesome5 name="box" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="daznode"
            options={{
              title: 'Daznode',
              tabBarIcon: ({ color }) => <FontAwesome5 name="network-wired" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="dazpay"
            options={{
              title: 'DazPay',
              tabBarIcon: ({ color }) => <FontAwesome5 name="cash-register" size={24} color={color} />,
            }}
          />
        </Tabs>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 24,
  },
  userIcon: {
    marginRight: 15,
  },
});