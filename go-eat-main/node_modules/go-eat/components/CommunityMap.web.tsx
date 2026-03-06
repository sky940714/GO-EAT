import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Map } from 'lucide-react-native';

export default function CommunityMap({ mapViewMode, interactive = false }: { mapViewMode: 'personal' | 'public', interactive?: boolean }) {
  return (
    // 如果是全螢幕模式，取消圓角
    <View style={[styles.container, interactive && { borderRadius: 0 }]}>
      <Map size={48} color="#ccc" style={{ marginBottom: 10 }} />
      <Text style={styles.text}>📍 網頁版無法顯示 3D 互動地圖</Text>
      <Text style={styles.subText}>
        目前視角：{mapViewMode === 'personal' ? '我的足跡' : '全城熱度'}
      </Text>
      <Text style={styles.subText}>請使用手機版 App 查看完整特效</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderRadius: 30 },
  text: { fontSize: 16, fontWeight: 'bold', color: '#888', marginBottom: 5 },
  subText: { fontSize: 12, color: '#aaa', marginTop: 4 }
});