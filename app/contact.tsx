import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '../constants/Colors';
import ContactForm from '../components/shared/ui/ContactForm';

export default function ContactScreen() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Contact',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
        }}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Contactez-nous</Text>
        <Text style={styles.subtitle}>
          Une question ? Un projet ? N'hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais.
        </Text>

        <ContactForm />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.secondary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 30,
    lineHeight: 24,
  },
}); 