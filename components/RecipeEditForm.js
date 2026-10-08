import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { temas } from '../theme';

// Formulario para editar una receta existente.
// Recibe la receta y las funciones desde App.js por props.
export default function RecipeEditForm({
  receta,
  setReceta,
  guardarCambios,
  cancelar,
  tema = temas.oscuro,
}) {
  return (
    <View style={styles.formulario}>
      <Text style={[styles.formularioTitulo, { color: tema.texto }]}>Editar receta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la receta"
        placeholderTextColor="#999"
        value={receta.nombre}
        onChangeText={(texto) => setReceta({ ...receta, nombre: texto })}
      />

      <TextInput
        style={[styles.input, styles.inputGrande]}
        placeholder="Ingredientes (uno por línea)"
        placeholderTextColor="#999"
        value={receta.ingredientes || ''}
        onChangeText={(texto) => setReceta({ ...receta, ingredientes: texto })}
        multiline
      />

      <TextInput
        style={[styles.input, styles.inputGrande]}
        placeholder="Preparación (paso a paso)"
        placeholderTextColor="#999"
        value={receta.descripcion}
        onChangeText={(texto) => setReceta({ ...receta, descripcion: texto })}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Enlace de la imagen (opcional)"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={receta.imagen || ''}
        onChangeText={(texto) => setReceta({ ...receta, imagen: texto })}
      />

      <Text style={[styles.ayuda, { color: tema.textoSuave }]}>
        Pegá el enlace directo de la foto: tiene que empezar con https.
      </Text>

      <TouchableOpacity style={styles.button} onPress={guardarCambios}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={cancelar}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formulario: {
    width: '100%',
    marginBottom: 20,
  },

  formularioTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },

  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#222222',
    borderWidth: 1,
    borderColor: '#d9cdbb',
  },

  ayuda: {
    fontSize: 12,
    marginTop: -6,
    marginBottom: 14,
  },

  inputGrande: {
    minHeight: 90,
    textAlignVertical: 'top',
  },

  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#e67e22',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  cancelText: {
    color: '#e67e22',
    marginTop: 25,
    fontSize: 15,
    textAlign: 'center',
  },
});
