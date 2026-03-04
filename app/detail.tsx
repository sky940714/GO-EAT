import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ChevronLeft, Star, Navigation, Bike, Clock } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { STORES } from '../constants/mockData';

const { width } = Dimensions.get('window');

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // 根據 ID 尋找餐廳，若找不到則顯示第一筆作為預設
  const store = STORES.find(s => s.id.toString() === id) || STORES[0];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.imageHeader}>
          <Image source={{ uri: store.img }} style={styles.mainImg} />
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.roundedCorner} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.storeName}>{store.name}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.rateBadge}>
                <Star size={14} color="#FFAD0E" fill="#FFAD0E" />
                <Text style={styles.rateText}>{store.rate}</Text>
              </View>
              <Text style={styles.catText}>{store.cat}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.mainAction} activeOpacity={0.8}>
              <Navigation size={22} color="#fff" />
              <Text style={styles.actionText}>開始導覽</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.subAction} disabled>
              <Bike size={22} color="#AAA" />
              <Text style={styles.subActionText}>外送</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>餐廳資訊</Text>
          <View style={styles.infoCard}>
            <Clock size={18} color="#666" />
            <Text style={styles.infoText}>營業時間：17:00 - 23:00 (今日營業中)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageHeader: { height: 350, width: width },
  mainImg: { width: '100%', height: '100%' },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 20 },
  roundedCorner: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 40, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40 },
  content: { paddingHorizontal: 25, marginTop: 10 },
  titleSection: { marginBottom: 5 },
  storeName: { fontSize: 32, fontWeight: '900', color: '#333' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 10, marginBottom: 25 },
  rateBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9E5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  rateText: { color: '#FFAD0E', fontWeight: '900', marginLeft: 4 },
  catText: { color: '#FF6B6B', fontWeight: '900' },
  actionRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  mainAction: { flex: 1, backgroundColor: '#FF6B6B', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 25, gap: 10 },
  actionText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  subAction: { flex: 1, backgroundColor: '#F5F5F5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 25, gap: 10 },
  subActionText: { color: '#AAA', fontSize: 18, fontWeight: '900' },
  sectionTitle: { fontSize: 20, fontWeight: '900', marginBottom: 15 },
  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FB', padding: 20, borderRadius: 20, gap: 10 },
  infoText: { color: '#666', fontWeight: '600' }
});