import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
  TextInput,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { ParkingGrid } from '../components/ParkingGrid';
import { Spot } from '../types';

// Importamos nuestro store de Zustand
import { useParkingStore } from '../store/useParkingStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Parking'>;

export default function ParkingScreen({ navigation }: Props) {
  const { spots, fetchSpots } = useParkingStore();

  // Hook búsqueda de matrícula 
  const [searchPlate, setSearchPlate] = useState('');

  // Cargamos las plazas al montar el componente
  useEffect(() => {
    fetchSpots().catch(() => {
      Alert.alert('Error', 'No se pudieron obtener las plazas del servidor');
    });
  }, []);

  //Pulsar en una plaza para ver mas info
  const handleSpotClick = (spot: Spot) => {
    navigation.navigate('VehicleInfo', { plate: spot.plate });
  };

  // Buscar la matrícula introducida
  const handleSearch = () => {
    const plateToFind = searchPlate.trim().toUpperCase();
    if (!plateToFind) {
      Alert.alert('Aviso', 'Introduce una matrícula');
      return;
    }

    // Busca la matrícula dentro de los spots
    const foundSpot = spots.find(
      (s) => s.plate.toUpperCase() === plateToFind && s.status === 'occupied'
    );

    if (foundSpot) {
      navigation.navigate('VehicleInfo', { plate: foundSpot.plate });
    } else {
      Alert.alert('No encontrado', 'Esta matrícula no está en el parking');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Plazas del Parking</Text>
      
      {/* Grid con las plazas */}
      <ParkingGrid spots={spots} onSpotClick={handleSpotClick} />

      {/* Botón para recargar */}
      <Button
        title="Actualizar plazas"
        onPress={() => {
          fetchSpots().catch(() => {
            Alert.alert('Error', 'No se pudieron obtener las plazas del servidor');
          });
        }}
      />

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Text style={styles.label}>Buscar Matrícula</Text>
        <TextInput
          style={styles.input}
          value={searchPlate}
          onChangeText={setSearchPlate}
          placeholder="Ej: ABC1234"
        />
        <Button title="Buscar" onPress={handleSearch} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  searchContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 30,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
