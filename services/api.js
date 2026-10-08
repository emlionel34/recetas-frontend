import { API_URL } from '../config';

// Hace un pedido al servidor y devuelve { ok, datos }.
//   ruta:   por ejemplo '/api/recipes'
//   metodo: 'GET' (por defecto), 'POST', 'PUT' o 'DELETE'
//   token:  el token del usuario logueado (si la ruta lo pide)
//   cuerpo: los datos a enviar (se convierten a JSON solos)
// Si no hay conexión con el servidor, lanza un error que se atrapa afuera.
export const pedir = async (ruta, { metodo = 'GET', token, cuerpo } = {}) => {
  const headers = {};

  if (cuerpo) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    headers,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });

  const texto = await respuesta.text();

  try {
    return { ok: respuesta.ok, datos: texto ? JSON.parse(texto) : {} };
  } catch (error) {
    // El servidor respondió algo que no es JSON (por ejemplo una página de error)
    return {
      ok: false,
      datos: { error: `Respuesta inesperada del servidor (${respuesta.status})` },
    };
  }
};
