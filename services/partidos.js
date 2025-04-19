import { collection, getDocs } from 'firebase/firestore';
import { db } from '../src/db/firebase';

export const fetchPartidos = async () => {
  const querySnapshot = await getDocs(collection(db, 'partidos'));
  return querySnapshot.docs.map(doc => doc.data());
};
