import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { temas } from '../theme';

const nombresRol = {
  1: 'Usuario',
  2: 'Cocinero',
  3: 'Admin',
};

// Lista de usuarios con botones para cambiar rol o eliminar.
// No hace pedidos al backend: recibe las funciones por props desde App.js.
export default function UserAdminPanel({
  usuarios,
  cambiarRolUsuario,
  eliminarUsuario,
  tema = temas.oscuro,
}) {
  return (
    <View style={styles.panel}>
      {usuarios.map((u) => (
        <View key={u.id_usuario} style={[styles.userRow, { backgroundColor: tema.tarjeta }]}>
          <Text style={[styles.userName, { color: tema.tarjetaTexto }]}>{u.nombre}</Text>
          <Text style={[styles.userMail, { color: tema.tarjetaDescripcion }]}>{u.correo}</Text>
          <Text style={[styles.userMail, { color: tema.tarjetaDescripcion }]}>
            Rol actual: {nombresRol[u.id_rol]}
          </Text>

          <View style={styles.userButtons}>
            {[1, 2, 3].map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.roleButton,
                  u.id_rol === r && styles.roleButtonActive,
                ]}
                onPress={() => cambiarRolUsuario(u.id_usuario, r)}
              >
                <Text style={styles.roleButtonText}>{nombresRol[r]}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.deleteUserButton}
              onPress={() => eliminarUsuario(u)}
            >
              <Text style={styles.roleButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    marginBottom: 20,
  },

  userRow: {
    width: '100%',
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  userName: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  userMail: {
    color: '#bbbbbb',
    fontSize: 14,
    marginTop: 2,
  },

  userButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },

  roleButton: {
    backgroundColor: '#555555',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  roleButtonActive: {
    backgroundColor: '#e67e22',
  },

  deleteUserButton: {
    backgroundColor: '#C0392B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  roleButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});