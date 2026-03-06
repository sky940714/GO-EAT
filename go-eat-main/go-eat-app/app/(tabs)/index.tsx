import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MapPin, Search, Bell, Flame, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
// 引入我們做好的分離式元件 (Expo 會自動判斷要抓 .tsx 還是 .web.tsx)
import MapComponent from '../../components/MapComponent'; 

// 模擬數據
const HOT_STORES = [
  { id: 101, name: "通化街魷魚羹", userCount: 15, img: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=400" },
  { id: 102, name: "寧夏夜市蚵仔煎", userCount: 28, img: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=400" },
  { id: 103, name: "臨江街鹽水雞", userCount: 12, img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400" },
];

const STORES = [
  { id: 1, name: "阿公手工糯米腸", cat: "夜市小吃", rate: 4.9, dist: "300m", lat: 25.0336, lng: 121.5648, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800" },
];

export default function HomePage() {
  const [mode, setMode] = useState('choose');
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 1. 懸浮頂部地址列 */}
      <View style={styles.topBar}>
        <View style={styles.locationTag}>
          <MapPin size={14} color="#FF6B6B" />
          <Text style={styles.locationText} numberOfLines={1}>台北市信義區忠孝東路...</Text>
        </View>
        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconBtn}><Search size={20} color="#666" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Bell size={20} color="#666" /></TouchableOpacity>
        </View>
      </View>

      {/* 2. 模式切換器 */}
      <View style={styles.modeSwitcher}>
        <TouchableOpacity 
          onPress={() => setMode('choose')}
          style={[styles.modeBtn, mode === 'choose' && styles.modeBtnActive]}
        >
          <Text style={[styles.modeBtnText, mode === 'choose' && styles.modeBtnTextActive]}>幫您選擇</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setMode('nearby')}
          style={[styles.modeBtn, mode === 'nearby' && styles.modeBtnActive]}
        >
          <Text style={[styles.modeBtnText, mode === 'nearby' && styles.modeBtnTextActive]}>附近美食</Text>
        </TouchableOpacity>
      </View>

      {/* 內容區塊分流 */}
      {mode === 'choose' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={styles.aiSection}>
            <View style={styles.aiCard}>
              <Text style={styles.aiTitle}>不知道吃啥？{"\n"}讓 GO EAT 幫你選！</Text>
              <Text style={styles.aiSub}>基於 23,402 位在地老饕數據</Text>
              <TouchableOpacity 
                style={styles.aiStartBtn}
                onPress={() => router.push('/swipe' as any)}
              >
                <Flame size={18} color="#FF6B6B" fill="#FF6B6B" />
                <Text style={styles.aiStartText}>立即開始</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.socialSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>附近的人都在吃...</Text>
              <Users size={18} color="#FF6B6B" />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.socialScroll}>
              {HOT_STORES.map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.socialCard}
                  onPress={() => router.push({ pathname: '/detail' as any, params: { id: item.id } })}
                >
                  <Image source={{ uri: item.img }} style={styles.socialImg} />
                  <View style={styles.socialInfo}>
                    <Text style={styles.socialName}>{item.name}</Text>
                    <Text style={styles.socialCount}>{item.userCount} 人剛選了這家</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      ) : (
        /* 直接使用分離的地圖元件 */
        <MapComponent stores={STORES} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, paddingHorizontal: 20, marginBottom: 20 },
  locationTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, maxWidth: '65%', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10 },
  locationText: { fontSize: 13, fontWeight: 'bold', marginLeft: 6, color: '#333' },
  iconGroup: { flexDirection: 'row', gap: 10 },
  iconBtn: { backgroundColor: '#fff', padding: 12, borderRadius: 18, elevation: 5, shadowOpacity: 0.1 },
  modeSwitcher: { flexDirection: 'row', backgroundColor: '#EEE', padding: 5, borderRadius: 30, marginHorizontal: 20, marginBottom: 20 },
  modeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 25 },
  modeBtnActive: { backgroundColor: '#fff', elevation: 3 },
  modeBtnText: { fontSize: 14, fontWeight: '900', color: '#888' },
  modeBtnTextActive: { color: '#FF6B6B' },
  aiSection: { paddingHorizontal: 20, marginBottom: 30 },
  aiCard: { backgroundColor: '#FF6B6B', borderRadius: 35, padding: 30, elevation: 10, shadowColor: '#FF6B6B', shadowOpacity: 0.3, shadowRadius: 15 },
  aiTitle: { fontSize: 28, fontWeight: '900', color: '#fff', lineHeight: 36 },
  aiSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginVertical: 15, fontWeight: 'bold' },
  aiStartBtn: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 20, gap: 8 },
  aiStartText: { color: '#FF6B6B', fontWeight: '900', fontSize: 16 },
  socialSection: { paddingLeft: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#333' },
  socialScroll: { flexDirection: 'row' },
  socialCard: { backgroundColor: '#fff', width: 160, borderRadius: 25, padding: 10, marginRight: 15, elevation: 5, shadowOpacity: 0.05 },
  socialImg: { width: '100%', height: 100, borderRadius: 20, marginBottom: 10 },
  socialInfo: { paddingHorizontal: 5 },
  socialName: { fontSize: 14, fontWeight: '900', color: '#333' },
  socialCount: { fontSize: 11, color: '#FF6B6B', fontWeight: 'bold', marginTop: 4 },
});