import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ParkingScreen from './src/screens/ParkingScreen';
import VehicleInfoScreen from './src/screens/VehicleInfoScreen';

export type RootStackParamList = {
  Home: undefined;
  Parking: undefined;
  VehicleInfo: { plate: string }; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Parking del Zaidin Vergeles' }}
        />

        <Stack.Screen
          name="Parking"
          component={ParkingScreen}
          options={{ title: 'Plazas del Parking' }}
        />

        <Stack.Screen
          name="VehicleInfo"
          component={VehicleInfoScreen}
          options={{ title: 'Información del Vehículo' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
