import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image, Pressable, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import Footer from '../../components/Footer';
import { useEffect, useState } from 'react';

export default function TabLayout() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.inactive,
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.white,
            headerTitle: () => (
              <Pressable onPress={() => router.push('/')}>
                <Image
                  source={require('../../assets/images/logo-daznode-white.png')}
                  style={{ width: 120, height: 24 }}
                  resizeMode="contain"
                />
              </Pressable>
            ),
            headerRight: () => (
              <Link href="/login" asChild>
                <Pressable style={{ marginRight: 15 }}>
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