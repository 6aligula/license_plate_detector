import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useParkingStore } from '../store/useParkingStore';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleInfo'>;

export default function VehicleInfoScreen({ route }: Props) {
  const { plate } = route.params;
  const { getSpotByPlate, fetchSpots } = useParkingStore();

  const [loading, setLoading] = useState(true);
  const [spot, setSpot] = useState(() => getSpotByPlate(plate) || null);

  useEffect(() => {
    if (!spot) {
      fetchSpots()
        .then(() => {
          const found = getSpotByPlate(plate);
          if (!found) {
            Alert.alert('No se encontró', 'No hay plaza con esa matrícula');
          } else {
            setSpot(found);
          }
        })
        .catch(() => {
          Alert.alert('Error', 'No se pudo conectar con el servidor');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!spot) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>
          No hay datos para la matrícula {plate}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información del Vehículo</Text>
      <View style={styles.card}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{spot.id}</Text>

        <Text style={styles.label}>Matrícula:</Text>
        <Text style={styles.value}>{spot.plate}</Text>

        <Text style={styles.label}>Estado:</Text>
        <Text
          style={[
            styles.value,
            spot.status === 'occupied'
              ? styles.statusOccupied
              : styles.statusAvailable,
          ]}
        >
          {spot.status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1f2937',
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
  },
  statusOccupied: {
    color: '#dc2626',
  },
  statusAvailable: {
    color: '#16a34a',
  },
});
