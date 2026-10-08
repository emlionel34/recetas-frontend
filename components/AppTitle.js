import { Image, StyleSheet, Text, View } from 'react-native';

import { temas } from '../theme';

// Título de la app: logo + nombre. Se usa en el login y en la pantalla principal.
export default function AppTitle({ tema = temas.oscuro }) {
  return (
    <View style={styles.fila}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[styles.titulo, { color: tema.texto }]}>
        Recetas
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  logo: {
    width: 56,
    height: 56,
    marginRight: 12,
  },

  titulo: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});
