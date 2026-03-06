import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Settings, Clock, Star, Store, ChevronRight, CheckCircle2, ShieldCheck, LogOut, UserX } from 'lucide-react-native';
import { useRouter, Href } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
// 💡 引入自製彈窗
import CustomAlert from '../../components/CustomAlert';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoggedIn, logout: authLogout } = useAuth();
  
  // 💡 彈窗狀態設定
  const [alertConfig, setAlertConfig] = useState({ 
    visible: false, title: '', message: '', confirmText: '確定', 
    showCancel: false, onConfirm: () => {} 
  });

  const showAlert = (title: string, message: string, confirmText = '確定', showCancel = false, onConfirm = () => {}) => {
    setAlertConfig({ visible: true, title, message, confirmText, showCancel, onConfirm });
  };
  const closeAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

  const handleLogout = () => {
    // 💡 使用支援雙按鈕的動畫彈窗
    showAlert('登出帳號', '確定要登出目前帳號嗎？', '確定登出', true, async () => {
      await authLogout();
      router.replace('/login' as Href);
    });
  };

  const handleDeleteAccount = () => {
    showAlert('註銷帳號', '確定要永久刪除帳號嗎？此動作將清除所有個人資料且無法撤銷。', '確定刪除', true, async () => {
      try {
        await authLogout();
        router.replace('/login' as Href);
      } catch (error) {
        showAlert('錯誤', '暫時無法處理您的請求，請稍後再試');
      }
    });
  };

  const menuItems = [
    { icon: <Star color="#FF6B6B" />, title: '我的口袋名單', sub: '收藏你的私藏美食', path: '/favorites' as Href },
    { icon: <Clock color="#3498db" />, title: '歷史足跡', sub: '回顧你吃過的每一口美味', path: '/history' as Href },
    { icon: <Store color="#FFFFFF" />, title: '我是商家，加入 GO EAT', sub: '讓在地饕客看見你的美味攤位', isHighlight: true, path: '/merchant-apply' as Href },
  ];

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>會員中心</Text>
          <TouchableOpacity style={styles.settingsBtn}><Settings size={20} color="#666" /></TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.profileCard} 
          onPress={() => !isLoggedIn && router.push('/login' as Href)}
          activeOpacity={isLoggedIn ? 1 : 0.7}
        >
          <View style={styles.userInfo}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' }} style={[styles.userAvatar, !isLoggedIn && { opacity: 0.5 }]} />
            <View>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{isLoggedIn ? user?.fullName : '請登入'}</Text>
                <CheckCircle2 size={18} color={isLoggedIn ? "#3498db" : "#DDD"} />
              </View>
              <View style={[styles.statusBadge, !isLoggedIn && { backgroundColor: '#F0F0F0' }]}>
                <Text style={[styles.statusText, !isLoggedIn && { color: '#AAA' }]}>{isLoggedIn ? '一般會員' : '尚未登入'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}><Text style={styles.statLabel}>已解鎖美食</Text><Text style={styles.statValue}>{isLoggedIn ? '42 處' : '--'}</Text></View>
            <View style={[styles.statItem, styles.statBorder]}><Text style={styles.statLabel}>收藏店家</Text><Text style={styles.statValue}>{isLoggedIn ? '15 家' : '--'}</Text></View>
          </View>
          <ShieldCheck size={100} color="#000" style={styles.bgIcon} strokeWidth={0.5} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>常用功能</Text>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={[styles.menuItem, item.isHighlight && styles.highlightItem]} onPress={() => item.path && router.push(item.path)}>
            <View style={styles.menuLeft}>
              <View style={[styles.iconBox, item.isHighlight && styles.highlightIconBox]}>{item.icon}</View>
              <View>
                <Text style={[styles.menuTitle, item.isHighlight && styles.highlightText]}>{item.title}</Text>
                <Text style={[styles.menuSub, item.isHighlight && styles.highlightSubText]}>{item.sub}</Text>
              </View>
            </View>
            <ChevronRight size={20} color={item.isHighlight ? "#FFFFFF" : "#DDD"} />
          </TouchableOpacity>
        ))}

        {isLoggedIn && (
          <View style={styles.accountActionSection}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <LogOut size={20} color="#3D3635" /><Text style={styles.logoutText}>登出帳號</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
              <UserX size={16} color="#AAA" /><Text style={styles.deleteText}>註銷並刪除所有資料</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 💡 放置動畫彈窗元件 */}
      <CustomAlert 
        visible={alertConfig.visible} title={alertConfig.title} message={alertConfig.message}
        confirmText={alertConfig.confirmText} showCancel={alertConfig.showCancel}
        onConfirm={alertConfig.onConfirm} onClose={closeAlert}
      />
    </>
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
  statusBadge: { backgroundColor: '#e1f5fe', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  statusText: { color: '#0288d1', fontSize: 10, fontWeight: '900' },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderColor: '#F0F0F0' },
  statLabel: { fontSize: 10, color: '#AAA', fontWeight: '900', marginBottom: 5 },
  statValue: { fontSize: 18, fontWeight: '900' },
  bgIcon: { position: 'absolute', right: -20, top: -10, opacity: 0.03 },
  sectionTitle: { fontSize: 20, fontWeight: '900', marginBottom: 15 },
  menuItem: { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 25, marginBottom: 12, elevation: 1 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { backgroundColor: '#F9F9F9', width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  menuTitle: { fontSize: 16, fontWeight: '900' },
  menuSub: { fontSize: 12, color: '#AAA', fontWeight: '500' },
  highlightItem: { backgroundColor: '#3D3635', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
  highlightIconBox: { backgroundColor: 'rgba(255,255,255,0.15)' },
  highlightText: { color: '#FFFFFF' },
  highlightSubText: { color: 'rgba(255,255,255,0.6)' },
  accountActionSection: { marginTop: 20, marginBottom: 50, alignItems: 'center', gap: 15 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#FFF', width: '100%', padding: 18, borderRadius: 25, borderWidth: 1, borderColor: '#EEE' },
  logoutText: { fontSize: 16, fontWeight: '900', color: '#3D3635' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, padding: 10 },
  deleteText: { fontSize: 12, color: '#AAA', fontWeight: 'bold', textDecorationLine: 'underline' }
});