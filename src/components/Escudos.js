import { Image } from 'react-native';
import escudos from '../utils/escudos';

const normalizar = (nombre) =>
  nombre
    .normalize('NFD') // Separa letras y tildes
    .replace(/[\u0300-\u036f]/g, '') // Elimina las tildes
    .trim() // Quita espacios adelante y atrás
    .toLowerCase()
    .replace(/\s/g, '') // Quita espacios intermedios
    .replace(/[^a-z0-9]/gi, ''); // Elimina símbolos


const Escudo = ({ nombre, style }) => {
  const clave = normalizar(nombre);
  const fuente = escudos[clave];

  if (!fuente) {
    console.warn(`Escudo no encontrado para: ${nombre}`);
    return null;
  }

  return (
    <Image
      source={fuente}
      style={[{ width: 60, height: 60, resizeMode: 'cover' }, style]}
    />
  );
};

export default Escudo;