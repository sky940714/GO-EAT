import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { X, Heart, RotateCcw, Star, ChevronLeft } from 'lucide-react-native';
import { STORES } from '../../constants/mockData';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SwipeScreen() {
  const [swipeIdx, setSwipeIdx] = useState(0);
  const router = useRouter();
  const currentFood = STORES[swipeIdx % STORES.length];

  const nextCard = () => setSwipeIdx(prev => prev + 1);

  return (
    <View style={styles.container}>
      {/* 頂部標題 */}
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerLabel}>AI 選餐推薦</Text>
          <View style={styles.activeIndicator} />
        </View>
      </View>

      {/* 餐廳大卡片 */}
      <View style={styles.cardContainer}>
        <View style={styles.mainCard}>
          <Image source={{ uri: currentFood.img }} style={styles.cardImg} />
          <View style={styles.overlay}>
            <View style={styles.tagRow}>
              <View style={[styles.badge, { backgroundColor: '#FF6B6B' }]}>
                <Text style={styles.badgeText}>{currentFood.cat}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={styles.badgeText}>{currentFood.dist}</Text>
              </View>
            </View>
            <Text style={styles.foodName}>{currentFood.name}</Text>
            <View style={styles.rateRow}>
              <Star size={18} color="#FFAD0E" fill="#FFAD0E" />
              <Text style={styles.rateValue}>{currentFood.rate}</Text>
              <Text style={styles.priceTag}>• $ 銅板美食</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 控制按鈕 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.circleBtn} onPress={nextCard}>
          <X size={32} color="#AAA" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.heartBtn} 
          onPress={() => router.push({ pathname: "/detail" as any, params: { id: currentFood.id } })}
        >
          <Heart size={40} color="#fff" fill="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.circleBtn} onPress={nextCard}>
          <RotateCcw size={28} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', padding: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 30 },
  headerTitleGroup: { alignItems: 'center' },
  headerLabel: { fontSize: 14, fontWeight: '900', letterSpacing: 2, color: '#333' },
  activeIndicator: { height: 3, width: 20, backgroundColor: '#FF6B6B', marginTop: 4, borderRadius: 2 },
  cardContainer: { flex: 1, elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  mainCard: { flex: 1, borderRadius: 50, overflow: 'hidden', backgroundColor: '#000' },
  cardImg: { ...StyleSheet.absoluteFillObject, opacity: 0.8 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end', padding: 35 },
  tagRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  badge: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  foodName: { color: '#fff', fontSize: 42, fontWeight: '900', marginBottom: 10, lineHeight: 48 },
  rateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rateValue: { color: '#fff', fontWeight: '900', fontSize: 18 },
  priceTag: { color: '#AAA', fontWeight: 'bold', fontSize: 14, fontStyle: 'italic' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30, paddingVertical: 40 },
  circleBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  heartBtn: { width: 85, height: 85, borderRadius: 45, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#FF6B6B', shadowOpacity: 0.4, shadowRadius: 10 }
});