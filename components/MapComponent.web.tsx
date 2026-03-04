import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Map } from 'lucide-react-native';

export default function MapComponent({ stores }: { stores: any[] }) {
  return (
    <View style={styles.webPlaceholder}>
      <Map size={48} color="#FF6B6B" style={{ marginBottom: 15 }} /> 
      <Text style={styles.webTextTitle}>📍 地圖功能僅限手機端</Text>
      <Text style={styles.webTextSub}>請使用 iPhone 掃描 QR Code</Text>
      <Text style={styles.webTextSub}>在 Expo Go 中體驗完整地圖互動</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', margin: 20, marginBottom: 100, borderRadius: 40, borderStyle: 'dashed', borderWidth: 2, borderColor: '#ccc' },
  webTextTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  webTextSub: { fontSize: 14, color: '#999' }
});