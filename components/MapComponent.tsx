import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Navigation } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function MapComponent({ stores }: { stores: any[] }) {
  const router = useRouter();

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 25.0336,
          longitude: 121.5648,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {stores.map(s => (
          <Marker 
            key={s.id} 
            coordinate={{ latitude: s.lat, longitude: s.lng }}
            title={s.name}
          >
            <View style={styles.customMarker}>
              <Image source={{ uri: s.img }} style={styles.markerImg} />
            </View>
            <Callout onPress={() => router.push({ pathname: '/detail' as any, params: { id: s.id } })}>
               <View style={styles.callout}>
                  <Text style={styles.calloutName}>{s.name}</Text>
                  <Text style={styles.calloutDetail}>點擊查看詳情</Text>
               </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.mapHint}>
        <Navigation size={14} color="#fff" />
        <Text style={styles.mapHintText}>正在搜尋附近合作店家...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: { flex: 1, borderRadius: 40, overflow: 'hidden', marginHorizontal: 10, marginBottom: 100 },
  map: { width: '100%', height: '100%' },
  customMarker: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 3, borderColor: '#fff', overflow: 'hidden', backgroundColor: '#FF6B6B' },
  markerImg: { width: '100%', height: '100%' },
  mapHint: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, gap: 8, alignItems: 'center' },
  mapHintText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  callout: { padding: 10, width: 120 },
  calloutName: { fontSize: 14, fontWeight: 'bold' },
  calloutDetail: { fontSize: 10, color: '#FF6B6B', marginTop: 4 }
});