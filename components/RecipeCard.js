import { useState, useEffect } from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { temas } from '../theme';
import { descargarPdf } from '../utils/recetaPdf';

// Colores de fondo para las recetas que no tienen foto (según su id).
const COLORES = ['#F8D9B0', '#F5C6A5', '#D9E8C4', '#F2D7D5', '#E8DAB2'];

// Un texto se considera largo si tiene muchos caracteres o muchas líneas.
const esLargo = (texto) =>
  Boolean(texto) && (texto.length > 140 || texto.split('\n').length > 3);

// Cantidad de líneas que se ven cuando la tarjeta está recortada.
const LINEAS_RECORTADAS = 3;

// Tarjeta visual de una receta.
// Recibe por props los datos, si es favorita, si se puede modificar y el tema de colores.
export default function RecipeCard({
  receta,
  editarReceta,
  eliminarReceta,
  puedeModificar,
  esFavorito,
  toggleFavorito,
  esAdmin,
  aprobarReceta,
  tema = temas.oscuro
}) {
  // Si la imagen no carga, se muestra el emoji de respaldo
  const [falloImagen, setFalloImagen] = useState(false);
  const mostrarFoto = receta.imagen && !falloImagen;

  // Si cambia el enlace de la imagen (por ejemplo al editar), se vuelve a intentar cargarla
  useEffect(() => {
    setFalloImagen(false);
  }, [receta.imagen]);

  // La tarjeta muestra pocas líneas y se puede expandir con "Ver más"
  const [expandida, setExpandida] = useState(false);
  const hayMas = esLargo(receta.ingredientes) || esLargo(receta.descripcion);
  const lineas = expandida ? undefined : LINEAS_RECORTADAS;

  return (
    <View style={[styles.card, { backgroundColor: tema.tarjeta }]}>

      <View>
        {mostrarFoto ? (
          <Image
            source={{ uri: receta.imagen }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setFalloImagen(true)}
          />
        ) : (
          <View
            style={[
              styles.image,
              { backgroundColor: COLORES[receta.id_receta % COLORES.length] }
            ]}
          >
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoRespaldo}
              resizeMode="contain"
            />

            {receta.imagen && falloImagen ? (
              <Text style={styles.avisoImagen}>
                No se pudo cargar la imagen
              </Text>
            ) : null}
          </View>
        )}

        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavorito(receta)}
        >
          <Text style={styles.heart}>
            {esFavorito ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>

        {receta.aprobada === false && (
          <Text style={styles.badge}>Pendiente de aprobación</Text>
        )}

        <Text style={[styles.title, { color: tema.tarjetaTexto }]}>
          {receta.nombre}
        </Text>

        {receta.ingredientes ? (
          <View>
            <Text style={[styles.label, { color: tema.tarjetaTexto }]}>
              Ingredientes
            </Text>
            <Text
              style={[styles.description, { color: tema.tarjetaDescripcion }]}
              numberOfLines={lineas}
            >
              {receta.ingredientes}
            </Text>
          </View>
        ) : null}

        <Text style={[styles.label, { color: tema.tarjetaTexto }]}>
          Preparación
        </Text>
        <Text
          style={[styles.description, { color: tema.tarjetaDescripcion }]}
          numberOfLines={lineas}
        >
          {receta.descripcion}
        </Text>

        {hayMas && (
          <TouchableOpacity onPress={() => setExpandida(!expandida)}>
            <Text style={styles.verMas}>
              {expandida ? 'Ver menos' : 'Ver más'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.pdfButton}
          onPress={() => descargarPdf(receta)}
        >
          <Text style={styles.buttonText}>
            Descargar PDF
          </Text>
        </TouchableOpacity>

        {esAdmin && receta.aprobada === false && (
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => aprobarReceta(receta)}
          >
            <Text style={styles.buttonText}>
              Aprobar receta
            </Text>
          </TouchableOpacity>
        )}

        {puedeModificar && (
          <View style={styles.buttons}>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => editarReceta(receta)}
            >
              <Text style={styles.buttonText}>
                Editar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => eliminarReceta(receta)}
            >
              <Text style={styles.buttonText}>
                Eliminar
              </Text>
            </TouchableOpacity>

          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    width: '100%',
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 4,
  },

  // La altura se calcula según el ancho (proporción 16:10), así se adapta a cualquier pantalla
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoRespaldo: {
    width: 90,
    height: 90,
    opacity: 0.9,
  },

  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heart: {
    fontSize: 24,
    color: '#e74c3c',
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 7,
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 2,
  },

  verMas: {
    color: '#e67e22',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
  },

  avisoImagen: {
    position: 'absolute',
    bottom: 6,
    color: '#7a5a3a',
    fontSize: 12,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5B041',
    color: '#4A3000',
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },

  approveButton: {
    backgroundColor: '#27AE60',
    padding: 11,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  pdfButton: {
    backgroundColor: '#2E86C1',
    padding: 11,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },

  description: {
    fontSize: 15,
    lineHeight: 21,
  },

  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  editButton: {
    flex: 1,
    backgroundColor: '#E67E22',
    padding: 11,
    borderRadius: 10,
    alignItems: 'center',
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#C0392B',
    padding: 11,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

});
