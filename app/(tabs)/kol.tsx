import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Dimensions, FlatList
} from 'react-native';
import { KOLS } from '../../constants/mockData';

const { width } = Dimensions.get('window');

const CATEGORY_TAGS = ['全部', '夜市', '日式', '早午餐', '甜點', '咖啡'];

export default function KOLScreen() {
  const [followed, setFollowed] = useState<number[]>([]);
  const [activeTag, setActiveTag] = useState('全部');

  const toggleFollow = (id: number) => {
    setFollowed(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>KOL 帶路</Text>
          <Text style={styles.headerSub}>專業美食達人的私人隱藏清單</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>🔥 {KOLS.length} 位達人</Text>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagRow}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {CATEGORY_TAGS.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, activeTag === tag && styles.tagActive]}
            onPress={() => setActiveTag(tag)}
          >
            <Text style={[styles.tagText, activeTag === tag && styles.tagTextActive]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* KOL Cards */}
      {KOLS.map((kol) => {
        const isFollowed = followed.includes(kol.id);
        return (
          <View key={kol.id} style={styles.kolCard}>
            {/* Cover Image */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: kol.img }} style={styles.mainImg} />
              <View style={styles.overlay}>
                {/* Top Row */}
                <View style={styles.overlayTop}>
                  {kol.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓ 認證達人</Text>
                    </View>
                  )}
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{kol.category}</Text>
                  </View>
                </View>

                {/* Bottom Info */}
                <View>
                  <Text style={styles.hotTag}>🔥 本週精選</Text>
                  <Text style={styles.pickText}>「{kol.pick}」</Text>
                  <View style={styles.statsRow}>
                    <Text style={styles.statItem}>👥 {kol.followers} 追蹤</Text>
                    <Text style={styles.statItem}>📍 {kol.postCount} 篇食記</Text>
                    <Text style={styles.statItem}>⭐ {kol.avgRate}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Card Footer */}
            <View style={styles.footer}>
              <View style={styles.avatarGroup}>
                <View style={[styles.avatarBorder, isFollowed && styles.avatarBorderFollowed]}>
                  <Image source={{ uri: kol.img }} style={styles.avatar} />
                </View>
                <View>
                  <Text style={styles.kolName}>{kol.name}</Text>
                  <Text style={styles.kolBio}>{kol.bio}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.followBtn, isFollowed && styles.followBtnActive]}
                onPress={() => toggleFollow(kol.id)}
              >
                <Text style={[styles.followText, isFollowed && styles.followTextActive]}>
                  {isFollowed ? '✓ 已追蹤' : '+ 追蹤'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Recommended Stores */}
            {kol.recommendedStores && kol.recommendedStores.length > 0 && (
              <View style={styles.storeSection}>
                <Text style={styles.storeSectionTitle}>達人推薦清單</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {kol.recommendedStores.map((store, idx) => (
                    <TouchableOpacity key={idx} style={styles.storeChip}>
                      <Text style={styles.storeChipEmoji}>🍽</Text>
                      <Text style={styles.storeChipText}>{store}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', paddingTop: 60 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 20
  },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#1A1A2E' },
  headerSub: { fontSize: 13, color: '#999', marginTop: 4 },
  headerBadge: {
    backgroundColor: '#FFF3E0', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20, marginTop: 6
  },
  headerBadgeText: { fontSize: 12, color: '#FF6B00', fontWeight: '700' },

  // Category Tags
  tagRow: { paddingLeft: 20, marginBottom: 24 },
  tag: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', marginRight: 10,
    borderWidth: 1.5, borderColor: '#E8E8E8'
  },
  tagActive: { backgroundColor: '#FF6B6B', borderColor: '#FF6B6B' },
  tagText: { fontSize: 13, fontWeight: '600', color: '#888' },
  tagTextActive: { color: '#fff' },

  // KOL Card
  kolCard: {
    marginHorizontal: 20, marginBottom: 32,
    backgroundColor: '#fff', borderRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 20, elevation: 8,
    overflow: 'hidden'
  },

  // Image
  imageContainer: { height: 260, overflow: 'hidden' },
  mainImg: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
    padding: 20, justifyContent: 'space-between'
  },
  overlayTop: { flexDirection: 'row', gap: 8 },
  verifiedBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)'
  },
  verifiedText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  categoryBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12
  },
  categoryText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  hotTag: {
    color: '#FFAD0E', fontWeight: '900',
    fontSize: 11, letterSpacing: 1.5, marginBottom: 6
  },
  pickText: {
    color: '#fff', fontSize: 20, fontWeight: '900',
    marginBottom: 10, lineHeight: 28
  },
  statsRow: { flexDirection: 'row', gap: 14 },
  statItem: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' },

  // Footer
  footer: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16
  },
  avatarGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBorder: {
    padding: 2, borderRadius: 28,
    borderWidth: 2.5, borderColor: '#E0E0E0'
  },
  avatarBorderFollowed: { borderColor: '#FF6B6B' },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  kolName: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },
  kolBio: { fontSize: 11, color: '#999', marginTop: 2 },
  followBtn: {
    paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20,
    borderWidth: 2, borderColor: '#FF6B6B', backgroundColor: '#fff'
  },
  followBtnActive: { backgroundColor: '#FF6B6B' },
  followText: { color: '#FF6B6B', fontWeight: '800', fontSize: 13 },
  followTextActive: { color: '#fff' },

  // Recommended Stores
  storeSection: { paddingHorizontal: 16, paddingBottom: 16 },
  storeSectionTitle: {
    fontSize: 12, fontWeight: '700', color: '#bbb',
    letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase'
  },
  storeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF5F5', borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
    borderWidth: 1, borderColor: '#FFE0E0'
  },
  storeChipEmoji: { fontSize: 14 },
  storeChipText: { fontSize: 13, color: '#FF6B6B', fontWeight: '700' },
});