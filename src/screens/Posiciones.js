import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchPartidos } from '../../services/partidos'; 

const Posiciones = () => {
    const [tabla, setTabla] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const obtenerDatos = async () => {
        const partidos = await fetchPartidos();
        const posiciones = calcularPosiciones(partidos);
        const ordenados = posiciones.sort((a, b) => {
          if (b.puntos !== a.puntos) return b.puntos - a.puntos;
          return b.dg - a.dg;
        });
        setTabla(ordenados);
        setLoading(false);
      };
      obtenerDatos();
    }, []);

    const calcularPosiciones = (partidos) => {
      const tabla = {};
      partidos.forEach(({ equipoLocal, puntosLocal, equipoVisitante, puntosVisitante }) => {
        if (!tabla[equipoLocal]) tabla[equipoLocal] = { equipo: equipoLocal, pj: 0, pg: 0, pp: 0, pf: 0, pc: 0 };
        if (!tabla[equipoVisitante]) tabla[equipoVisitante] = { equipo: equipoVisitante, pj: 0, pg: 0, pp: 0, pf: 0, pc: 0 };

        tabla[equipoLocal].pj += 1;
        tabla[equipoVisitante].pj += 1;

        tabla[equipoLocal].pf += puntosLocal;
        tabla[equipoLocal].pc += puntosVisitante;

        tabla[equipoVisitante].pf += puntosVisitante;
        tabla[equipoVisitante].pc += puntosLocal;

        if (puntosLocal > puntosVisitante) {
          tabla[equipoLocal].pg += 1;
          tabla[equipoVisitante].pp += 1;
        } else {
          tabla[equipoVisitante].pg += 1;
          tabla[equipoLocal].pp += 1;
        }
      });

      return Object.values(tabla).map((e) => ({
        ...e,
        dg: e.pf - e.pc,
        puntos: e.pg * 2 + e.pp * 1,
      }));
    };

    const renderItem = ({ item, index }) => (
      <View style={styles.row}>
        <Text style={styles.cell}>{index + 1}</Text>
        <Text style={styles.equipoCell}>{item.equipo}</Text>
        <Text style={styles.cell}>{item.pj}</Text>
        <Text style={styles.cell}>{item.pg}</Text>
        <Text style={styles.cell}>{item.pp}</Text>
        <Text style={styles.cell}>{item.pf}</Text>
        <Text style={styles.cell}>{item.pc}</Text>
        <Text style={styles.cell}>{item.dg}</Text>
        <Text style={styles.cell}>{item.puntos}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Tabla de Posiciones{"\n"}Promocional 2025
      </Text>
      {loading ? (
        // Mostrar un indicador de carga mientras se obtienen los datos
        <ActivityIndicator size="large" color="#A90000" />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerCell}>#</Text>
            <Text style={[styles.equipoCell, { fontWeight: 'bold' }]}>EQUIPO</Text>
            <Text style={styles.headerCell}>PJ</Text>
            <Text style={styles.headerCell}>PG</Text>
            <Text style={styles.headerCell}>PP</Text>
            <Text style={styles.headerCell}>PF</Text>
            <Text style={styles.headerCell}>PC</Text>
            <Text style={styles.headerCell}>DIF</Text>
            <Text style={styles.headerCell}>PTS</Text>
          </View>

          {
            tabla.map((item, index) => (
              <View key={item.equipo} style={styles.row}>
                <Text style={styles.cell}>{index + 1}</Text>
                <Text style={styles.equipoCell}>{item.equipo}</Text>
                <Text style={styles.cell}>{item.pj}</Text>
                <Text style={styles.cell}>{item.pg}</Text>
                <Text style={styles.cell}>{item.pp}</Text>
                <Text style={styles.cell}>{item.pf}</Text>
                <Text style={styles.cell}>{item.pc}</Text>
                <Text style={styles.cell}>{item.dg}</Text>
                <Text style={styles.cell}>{item.puntos}</Text>
              </View>
            ))
          }
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 50,
    padding: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    textShadowColor: '#A90000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#a90000',
    padding: 6
  },
  headerCell: {
    flex: 0.8,
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#2c2c2c',
    padding: 6,
    marginBottom: 1,
    alignItems: 'center',
  },
  cell: {
    flex: 0.8,
    fontSize: 12,
    color: 'white',
    textAlign: 'center'
  },
  equipoCell: {
    flex: 2.2,
    fontSize: 12,
    color: 'white',
    textAlign: 'center'
  }
  
});

export default Posiciones;
