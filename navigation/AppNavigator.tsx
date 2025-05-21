import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Box, CreditCard, Network, Sparkles, User } from 'lucide-react-native';

// Importe tes écrans principaux (tabs)
import HomeScreen from 'mobile/app/tabs/index';
import DazboxScreen from 'mobile/app/tabs/dazbox';
import DazpayScreen from 'mobile/app/tabs/dazpay';
import DaznodeScreen from 'mobile/app/tabs/daznode';
import FeaturesScreen from 'mobile/app/tabs/features';
// import AccountScreen from 'mobile/app/tabs/account';

// Importe les écrans secondaires (stack)
import ContactScreen from 'app/contact/page';
// import BuyScreen from 'mobile/app/tabs/buy';
// import CheckoutScreen from 'mobile/app/tabs/checkout';
import HowItWorksScreen from 'mobile/app/tabs/how-it-works';

import TabBarIcon from '../components/shared/ui/TabBarIcon';
import NotificationBadge from '../components/shared/ui/NotificationBadge';
import { RootStackParamList, TabParamList } from '../types/navigation';
import Colors from '../constants/Colors';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator(): React.ReactElement {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.gray[200],
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="Accueil" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <TabBarIcon Icon={Home} color={color} size={size} focused={focused} />
              <NotificationBadge show={false} />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Dazbox" 
        component={DazboxScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <TabBarIcon Icon={Box} color={color} size={size} focused={focused} />
              <NotificationBadge show={false} />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Dazpay" 
        component={DazpayScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <TabBarIcon Icon={CreditCard} color={color} size={size} focused={focused} />
              <NotificationBadge show={true} count={2} />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Daznode" 
        component={DaznodeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <TabBarIcon Icon={Network} color={color} size={size} focused={focused} />
              <NotificationBadge show={true} count={1} />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Fonctionnalités" 
        component={FeaturesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <TabBarIcon Icon={Sparkles} color={color} size={size} focused={focused} />
              <NotificationBadge show={false} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator(): React.ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // header: ({ route, options }) => (
          //   <CustomHeader 
          //     title={options.title || route.name} 
          //     showBack={route.name !== 'Main'} 
          //   />
          // ),
          cardStyle: { backgroundColor: Colors.background },
          headerShown: true,
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Contact" 
          component={ContactScreen}
          options={{
            title: 'Nous contacter',
          }}
        />
        <Stack.Screen 
          name="HowItWorks" 
          component={HowItWorksScreen}
          options={{
            title: 'Comment ça marche',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
