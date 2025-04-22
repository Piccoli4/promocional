import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Posiciones from './src/screens/Posiciones';
import escudoUyP from './assets/UyP.png';
import Resultados from './src/screens/Resultados';
import Header from './src/components/Header';

export default function App() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000055', '#A90000']}
        locations={[0.25, 1]}
        style={styles.background}
      >
        <Header />
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 }]}>
          <Posiciones />
          <Resultados />
        </ScrollView>
        <View style={styles.footer}>
          <Text style={styles.appCreada}>
            App creada por el equipo de básquet de{"\n"}UNIÓN Y PROGRESO
          </Text>
          <Image source={escudoUyP} style={styles.escudo} />
        </View>
      </LinearGradient>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginBottom: 10,
  },
  appCreada: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textAlign: 'center'
  },
  escudo: {
    width: 50,
    height: 50
  }
});
