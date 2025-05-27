import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import { View, Image, Pressable } from 'react-native';
import Colors from './constants/Colors';
import Footer from './components/Footer';

// Import des types
import { RootStackParamList, TabParamList } from './types/navigation';

// Import des écrans
import HomeScreen from './mobile/app/tabs/index';
import DazboxScreen from './mobile/app/tabs/dazbox';
import DaznodeScreen from './mobile/app/tabs/daznode';
import DazPayScreen from './mobile/app/tabs/dazpay';
// import LoginScreen from './app/auth/login/page';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: Record<string, unknown>) => void;
};

function TabNavigator(): React.ReactElement {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.inactive,
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.white,
            headerTitle: () => (
              <Pressable onPress={() => navigation.navigate('Main', { screen: 'Accueil' })}>
                <Image
                  source={require('./assets/images/logo-daznode-white.svg')}
                  style={{ width: 120, height: 24 }}
                  resizeMode="contain"
                  alt="Logo Daznode"
                />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable 
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate('Login')}
              >
                <FontAwesome name="user-circle" size={24} color={Colors.white} />
              </Pressable>
            ),
          }}
        >
          <Tab.Screen
            name="Accueil"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="Dazbox"
            component={DazboxScreen}
            options={{
              tabBarIcon: ({ color }) => <FontAwesome name="cube" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="Daznode"
            component={DaznodeScreen}
            options={{
              tabBarIcon: ({ color }) => <FontAwesome name="sitemap" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="Dazpay"
            component={DazPayScreen}
            options={{
              tabBarIcon: ({ color }) => <FontAwesome name="credit-card" size={24} color={color} />,
            }}
          />
        </Tab.Navigator>
      </View>
      <Footer />
    </View>
  );
}

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App; 