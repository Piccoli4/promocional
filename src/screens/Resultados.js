import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchPartidos } from '../../services/partidos';
import { useWindowDimensions } from 'react-native';

const Resultados = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [fechasDisponibles, setFechasDisponibles] = useState({});
  const [ordenFechas, setOrdenFechas] = useState([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const obtenerPartidos = async () => {
      const data = await fetchPartidos();
      const agrupados = agruparPorFecha(data);
      setFechasDisponibles(agrupados);
      setOrdenFechas(Object.keys(agrupados).sort((a, b) => a - b));
    };

    obtenerPartidos();
  }, []);

  const agruparPorFecha = (partidos) => {
    const fechas = {};

    partidos.forEach((partido) => {
      const numeroFecha = partido.fecha;
      if (!fechas[numeroFecha]) fechas[numeroFecha] = [];
      fechas[numeroFecha].push(partido);
    });

    return fechas;
  };

  return (
    <View style={[styles.container, width > 768 && { width: '95%', alignSelf: 'center', alignItems: 'center' }]}>
      <Text style={[styles.titulo, width > 768 && { width: '100%', alignSelf: 'center' }]}>RESULTADOS</Text>

      <View style={[
        styles.fechasContainer, 
        !fechaSeleccionada && { marginBottom: 5 },
        width > 768 && { width: '100%', alignSelf: 'center' 
        }]}
      >
        {ordenFechas.map((fechaNum) => (
          <Pressable
            key={fechaNum}
            onPress={() => {
              setFechaSeleccionada((prev) => (prev === fechaNum ? null : fechaNum));
            }}
            style={[
              styles.fechaBtn,
              fechaSeleccionada === fechaNum && styles.fechaActiva,
            ]}
          >
            <Text style={styles.fechaTexto}>Fecha {fechaNum}</Text>
          </Pressable>
        ))}
      </View>

      {fechaSeleccionada && fechasDisponibles[fechaSeleccionada] ? (
        <View style={[styles.resultadosContainer, { marginBottom: 20 }, width > 768 && { width: '100%', maxWidth: 420}]}>
          {fechasDisponibles[fechaSeleccionada].map((item, index) => (
            <View key={index} style={styles.partido}>
              <View style={styles.partidoRow}>
                <Text style={[styles.texto, styles.equipoLocal]}>
                  {item.equipoLocal}
                </Text>
                <Text style={[styles.texto, styles.puntos]}>
                  {item.puntosLocal} - {item.puntosVisitante}
                </Text>
                <Text style={[styles.texto, styles.equipoVisitante]}>
                  {item.equipoVisitante}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        fechaSeleccionada && (
          <Text style={styles.noPartidosTexto}>No hay partidos para esta fecha.</Text>
        )
      )}
    </View>
  );
};

export default Resultados;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10
  },
  titulo: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    textShadowColor: '#000055',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textAlign: 'center',
  },
  fechasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  fechaBtn: {
    backgroundColor: '#000055',
    padding: 8,
    margin: 5,
    borderRadius: 5,
  },
  fechaActiva: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  fechaTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1
  },
  partido: {
    backgroundColor: '#2c2c2c',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  partidoRow: {
    flexDirection: 'row'
  },
  equipoLocal: {
    flex: 1,
    textAlign: 'left'
  },
  equipoVisitante: {
    flex: 1,
    textAlign: 'right'
  },
  texto: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  puntos: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  noPartidosTexto: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
  },
  resultadosContainer: {
    height: 150
  }
});
