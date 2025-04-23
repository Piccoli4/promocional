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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Tabla de Posiciones{"\n"}Promocional 2025
      </Text>
      {loading ? (
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
            tabla.map((item, index) => {
              const isLast = index === tabla.length - 1;
              return (
                <View key={item.equipo} style={styles.row}>
                  <Text style={[styles.cell, isLast && styles.textOut]}>{index + 1}</Text>
                  <Text style={[styles.equipoCell, {fontSize: 13} , isLast && styles.textOut]}>{item.equipo}</Text>
                  <Text style={[styles.cell, isLast && styles.textOut]}>{item.pj}</Text>
                  <Text style={[styles.cell, isLast && styles.textOut]}>{item.pg}</Text>
                  <Text style={[styles.cell, isLast && styles.textOut]}>{item.pp}</Text>
                  <Text style={[styles.cell, isLast && styles.textOut]}>{item.pf}</Text>
                  <Text style={[styles.cell, isLast && styles.textOut]}>{item.pc}</Text>
                  <Text style={[styles.cell, isLast && styles.textOut]}>{item.dg}</Text>
                  <Text style={[styles.cell, isLast && styles.textOut]}>{item.puntos}</Text>
                </View>
              );
            })            
          }
          {/* <View style={styles.legendContainer}>
            <View style={styles.legendCircle} />
            <Text style={styles.legendText}>Quedaría fuera de playoffs</Text>
          </View> */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 25,
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
    padding: 6,
    borderRadius: 3,
    marginBottom: 1
  },
  headerCell: {
    flex: 0.8,
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    padding: 6,
    marginBottom: 1,
    alignItems: 'center',
    borderRadius: 3
  },
  cell: {
    flex: 0.8,
    fontSize: 13,
    color: 'white',
    textAlign: 'center'
  },
  equipoCell: {
    flex: 2.2,
    fontSize: 14,
    color: 'white',
    textAlign: 'center'
  },
  // textOut: {
  //   color: '#A90000',
  //   textShadowColor: '#000',
  //   textShadowOffset: {width: 0.4, height: 0.4},
  //   textShadowRadius: 1
  // },  
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 6
  },
  legendCircle: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#A90000',
    marginRight: 8
  },
  legendText: {
    color: '#A90000',
    fontSize: 14,
    shadowColor: '#A90000',
    textShadowColor: '#000',
    textShadowOffset: {width: 0.1, height: 0.1},
    textShadowRadius: 0.5
  }  
});

export default Posiciones;
