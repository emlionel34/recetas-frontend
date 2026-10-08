import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { temas } from '../theme';

// Formulario para crear una receta nueva.
export default function RecipeForm({
  nombreReceta,
  descripcionReceta,
  setNombreReceta,
  setDescripcionReceta,
  ingredientesReceta,
  setIngredientesReceta,
  imagenReceta,
  setImagenReceta,
  crearReceta,
  cerrarFormulario,
  tema = temas.oscuro,
}) {
  return (
    <View style={styles.formulario}>
      <Text style={[styles.formularioTitulo, { color: tema.texto }]}>
        Nueva receta
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la receta"
        placeholderTextColor="#999"
        value={nombreReceta}
        onChangeText={setNombreReceta}
      />

      <TextInput
        style={[styles.input, styles.inputGrande]}
        placeholder="Ingredientes (uno por línea)"
        placeholderTextColor="#999"
        value={ingredientesReceta}
        onChangeText={setIngredientesReceta}
        multiline
      />

      <TextInput
        style={[styles.input, styles.inputGrande]}
        placeholder="Preparación (paso a paso)"
        placeholderTextColor="#999"
        value={descripcionReceta}
        onChangeText={setDescripcionReceta}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Enlace de la imagen (opcional)"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={imagenReceta}
        onChangeText={setImagenReceta}
      />

      <TouchableOpacity style={styles.button} onPress={crearReceta}>
        <Text style={styles.buttonText}>Guardar receta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={cerrarFormulario}>
        <Text style={styles.registerText}>Cancelar</Text>
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
    marginBottom: 15,
  },

  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9cdbb',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#222222',
    fontSize: 16,
    marginBottom: 12,
  },

  inputGrande: {
    minHeight: 90,
    textAlignVertical: 'top',
  },

  button: {
    width: '100%',
    backgroundColor: '#e67e22',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  registerText: {
    color: '#e67e22',
    textAlign: 'center',
    marginTop: 5,
  },
});
