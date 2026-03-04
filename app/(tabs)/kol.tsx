import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { KOLS } from '../../constants/mockData';

const { width } = Dimensions.get('window');

export default function KOLScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>KOL 帶路</Text>
      <Text style={styles.headerSub}>專業美食達人的私人隱藏清單</Text>

      {KOLS.map((kol) => (
        <View key={kol.id} style={styles.kolCard}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: kol.img }} style={styles.mainImg} />
            <View style={styles.overlay}>
              <Text style={styles.hotTag}>🔥 熱門推薦</Text>
              <Text style={styles.pickText}>{kol.pick}</Text>
              <Text style={styles.followerText}>跟隨者 {kol.followers}</Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.avatarGroup}>
              <View style={styles.avatarBorder}>
                <Image source={{ uri: kol.img }} style={styles.avatar} />
              </View>
              <Text style={styles.kolName}>{kol.name}</Text>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followText}>追蹤清單</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#333' },
  headerSub: { fontSize: 14, color: '#999', marginTop: 5, marginBottom: 30 },
  kolCard: { marginBottom: 40 },
  imageContainer: { height: 250, borderRadius: 40, overflow: 'hidden', elevation: 10 },
  mainImg: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', padding: 25, justifyContent: 'flex-end' },
  hotTag: { color: '#FFAD0E', fontWeight: '900', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  pickText: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 5 },
  followerText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 'bold', fontStyle: 'italic' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingHorizontal: 10 },
  avatarGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBorder: { padding: 2, borderRadius: 25, borderWidth: 2, borderColor: '#FF6B6B' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  kolName: { fontSize: 18, fontWeight: '900', color: '#333' },
  followBtn: { backgroundColor: '#FF6B6B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  followText: { color: '#fff', fontWeight: '900', fontSize: 12 }
});