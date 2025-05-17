import Link from 'next/link';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      {/* <Stack.Screen options={{ title: 'Oops!' }} /> */}
      <View style={styles.container}>
        <Text style={styles.title}>Cette page n'existe pas.</Text>
        <Link href="/" legacyBehavior>
          <a style={styles.link}>
            <span style={styles.linkText}>Retour à l'accueil !</span>
          </a>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
