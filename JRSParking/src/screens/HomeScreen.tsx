import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
const logo = require('../assets/park.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Parking del Zaidín Vergeles</Text>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Bienvenido a la App de Parking</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Parking')}
      >
        <Text style={styles.buttonText}>Ver Plazas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
