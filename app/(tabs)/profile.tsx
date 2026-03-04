import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Settings, Award, Trophy, Clock, Star, Users, ChevronRight, CheckCircle2 } from 'lucide-react-native';

export default function ProfileScreen() {
  const menuItems = [
    { icon: <Trophy color="#FFD700" />, title: '成就獎勵系統', sub: '解鎖更多美食勳章' },
    { icon: <Clock color="#3498db" />, title: '歷史足跡', sub: '回顧你吃過的每一口美味' },
    { icon: <Star color="#FF6B6B" />, title: '我的口袋名單', sub: '收藏 15 家私藏攤位' },
    { icon: <Users color="#2ecc71" />, title: '成為 KOL', sub: '申請入駐美食帶路行列' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>會員中心</Text>
        <TouchableOpacity style={styles.settingsBtn}><Settings size={20} color="#666" /></TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.userInfo}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }} style={styles.userAvatar} />
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>美食家阿強</Text>
              <CheckCircle2 size={18} color="#3498db" />
            </View>
            <View style={styles.levelBadge}><Text style={styles.levelText}>LEVEL 12 饕客</Text></View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>食力值</Text>
            <Text style={styles.statValue}>2,480</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statLabel}>已解鎖</Text>
            <Text style={styles.statValue}>42 攤</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>勳章</Text>
            <Text style={styles.statValue}>12 枚</Text>
          </View>
        </View>
        <Award size={100} color="#000" style={styles.bgAward} strokeWidth={0.5} />
      </View>

      <Text style={styles.sectionTitle}>個人功能庫</Text>
      {menuItems.map((item, i) => (
        <TouchableOpacity key={i} style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <View style={styles.iconBox}>{item.icon}</View>
            <View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#DDD" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 32, fontWeight: '900' },
  settingsBtn: { backgroundColor: '#fff', padding: 12, borderRadius: 15, elevation: 2 },
  profileCard: { backgroundColor: '#fff', borderRadius: 40, padding: 25, elevation: 5, marginBottom: 30, overflow: 'hidden' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 25 },
  userAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EEE' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  userName: { fontSize: 22, fontWeight: '900' },
  levelBadge: { backgroundColor: '#FF6B6B', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  levelText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#F0F0F0' },
  statLabel: { fontSize: 10, color: '#AAA', fontWeight: '900', marginBottom: 5 },
  statValue: { fontSize: 18, fontWeight: '900' },
  bgAward: { position: 'absolute', right: -20, top: -10, opacity: 0.05 },
  sectionTitle: { fontSize: 20, fontWeight: '900', marginBottom: 15, fontStyle: 'italic' },
  menuItem: { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 25, marginBottom: 12, elevation: 1 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { backgroundColor: '#F9F9F9', width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  menuTitle: { fontSize: 16, fontWeight: '900' },
  menuSub: { fontSize: 12, color: '#AAA', fontWeight: '500' }
});