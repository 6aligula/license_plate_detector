import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Spot } from '../types';

interface ParkingGridProps {
  spots: Spot[];
  onSpotClick: (spot: Spot) => void;
}

export function ParkingGrid({ spots, onSpotClick }: ParkingGridProps) {
  return (
    <View style={styles.grid}>
      {spots.map((spot) => (
        <TouchableOpacity
          key={spot.id}
          style={styles.spot}
          onPress={() => onSpotClick(spot)}
        >
          <Icon name="directions-car" size={24} color="#000" />
          <Text style={styles.spotText}>ID: {spot.id}</Text>
          <Text style={styles.spotText}>{spot.plate}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  spot: {
    width: '40%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    backgroundColor: '#d1fae5',
  },
  spotText: {
    fontWeight: '600',
    marginTop: 4,
  },
});
