import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome5 } from '@expo/vector-icons';
import { View, Image, Pressable } from 'react-native';
import Colors from './constants/Colors';
import Footer from './components/Footer';

// Import des types
import { RootStackParamList, TabParamList } from './types/navigation';

// Import des écrans
import HomeScreen from './screens/HomeScreen';
import DazboxScreen from './screens/DazboxScreen';
import DaznodeScreen from './screens/DaznodeScreen';
import DazpayScreen from './screens/DazpayScreen';
import LoginScreen from './screens/LoginScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function TabNavigator() {
  const navigation = useNavigation();

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
              <Pressable onPress={() => navigation.navigate('Home' as never)}>
                <Image
                  source={require('./assets/images/logo-daznode-white.png')}
                  style={{ width: 120, height: 24 }}
                  resizeMode="contain"
                />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable 
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate('Login' as never)}
              >
                <FontAwesome5 name="user-circle" size={24} color={Colors.white} />
              </Pressable>
            ),
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Accueil',
              tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="Dazbox"
            component={DazboxScreen}
            options={{
              title: 'Dazbox',
              tabBarIcon: ({ color }) => <FontAwesome5 name="box" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="Daznode"
            component={DaznodeScreen}
            options={{
              title: 'Daznode',
              tabBarIcon: ({ color }) => <FontAwesome5 name="network-wired" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="DazPay"
            component={DazpayScreen}
            options={{
              title: 'DazPay',
              tabBarIcon: ({ color }) => <FontAwesome5 name="cash-register" size={24} color={color} />,
            }}
          />
        </Tab.Navigator>
      </View>
      <Footer />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 