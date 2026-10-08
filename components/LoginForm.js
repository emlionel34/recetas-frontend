import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import AppTitle from './AppTitle';
import { temas } from '../theme';

// Pantalla de acceso: sirve para iniciar sesión y para registrarse.
// No habla con el servidor: recibe las funciones y los datos desde App.js por props.
export default function LoginForm({
  modoRegistro,
  setModoRegistro,
  nombreRegistro,
  setNombreRegistro,
  correo,
  setCorreo,
  contraseña,
  setContraseña,
  cargando,
  onEnviar,
  tema = temas.oscuro,
}) {
  return (
    <View style={styles.contenedor}>
      <AppTitle tema={tema} />

      <Text style={[styles.subtitulo, { color: tema.textoSuave }]}>
        {modoRegistro ? 'Creá tu cuenta' : 'Iniciá sesión para continuar'}
      </Text>

      {modoRegistro && (
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#999"
          value={nombreRegistro}
          onChangeText={setNombreRegistro}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={contraseña}
        onChangeText={setContraseña}
      />

      <TouchableOpacity
        style={styles.boton}
        onPress={onEnviar}
        disabled={cargando}
      >
        <Text style={styles.botonTexto}>
          {cargando
            ? 'Procesando...'
            : modoRegistro ? 'Registrarme' : 'Iniciar sesión'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setModoRegistro(!modoRegistro)}>
        <Text style={styles.enlace}>
          {modoRegistro
            ? '¿Ya tenés cuenta? Iniciá sesión'
            : '¿No tenés cuenta? Registrate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    alignItems: 'center',
  },

  subtitulo: {
    fontSize: 16,
    marginBottom: 35,
  },

  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9cdbb',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#222222',
  },

  boton: {
    width: '100%',
    height: 50,
    backgroundColor: '#e67e22',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  botonTexto: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  enlace: {
    color: '#e67e22',
    marginTop: 25,
    fontSize: 15,
  },
});
