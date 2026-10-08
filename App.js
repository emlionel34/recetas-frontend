import { StatusBar } from 'expo-status-bar';

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import { useState, useEffect, useRef } from 'react';

import RecipeCard from './components/RecipeCard';
import RecipeForm from './components/RecipeForm';
import LoginForm from './components/LoginForm';
import UserAdminPanel from './components/UserAdminPanel';
import RecipeEditForm from './components/RecipeEditForm';
import AppTitle from './components/AppTitle';
import { pedir } from './services/api';
import { temas } from './theme';

export default function App()
{
  // Referencia a la lista, para subir hasta arriba después de crear una receta
  const scrollRef = useRef(null);

  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [token, setToken] = useState(null);
  const [recetas, setRecetas] = useState([]);
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [cargando, setCargando] = useState(false);

  const [nombreReceta, setNombreReceta] = useState('');
  const [descripcionReceta, setDescripcionReceta] = useState('');
  const [ingredientesReceta, setIngredientesReceta] = useState('');
  const [imagenReceta, setImagenReceta] = useState('');
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const [recetaEditando, setRecetaEditando] = useState(null);
  const [mostrandoEdicion, setMostrandoEdicion] = useState(false);

  const [modoOscuro, setModoOscuro] = useState(true);
  const [favoritos, setFavoritos] = useState([]);
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [soloPendientes, setSoloPendientes] = useState(false);

  const [usuarios, setUsuarios] = useState([]);
  const [mostrandoUsuarios, setMostrandoUsuarios] = useState(false);

  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombreRegistro, setNombreRegistro] = useState('');

  // Aviso cuando no se pudo llegar al servidor
  const errorDeRed = (error) => {
    console.log(error);
    Alert.alert('Error', 'No se pudo conectar con el servidor');
  };

  // Cuando hay token, pide las recetas y los favoritos al servidor
  useEffect(() =>
  {
    if (!token) return;

    const cargarDatos = async () => {
      try
      {
        const recetasRespuesta = await pedir('/api/recipes', { token });

        if (recetasRespuesta.ok) {
          setRecetas(recetasRespuesta.datos);
        }

        const favoritosRespuesta = await pedir('/api/favorites', { token });

        if (favoritosRespuesta.ok) {
          setFavoritos(
            favoritosRespuesta.datos.map((receta) => receta.id_receta)
          );
        }
      }
      catch (error)
      {
        console.log('ERROR AL CARGAR DATOS:', error);
      }
    };

    cargarDatos();
  }, [token]);

  // Filtra por búsqueda y, si corresponde, solo las favoritas
  const recetasFiltradas = recetas.filter((receta) =>
    receta.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (!soloFavoritos || favoritos.includes(receta.id_receta)) &&
    (!soloPendientes || receta.aprobada === false)
  );

  // Colores según el modo elegido (ver theme.js)
  const tema = modoOscuro ? temas.oscuro : temas.claro;

  const botonTema = (
    <TouchableOpacity
      style={styles.themeButton}
      onPress={() => setModoOscuro(!modoOscuro)}
    >
      <Text style={styles.themeButtonText}>
        {modoOscuro ? 'Modo claro' : 'Modo oscuro'}
      </Text>
    </TouchableOpacity>
  );

  // ---------- SESIÓN ----------
  const iniciarSesion = async () =>
  {
    if (!correo || !contraseña)
    {
      Alert.alert('Error', 'Completá el correo y la contraseña');
      return;
    }

    try {
      setCargando(true);

      const { ok, datos } = await pedir('/api/auth/login', {
        metodo: 'POST',
        cuerpo: { correo, contraseña },
      });

      if (!ok)
      {
        Alert.alert('Error', datos.error || 'No se pudo iniciar sesión');
        return;
      }

      if ([1, 2, 3].includes(datos.usuario.id_rol))
      {
        setToken(datos.token);
        setUsuarioLogueado(datos.usuario);
      }
    }
    catch (error)
    {
      errorDeRed(error);
    }
    finally
    {
      setCargando(false);
    }
  };

  // Crea una cuenta nueva (el servidor siempre le pone rol 1)
  const registrarse = async () =>
  {
    if (!nombreRegistro.trim() || !correo.trim() || !contraseña)
    {
      Alert.alert('Error', 'Completá nombre, correo y contraseña');
      return;
    }

    if (contraseña.length < 6)
    {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setCargando(true);

      const { ok, datos } = await pedir('/api/auth/register', {
        metodo: 'POST',
        cuerpo: { nombre: nombreRegistro, correo, contraseña },
      });

      if (!ok)
      {
        Alert.alert('Error', datos.error || 'No se pudo registrar');
        return;
      }

      Alert.alert('Éxito', 'Cuenta creada. Ya podés iniciar sesión');

      setNombreRegistro('');
      setContraseña('');
      setModoRegistro(false);
    }
    catch (error)
    {
      errorDeRed(error);
    }
    finally
    {
      setCargando(false);
    }
  };

  // Borra la sesión y vuelve al login
  const cerrarSesion = () => {
    setToken(null);
    setUsuarioLogueado(null);
    setRecetas([]);
    setFavoritos([]);
    setSoloFavoritos(false);
    setSoloPendientes(false);
    setCorreo('');
    setContraseña('');
  };

  // ---------- ADMINISTRACIÓN DE USUARIOS (solo rol 3) ----------
  const abrirUsuarios = async () =>
  {
    try {
      const { ok, datos } = await pedir('/api/users', { token });

      if (!ok) {
        Alert.alert('Error', datos.error || 'No se pudieron cargar los usuarios');
        return;
      }

      setUsuarios(datos);
      setMostrandoUsuarios(true);
    }
    catch (error) {
      errorDeRed(error);
    }
  };

  const cambiarRolUsuario = async (id_usuario, id_rol) =>
  {
    try {
      const { ok, datos } = await pedir(`/api/users/${id_usuario}/rol`, {
        metodo: 'PUT',
        token,
        cuerpo: { id_rol },
      });

      if (!ok) {
        Alert.alert('Error', datos.error || 'No se pudo cambiar el rol');
        return;
      }

      setUsuarios(
        usuarios.map((u) => (u.id_usuario === id_usuario ? datos.usuario : u))
      );
    }
    catch (error) {
      errorDeRed(error);
    }
  };

  const eliminarUsuario = (usuario) =>
  {
    Alert.alert(
      'Eliminar usuario',
      `¿Seguro que querés eliminar a ${usuario.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const { ok, datos } = await pedir(
                `/api/users/${usuario.id_usuario}`,
                { metodo: 'DELETE', token }
              );

              if (!ok) {
                Alert.alert('Error', datos.error || 'No se pudo eliminar');
                return;
              }

              setUsuarios(
                usuarios.filter((u) => u.id_usuario !== usuario.id_usuario)
              );
            }
            catch (error) {
              errorDeRed(error);
            }
          },
        },
      ]
    );
  };

  // ---------- FAVORITOS ----------
  // Agrega o quita una receta de favoritos (POST o DELETE)
  const toggleFavorito = async (receta) =>
  {
    const esFavorito = favoritos.includes(receta.id_receta);

    try {
      const { ok, datos } = esFavorito
        ? await pedir(`/api/favorites/${receta.id_receta}`, {
            metodo: 'DELETE',
            token,
          })
        : await pedir('/api/favorites', {
            metodo: 'POST',
            token,
            cuerpo: { id_receta: receta.id_receta },
          });

      if (!ok) {
        Alert.alert('Error', datos.error || 'No se pudo actualizar favoritos');
        return;
      }

      setFavoritos(
        esFavorito
          ? favoritos.filter((id) => id !== receta.id_receta)
          : [...favoritos, receta.id_receta]
      );
    }
    catch (error) {
      errorDeRed(error);
    }
  };

  // ---------- RECETAS ----------
  // El administrador aprueba una receta pendiente
  const aprobarReceta = async (receta) =>
  {
    try {
      const { ok, datos } = await pedir(
        `/api/recipes/${receta.id_receta}/aprobar`,
        { metodo: 'PUT', token }
      );

      if (!ok) {
        Alert.alert('Error', datos.error || 'No se pudo aprobar la receta');
        return;
      }

      setRecetas(
        recetas.map((item) =>
          item.id_receta === datos.receta.id_receta ? datos.receta : item
        )
      );

      Alert.alert('Éxito', 'Receta aprobada');
    }
    catch (error) {
      errorDeRed(error);
    }
  };

  const crearReceta = async () =>
  {
    if (!nombreReceta || !descripcionReceta) {
      Alert.alert('Error', 'Completá el nombre y la preparación');
      return;
    }

    try {
      const { ok, datos } = await pedir('/api/recipes', {
        metodo: 'POST',
        token,
        cuerpo: {
          nombre: nombreReceta,
          descripcion: descripcionReceta,
          ingredientes: ingredientesReceta,
          imagen: imagenReceta,
        },
      });

      if (!ok) {
        Alert.alert('Error', datos.error || 'No se pudo crear la receta');
        return;
      }

      Alert.alert(
        'Éxito',
        usuarioLogueado.id_rol === 3
          ? 'Receta creada correctamente'
          : 'Receta enviada. Un administrador tiene que aprobarla para que otros la vean'
      );

      setNombreReceta('');
      setDescripcionReceta('');
      setIngredientesReceta('');
      setImagenReceta('');

      setRecetas([datos.receta, ...recetas]);
      setMostrandoFormulario(false);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
    catch (error) {
      errorDeRed(error);
    }
  };

  const editarReceta = (receta) =>
  {
    setRecetaEditando(receta);
    setMostrandoEdicion(true);
  };

  const actualizarReceta = async () =>
  {
    if (!recetaEditando) return;

    if (!recetaEditando.nombre || !recetaEditando.descripcion) {
      Alert.alert('Error', 'Completá el nombre y la preparación');
      return;
    }

    try {
      const { ok, datos } = await pedir(
        `/api/recipes/${recetaEditando.id_receta}`,
        {
          metodo: 'PUT',
          token,
          cuerpo: {
            nombre: recetaEditando.nombre,
            descripcion: recetaEditando.descripcion,
            ingredientes: recetaEditando.ingredientes,
            imagen: recetaEditando.imagen,
          },
        }
      );

      if (!ok) {
        Alert.alert('Error', datos.error || 'No se pudo actualizar');
        return;
      }

      setRecetas(
        recetas.map((receta) =>
          receta.id_receta === datos.receta.id_receta ? datos.receta : receta
        )
      );

      setRecetaEditando(null);
      setMostrandoEdicion(false);

      Alert.alert('Éxito', 'Receta actualizada correctamente');
    }
    catch (error) {
      errorDeRed(error);
    }
  };

  const eliminarReceta = async (receta) =>
  {
    try {
      const { ok, datos } = await pedir(
        `/api/recipes/${receta.id_receta}`,
        { metodo: 'DELETE', token }
      );

      if (!ok) {
        Alert.alert('Error', datos.error || 'No se pudo eliminar la receta');
        return;
      }

      setRecetas(recetas.filter((item) => item.id_receta !== receta.id_receta));
      setFavoritos(favoritos.filter((id) => id !== receta.id_receta));

      Alert.alert('Éxito', 'Receta eliminada correctamente');
    }
    catch (error) {
      errorDeRed(error);
    }
  };

  // ---------- PANTALLA CON USUARIO LOGUEADO ----------
  if (usuarioLogueado)
  {
    const rol = usuarioLogueado.id_rol;
    const puedeCrear = rol === 2 || rol === 3;

    const puedeModificar = (receta) =>
      rol === 3 || (rol === 2 && receta.id_usuario === usuarioLogueado.id_usuario);

    const tituloPanel = {
      1: 'Panel de Usuario',
      2: 'Panel de Cocinero',
      3: 'Panel de Administrador',
    };

    return (
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, backgroundColor: tema.fondo }}
      >
        <View style={[styles.container, { backgroundColor: tema.fondo }]}>
          <StatusBar style={modoOscuro ? 'light' : 'dark'} />

          {botonTema}

          <AppTitle tema={tema} />

          <Text style={[styles.subtitle, { color: tema.textoSuave }]}>
            Hola, {usuarioLogueado.nombre}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Buscar recetas..."
            placeholderTextColor="#999"
            value={busqueda}
            onChangeText={setBusqueda}
          />

          <Text style={[styles.homeText, { color: tema.texto }]}>
            {tituloPanel[rol]}
          </Text>

          <Text style={[styles.sectionTitle, { color: tema.texto }]}>
            {soloPendientes ? 'Posteos pendientes' : soloFavoritos ? 'Mis favoritos' : 'Recetas en tendencia'}
          </Text>

          {rol === 3 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                mostrandoUsuarios ? setMostrandoUsuarios(false) : abrirUsuarios()
              }
            >
              <Text style={styles.buttonText}>
                {mostrandoUsuarios ? 'Ocultar usuarios' : 'Administrar usuarios'}
              </Text>
            </TouchableOpacity>
          )}

          {rol === 3 && mostrandoUsuarios && (
            <UserAdminPanel
              usuarios={usuarios}
              tema={tema}
              cambiarRolUsuario={cambiarRolUsuario}
              eliminarUsuario={eliminarUsuario}
            />
          )}

          {rol === 3 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSoloPendientes(!soloPendientes)}
            >
              <Text style={styles.buttonText}>
                {soloPendientes
                  ? 'Ver todas las recetas'
                  : `Posteos pendientes (${recetas.filter((r) => r.aprobada === false).length})`}
              </Text>
            </TouchableOpacity>
          )}

          {soloFavoritos && recetasFiltradas.length === 0 && (
            <Text style={[styles.subtitle, { color: tema.textoSuave }]}>
              Todavía no tenés recetas favoritas
            </Text>
          )}

          {recetasFiltradas.map((receta) => (
            mostrandoEdicion && recetaEditando && recetaEditando.id_receta === receta.id_receta ? (
              <RecipeEditForm
                key={receta.id_receta}
                receta={recetaEditando}
                tema={tema}
                setReceta={setRecetaEditando}
                guardarCambios={actualizarReceta}
                cancelar={() => {
                  setRecetaEditando(null);
                  setMostrandoEdicion(false);
                }}
              />
            ) : (
            <RecipeCard
              key={receta.id_receta}
              receta={receta}
              editarReceta={editarReceta}
              eliminarReceta={eliminarReceta}
              puedeModificar={puedeModificar(receta)}
              esFavorito={favoritos.includes(receta.id_receta)}
              toggleFavorito={toggleFavorito}
              esAdmin={rol === 3}
              aprobarReceta={aprobarReceta}
              tema={tema}
            />
            )
          ))}

          {puedeCrear && !mostrandoFormulario && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setMostrandoFormulario(true)}
            >
              <Text style={styles.buttonText}>
                Crear receta
              </Text>
            </TouchableOpacity>
          )}

          {mostrandoFormulario && (
            <RecipeForm
              nombreReceta={nombreReceta}
              descripcionReceta={descripcionReceta}
              setNombreReceta={setNombreReceta}
              setDescripcionReceta={setDescripcionReceta}
              ingredientesReceta={ingredientesReceta}
              setIngredientesReceta={setIngredientesReceta}
              imagenReceta={imagenReceta}
              setImagenReceta={setImagenReceta}
              crearReceta={crearReceta}
              cerrarFormulario={() => setMostrandoFormulario(false)}
              tema={tema}
            />
          )}

          <View style={[styles.footer, { backgroundColor: tema.pie }]}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => setSoloFavoritos(!soloFavoritos)}
            >
              <Text style={styles.footerButtonText}>
                {soloFavoritos ? 'Ver todas' : 'Mis favoritos'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerButton, styles.footerButtonSalir]}
              onPress={cerrarSesion}
            >
              <Text style={styles.footerButtonText}>
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // ---------- PANTALLA DE LOGIN (sin usuario) ----------
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tema.fondo }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.container, { backgroundColor: tema.fondo }]}>
        <StatusBar style={modoOscuro ? 'light' : 'dark'} />

        {botonTema}

        <LoginForm
          modoRegistro={modoRegistro}
          setModoRegistro={setModoRegistro}
          nombreRegistro={nombreRegistro}
          setNombreRegistro={setNombreRegistro}
          correo={correo}
          setCorreo={setCorreo}
          contraseña={contraseña}
          setContraseña={setContraseña}
          cargando={cargando}
          onEnviar={modoRegistro ? registrarse : iniciarSesion}
          tema={tema}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    paddingTop: 60,
  },

  subtitle:
  {
    fontSize: 16,
    color: '#bbbbbb',
    marginBottom: 35,
  },

  input:
  {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#222222',
    borderWidth: 1,
    borderColor: '#d9cdbb',
  },

  button:
  {
    width: '100%',
    height: 50,
    backgroundColor: '#e67e22',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  buttonText:
  {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  themeButton:
  {
    alignSelf: 'center',
    backgroundColor: '#e67e22',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 20,
  },

  themeButtonText:
  {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },

  footer:
  {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 24,
    marginTop: 25,
  },

  footerButton:
  {
    flex: 1,
    backgroundColor: '#e67e22',
    paddingVertical: 13,
    borderRadius: 20,
    alignItems: 'center',
  },

  footerButtonSalir:
  {
    backgroundColor: '#C0392B',
  },

  footerButtonText:
  {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  homeText:
  {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 20,
  },

  sectionTitle:
  {
    width: '100%',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },

});
