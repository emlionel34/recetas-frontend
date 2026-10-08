import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

// Convierte un texto en HTML seguro (evita que caracteres raros rompan el PDF).
const escapar = (texto) =>
  String(texto || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Arma el HTML con el diseño de la receta.
const armarHtml = (receta) => {
  const ingredientes = String(receta.ingredientes || '')
    .split('\n')
    .map((linea) => linea.trim())
    .filter((linea) => linea.length > 0)
    .map((linea) => `<li>${escapar(linea)}</li>`)
    .join('');

  const preparacion = escapar(receta.descripcion).replace(/\n/g, '<br/>');

  return `
    <html>
      <body style="font-family: Helvetica, Arial, sans-serif; padding: 32px; color: #222;">
        <h1 style="color: #e67e22; margin-bottom: 4px;">${escapar(receta.nombre)}</h1>
        <hr style="border: 1px solid #e67e22;" />
        ${ingredientes ? `<h2>Ingredientes</h2><ul>${ingredientes}</ul>` : ''}
        <h2>Preparaci\u00f3n</h2>
        <p style="line-height: 1.5;">${preparacion}</p>
      </body>
    </html>
  `;
};

// Genera el PDF de la receta y abre el menu para guardarlo o compartirlo.
export const descargarPdf = async (receta) => {
  try {
    const { uri } = await Print.printToFileAsync({ html: armarHtml(receta) });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
      });
    } else {
      Alert.alert('PDF creado', uri);
    }
  } catch (error) {
    console.log(error);
    Alert.alert('Error', 'No se pudo generar el PDF');
  }
};
