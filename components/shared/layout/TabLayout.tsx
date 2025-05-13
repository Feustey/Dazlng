import { Tabs, useRootNavigation } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image, Pressable, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Colors from '../../../constants/Colors';
import Footer from '../ui/Footer';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

interface TabIconProps {
  color: string;
  name: string;
  size: number;
}

interface TabButtonProps {
  onPress: () => void;
}

interface HeaderLogoProps {
  onPress: () => void;
}

const TabIcon: React.FC<TabIconProps> = ({ color, name, size }) => (
  <FontAwesome5 name={name} size={size} color={color} />
);

const TabButton: React.FC<TabButtonProps> = ({ onPress }) => (
  <View onTouchEnd={onPress}>
    <Image
      source={require('@/assets/images/logo.png')}
      alt="Logo"
      style={styles.logo}
    />
  </View>
);

const HeaderLogo: React.FC<HeaderLogoProps> = ({ onPress }) => (
  <Pressable onPress={onPress}>
    <Image
      source={require('../../../assets/images/logo-daznode-white.png')}
      style={styles.logo}
      resizeMode="contain"
      accessibilityLabel="Logo Daznode"
    />
  </Pressable>
);

TabIcon.propTypes = {
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

TabButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

HeaderLogo.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const UserButton: React.FC = () => (
  <Link href="/login" asChild>
    <Pressable style={styles.userButton}>
      <TabIcon name="user-circle" color={Colors.white} size={24} />
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

  const handleLogoPress = () => {
    rootNavigation?.navigate('Main', { screen: 'Accueil' });
  };

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
              <HeaderLogo onPress={handleLogoPress} />
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
                  <TabIcon name={tab.icon} color={color} size={24} />
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