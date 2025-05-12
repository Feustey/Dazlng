import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Platform } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
          animation: Platform.OS === 'ios' ? 'default' : 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="subscribe" options={{ headerShown: false }} />
        <Stack.Screen name="contact" options={{ headerShown: true, title: 'Contact' }} />
        <Stack.Screen name="login" options={{ headerShown: true, title: 'Connexion' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Page non trouvée' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
