import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Flame, Flag } from 'lucide-react-native';

const PERSONAL_PINS = [
  { id: 1, lat: 25.0346, lng: 121.5648 },
  { id: 2, lat: 25.0320, lng: 121.5660 },
  { id: 3, lat: 25.0350, lng: 121.5620 },
];

const PUBLIC_HOTSPOTS = [
  { id: 1, lat: 25.0336, lng: 121.5648, count: 850 },
  { id: 2, lat: 25.0310, lng: 121.5670, count: 320 },
];

// 新增了 interactive 屬性
export default function CommunityMap({ mapViewMode, interactive = false }: { mapViewMode: 'personal' | 'public', interactive?: boolean }) {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      // 如果是全螢幕(interactive)，視野稍微拉遠一點 (0.03)，預覽則近一點 (0.015)
      initialRegion={{ 
        latitude: 25.0336, longitude: 121.5648, 
        latitudeDelta: interactive ? 0.03 : 0.015, 
        longitudeDelta: interactive ? 0.03 : 0.015 
      }}
      // 根據 interactive 決定是否可以滑動與縮放
      scrollEnabled={interactive} 
      zoomEnabled={interactive} 
      pitchEnabled={interactive}
    >
      {mapViewMode === 'personal'
        ? PERSONAL_PINS.map(pin => (
            <Marker key={`p-${pin.id}`} coordinate={{ latitude: pin.lat, longitude: pin.lng }}>
              <View style={styles.personalMarker}><Flag size={14} color="#fff" fill="#fff" /></View>
            </Marker>
          ))
        : PUBLIC_HOTSPOTS.map(spot => (
            <Marker key={`h-${spot.id}`} coordinate={{ latitude: spot.lat, longitude: spot.lng }}>
              <View style={styles.publicMarker}>
                <Flame size={16} color="#fff" fill="#fff" />
                <Text style={styles.publicMarkerText}>{spot.count}</Text>
              </View>
            </Marker>
          ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  personalMarker: { backgroundColor: '#FF6B6B', padding: 6, borderRadius: 12, borderWidth: 2, borderColor: '#fff', elevation: 4, shadowColor: '#FF6B6B', shadowOpacity: 0.4, shadowRadius: 4 },
  publicMarker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFAD0E', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 2, borderColor: '#fff', elevation: 6, shadowColor: '#FFAD0E', shadowOpacity: 0.5, shadowRadius: 6, gap: 4 },
  publicMarkerText: { color: '#fff', fontSize: 12, fontWeight: '900' },
});