import { Tabs, useRootNavigation } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image, Pressable, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Colors from '../../../constants/Colors';
import Footer from '../ui/Footer';
import { useEffect, useState } from 'react';

interface TabIconProps {
  color: string;
  name: keyof typeof FontAwesome5['glyphMap'];
  size?: number;
}

const TabIcon: React.FC<TabIconProps> = ({ color, name, size = 24 }) => (
  <FontAwesome5 name={name} size={size} color={color} />
);

const HeaderLogo: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <Pressable onPress={onPress}>
    <Image
      source={require('../../../assets/images/logo-daznode-white.png')}
      style={styles.logo}
      resizeMode="contain"
      accessibilityLabel="Logo Daznode"
    />
  </Pressable>
);

const UserButton: React.FC = () => (
  <Link href="/login" asChild>
    <Pressable style={styles.userButton}>
      <TabIcon name="user-circle" color={Colors.white} />
    </Pressable>
  </Link>
);

export default function TabLayout() {
  const rootNavigation = useRootNavigation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  const tabs = [
    { name: 'index', title: 'Accueil', icon: 'home' },
    { name: 'dazbox', title: 'Dazbox', icon: 'box' },
    { name: 'daznode', title: 'Daznode', icon: 'network-wired' },
    { name: 'dazpay', title: 'DazPay', icon: 'cash-register' },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.inactive,
            headerStyle: styles.header,
            headerTintColor: Colors.white,
            headerTitle: () => (
              <HeaderLogo onPress={() => rootNavigation.navigate('index')} />
            ),
            headerRight: () => <UserButton />,
          }}
        >
          {tabs.map((tab) => (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                title: tab.title,
                tabBarIcon: ({ color }) => (
                  <TabIcon name={tab.icon} color={color} />
                ),
              }}
            />
          ))}
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
  header: {
    backgroundColor: Colors.primary,
  },
  logo: {
    width: 120,
    height: 24,
  },
  userButton: {
    marginRight: 15,
  },
}); 