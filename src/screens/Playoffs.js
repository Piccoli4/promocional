import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { fetchPartidos } from '../../services/partidos';
import Escudo from '../components/Escudos';

const Playoffs = () => {
    const [tabla, setTabla] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerDatos = async () => {
            const partidos = await fetchPartidos();
            const posiciones = calcularPosiciones(partidos);
            const ordenados = posiciones.sort((a, b) => {
            if (b.puntos !== a.puntos) return b.puntos - a.puntos;
            
            // Si tienen los mismos puntos, miramos el enfrentamiento entre ellos
            const resultadoEntreEllos = partidos.find(
                (p) =>
                (p.equipoLocal === a.equipo && p.equipoVisitante === b.equipo) ||
                (p.equipoLocal === b.equipo && p.equipoVisitante === a.equipo)
            );

            if (resultadoEntreEllos) {
                const { equipoLocal, puntosLocal, equipoVisitante, puntosVisitante } = resultadoEntreEllos;

                if (
                equipoLocal === a.equipo &&
                puntosLocal > puntosVisitante
                ) return -1;
                if (
                equipoVisitante === a.equipo &&
                puntosVisitante > puntosLocal
                ) return -1;
                if (
                equipoLocal === b.equipo &&
                puntosLocal > puntosVisitante
                ) return 1;
                if (
                equipoVisitante === b.equipo &&
                puntosVisitante > puntosLocal
                ) return 1;
            }

            // Si empataron entre ellos o no se enfrentaron aún
            return 0;
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

    if (loading) return <ActivityIndicator size="large" color="#A90000" style={{ marginTop: 20 }} />;

    const primero = tabla[0];
    const segundo = tabla[1];
    const tercero = tabla[2];
    const cuarto = tabla[3];
    const quinto = tabla[4];
    const sexto = tabla[5];
    const septimo = tabla[6];
    const octavo = tabla[7];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Playoffs</Text>

            {/* Semifinales */}
            <View style={styles.sectionPlayoffs}>
                <View style={styles.playoffsIzquierda}>
                    <Text style={styles.semifinales}>Semifinales</Text>
                    <Escudo nombre={primero.equipo} />
                    <Text style={styles.vs}>vs</Text>
                    <Text style={styles.texto}>Ganador 3ro vs 6to</Text>
                </View>
                <View>
                    <Text style={styles.final}>FINAL</Text>
                </View>
                <View style={styles.playoffsDerecha}>
                    <Text style={styles.semifinales}>Semifinales</Text>
                    <Escudo nombre={segundo.equipo} />
                    <Text style={styles.vs}>vs</Text>
                    <Text style={styles.texto}>Ganador 4to vs 5to</Text>
                </View>
            </View>

            {/* Play-in */}
            <Text style={styles.title}>Play-in</Text>
            <View style={styles.sectionPlayoffs}>
                <View style={styles.playoffsIzquierda}>
                    <Escudo nombre={tercero.equipo} />
                    <Text style={styles.vs}>vs</Text>
                    <Escudo nombre={sexto.equipo} />
                </View>
                <View>
                    <Text style={styles.final}>PLAYOFFS</Text>
                </View>
                <View style={styles.playoffsDerecha}>
                    <Escudo nombre={cuarto.equipo} />
                    <Text style={styles.vs}>vs</Text>
                    <Escudo nombre={quinto.equipo} />
                </View>
            </View>

            {/* Copa Estímulo */}
            <Text style={styles.title}>Copa Estímulo</Text>
            <View style={styles.sectionPlayoffs}>
                <View style={styles.playoffsIzquierda}>
                    <Escudo nombre={septimo.equipo} />
                    <Text style={styles.vs}>vs</Text>
                    <Text style={styles.texto}>Perdedor 3ro vs 6to</Text>
                </View>
                <View>
                    <Text style={styles.final}>FINAL</Text>
                </View>
                <View style={styles.playoffsDerecha}>
                    <Escudo nombre={octavo.equipo} />
                    <Text style={styles.vs}>vs</Text>
                    <Text style={styles.texto}>Perdedor 4to vs 5to</Text>
                </View>
            </View>
        </View>
    );
};

export default Playoffs;

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
    semifinales: {
        color: '#FFF',
        fontSize: 18,
        textAlign: 'left',
        marginBottom: 15,
        fontWeight: 'bold',
        textShadowColor: '#A90000',
        textShadowOffset: {width: 0.6, height: 0.6},
        textShadowRadius: 1
    },
    sectionPlayoffs: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignContent: 'center',
        marginBottom: 20,
    },
    playoffsIzquierda: {
        alignItems: 'center',
    },
    playoffsDerecha: {
        alignItems: 'center',
    },
    vs: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: 'bold',
        marginVertical: 10,
        textShadowColor: '#A90000',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1
    },
    texto: {
        color: '#FFF',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: '#A90000',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1
    },
    final: {
        fontSize: 20,
        color: '#A90000',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        textShadowColor: '#fff',
        textShadowOffset: {width: 0.6, height: 0.6},
        textShadowRadius: 1
    },

});
