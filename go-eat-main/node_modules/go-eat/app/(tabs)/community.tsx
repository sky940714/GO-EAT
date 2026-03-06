import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Modal, Alert } from 'react-native';
import { Sparkles, Map, Send, Gift, Flame, Camera, MapPin, Users, Flag, X } from 'lucide-react-native';
import CommunityMap from '../../components/CommunityMap';

const { width } = Dimensions.get('window');

// 初始任務資料
const INITIAL_MISSIONS = [
  { id: 1, store: "阿公手工糯米腸", reward: "解鎖：週末限定『隱藏版蒜味加量』", currentSprites: 850, targetSprites: 1000, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" },
  { id: 2, store: "金檸特調飲品", reward: "解鎖：全品項免費加料一次", currentSprites: 320, targetSprites: 500, img: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=400" },
];

export default function CommunityScreen() {
  // ================= 狀態管理 (讓數字活起來) =================
  const [mapViewMode, setMapViewMode] = useState<'personal' | 'public'>('personal');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [myEnergy, setMyEnergy] = useState(0); // 初始能量為 0
  const [occupiedCount, setOccupiedCount] = useState(5); // 初始已佔領 5 處
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  // 任務數據
  const [missions, setMissions] = useState(INITIAL_MISSIONS);

  // ================= 互動邏輯 =================

  // 1. 按下快門：獲得能量與佔領數
  const handleShutterPress = () => {
    setIsCameraOpen(false); 
    setTimeout(() => {
      setMyEnergy(prev => prev + 50); // 獲得 50 點能量
      setOccupiedCount(prev => prev + 1); // 佔領數 +1
      setIsSuccessModalOpen(true); // 顯示成功動畫
    }, 400);
  };

  // 2. 灌注能量給店家
  const handleInjectEnergy = (missionId: number, storeName: string) => {
    if (myEnergy < 10) {
      Alert.alert("能量不足！", "你現在的能量不夠喔，趕快去附近的攤位拍照插旗賺取能量吧！", [{ text: "去打卡" }]);
      return;
    }

    // 扣除玩家 10 點能量
    setMyEnergy(prev => prev - 10);
    
    // 增加店家進度
    setMissions(prevMissions => 
      prevMissions.map(mission => 
        mission.id === missionId 
          ? { ...mission, currentSprites: Math.min(mission.currentSprites + 10, mission.targetSprites) }
          : mission
      )
    );
    
    // 簡單的震動回饋 (這裡用 Alert 代替，未來可換成 Haptics)
    Alert.alert("灌注成功！", `你成功幫 ${storeName} 增加了 10 點人氣！\n(剩餘能量: ${myEnergy - 10})`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* ================= 1. 頂部狀態 ================= */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>美食社群</Text>
          
          <TouchableOpacity style={styles.checkInBtn} activeOpacity={0.8} onPress={() => setIsCameraOpen(true)}>
            <View style={styles.checkInIconWrapper}>
              <Camera size={24} color="#FF6B6B" />
            </View>
            <View style={styles.checkInTextWrapper}>
              <Text style={styles.checkInTitle}>📍 實地拍照插旗</Text>
              <Text style={styles.checkInSub}>打卡賺取能量，擴張你的領地！</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            {/* 顯示真實的個人能量 */}
            <View style={styles.statBox}>
              <Sparkles size={20} color="#FFAD0E" />
              <View style={styles.statTextGroup}>
                <Text style={styles.statLabel}>我的能量</Text>
                <Text style={[styles.statValue, { color: '#FFAD0E' }]}>{myEnergy} 點</Text>
              </View>
            </View>
            {/* 顯示真實的佔領數 */}
            <View style={styles.statBox}>
              <MapPin size={20} color="#FF6B6B" />
              <View style={styles.statTextGroup}>
                <Text style={styles.statLabel}>已佔領地標</Text>
                <Text style={styles.statValue}>{occupiedCount} 處</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ================= 2. 城市光暈 (真實地圖卡片) ================= */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🗺️ 城市光暈</Text>
            <View style={styles.toggleGroup}>
              <TouchableOpacity style={[styles.toggleBtn, mapViewMode === 'personal' && styles.toggleBtnActive]} onPress={() => setMapViewMode('personal')}>
                <Text style={[styles.toggleText, mapViewMode === 'personal' && styles.toggleTextActive]}>我的足跡</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, mapViewMode === 'public' && styles.toggleBtnActive]} onPress={() => setMapViewMode('public')}>
                <Text style={[styles.toggleText, mapViewMode === 'public' && styles.toggleTextActive]}>全城熱度</Text>
              </TouchableOpacity>
            </View>
          </View>

            {/* 將 onPress 替換成打開全螢幕狀態 */}
            <TouchableOpacity style={styles.footprintCard} activeOpacity={0.9} onPress={() => setIsMapFullScreen(true)}>
            {/* Live Map 預覽 */}
            <CommunityMap mapViewMode={mapViewMode} />

            {/* 懸浮資訊列 */}
            <View style={styles.footprintBottomBar}>
              {mapViewMode === 'personal' ? (
                <View style={styles.barContent}>
                  <Text style={styles.barTitle}>信義區探索者</Text>
                  <Text style={styles.barSub}>已插下 {occupiedCount} 面專屬旗幟</Text>
                </View>
              ) : (
                <View style={styles.barContent}>
                  <Text style={styles.barTitle}>🔥 熱門美食堡壘</Text>
                  <Text style={styles.barSub}>3 處地點正在發光</Text>
                </View>
              )}
              <View style={styles.enterMapBtn}>
                <Text style={styles.enterMapBtnText}>進入地圖</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* ================= 3. 全民集氣 ================= */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎁 全民集氣任務</Text>
          </View>
          
          {missions.map(mission => {
            const progressPercentage = (mission.currentSprites / mission.targetSprites) * 100;
            return (
              <View key={mission.id} style={styles.coopCard}>
                <View style={styles.coopInfoRow}>
                  <Image source={{ uri: mission.img }} style={styles.coopImg} />
                  <View style={styles.coopTextContent}>
                    <Text style={styles.coopStoreName}>{mission.store}</Text>
                    <Text style={styles.coopReward} numberOfLines={2}>{mission.reward}</Text>
                  </View>
                </View>

                <View style={styles.trackContainer}>
                  <View style={styles.trackBackground}>
                    <View style={[styles.trackFill, { width: `${progressPercentage}%` }]} />
                  </View>
                  <View style={[styles.treasureIcon, { left: `${progressPercentage - 5}%` }]}>
                    <Gift size={20} color="#FF6B6B" fill="#FFF0F0" />
                  </View>
                </View>

                <View style={styles.coopActionRow}>
                  <Text style={styles.progressText}>
                    已集結 <Text style={{ color: '#FF6B6B', fontWeight: '900' }}>{mission.currentSprites}</Text> / {mission.targetSprites} 點
                  </Text>
                  
                  {/* 動態灌注按鈕 */}
                  <TouchableOpacity 
                    style={[styles.sendBtn, myEnergy < 10 && { backgroundColor: '#ccc' }]} 
                    onPress={() => handleInjectEnergy(mission.id, mission.store)}
                  >
                    <Send size={16} color="#fff" />
                    <Text style={styles.sendBtnText}>灌注能量</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ================= 相機打卡 Modal ================= */}
      <Modal visible={isCameraOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setIsCameraOpen(false)}>
        <View style={styles.cameraContainer}>
          <View style={styles.cameraPreview}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity onPress={() => setIsCameraOpen(false)} style={styles.closeBtn}><Text style={styles.closeBtnText}>取消</Text></TouchableOpacity>
              <View style={styles.gpsBadge}><MapPin size={14} color="#4ADE80" /><Text style={styles.gpsText}>GPS 定位已確認</Text></View>
              <View style={{ width: 40 }} />
            </View>
            <View style={styles.crosshair}>
              <View style={[styles.crosshairLine, { width: 40, height: 2 }]} /><View style={[styles.crosshairLine, { width: 2, height: 40 }]} />
            </View>
            <View style={styles.cameraFooter}>
              <Text style={styles.cameraHint}>請將鏡頭對準您購買的美食</Text>
              <TouchableOpacity style={styles.shutterBtnOuter} onPress={handleShutterPress}><View style={styles.shutterBtnInner} /></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= 插旗成功結算彈窗 ================= */}
      <Modal visible={isSuccessModalOpen} transparent={true} animationType="fade" onRequestClose={() => setIsSuccessModalOpen(false)}>
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconBg}><Flag size={40} color="#fff" fill="#fff" /></View>
            <Text style={styles.successTitle}>佔領成功！</Text>
            <Text style={styles.successSub}>你已在這家店插下專屬旗幟，你的美食領地又擴大了。</Text>
            <View style={styles.rewardBox}>
              <Sparkles size={20} color="#FFAD0E" fill="#FFAD0E" />
              <Text style={styles.rewardText}>獲得 50 點集氣能量</Text>
            </View>
            <TouchableOpacity style={styles.successBtn} onPress={() => setIsSuccessModalOpen(false)}>
              <Text style={styles.successBtnText}>去幫店家集氣</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= ★ 新增：全螢幕互動地圖 Modal ================= */}
      <Modal visible={isMapFullScreen} animationType="slide" onRequestClose={() => setIsMapFullScreen(false)}>
        <View style={styles.fullScreenMapContainer}>
          
          {/* 核心：呼叫我們剛剛升級的隔離元件，並設定 interactive={true} */}
          <CommunityMap mapViewMode={mapViewMode} interactive={true} />

          {/* 懸浮在全螢幕地圖上方的 UI 控制列 */}
          <View style={styles.fullScreenHeader}>
            {/* 關閉按鈕 */}
            <TouchableOpacity onPress={() => setIsMapFullScreen(false)} style={styles.fullScreenCloseBtn}>
              <X size={24} color="#333" />
            </TouchableOpacity>

            {/* 把視角切換器也放到全螢幕裡，讓使用者可以在大地圖上即時切換！ */}
            <View style={styles.toggleGroup}>
              <TouchableOpacity style={[styles.toggleBtn, mapViewMode === 'personal' && styles.toggleBtnActive]} onPress={() => setMapViewMode('personal')}>
                <Text style={[styles.toggleText, mapViewMode === 'personal' && styles.toggleTextActive]}>我的足跡</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, mapViewMode === 'public' && styles.toggleBtnActive]} onPress={() => setMapViewMode('public')}>
                <Text style={[styles.toggleText, mapViewMode === 'public' && styles.toggleTextActive]}>全城熱度</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* 底部提示 */}
          <View style={styles.fullScreenFooter}>
            <Text style={styles.fullScreenFooterText}>
              {mapViewMode === 'personal' ? '點擊紅旗查看你在該店家的佔領紀錄' : '點擊熱點查看大家正在集氣的隱藏活動'}
            </Text>
          </View>
          
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 25, backgroundColor: '#fff', borderBottomLeftRadius: 35, borderBottomRightRadius: 35, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 15 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#333', marginBottom: 15 },
  checkInBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F0', padding: 18, borderRadius: 25, marginBottom: 20, borderWidth: 2, borderColor: '#FFE0E0' },
  checkInIconWrapper: { backgroundColor: '#fff', padding: 12, borderRadius: 20, elevation: 3, shadowColor: '#FF6B6B', shadowOpacity: 0.2, shadowRadius: 5 },
  checkInTextWrapper: { marginLeft: 15, flex: 1 },
  checkInTitle: { fontSize: 18, fontWeight: '900', color: '#FF6B6B', marginBottom: 4 },
  checkInSub: { fontSize: 12, color: '#888', fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 15 },
  statBox: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FB', padding: 15, borderRadius: 20, gap: 12 },
  statTextGroup: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#888', fontWeight: 'bold' },
  statValue: { fontSize: 16, fontWeight: '900', color: '#333', marginTop: 2 },
  section: { marginTop: 30, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#333' },
  toggleGroup: { flexDirection: 'row', backgroundColor: '#EEE', padding: 4, borderRadius: 20 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  toggleBtnActive: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3 },
  toggleText: { fontSize: 12, fontWeight: 'bold', color: '#888' },
  toggleTextActive: { color: '#FF6B6B', fontWeight: '900' },
  
  // 地圖卡片與標記樣式
  footprintCard: { height: 220, borderRadius: 30, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, backgroundColor: '#eee' },
  personalMarker: { backgroundColor: '#FF6B6B', padding: 6, borderRadius: 12, borderWidth: 2, borderColor: '#fff', elevation: 4, shadowColor: '#FF6B6B', shadowOpacity: 0.4, shadowRadius: 4 },
  publicMarker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFAD0E', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 2, borderColor: '#fff', elevation: 6, shadowColor: '#FFAD0E', shadowOpacity: 0.5, shadowRadius: 6, gap: 4 },
  publicMarkerText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  footprintBottomBar: { position: 'absolute', bottom: 10, left: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  barContent: { flex: 1 },
  barTitle: { fontSize: 15, fontWeight: '900', color: '#333', marginBottom: 2 },
  barSub: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  enterMapBtn: { backgroundColor: '#FF6B6B', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 15 },
  enterMapBtnText: { color: '#fff', fontSize: 12, fontWeight: '900' },

  coopCard: { backgroundColor: '#fff', borderRadius: 30, padding: 20, marginBottom: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  coopInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 20 },
  coopImg: { width: 60, height: 60, borderRadius: 20 },
  coopTextContent: { flex: 1 },
  coopStoreName: { fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 4 },
  coopReward: { fontSize: 13, color: '#FF6B6B', fontWeight: 'bold', lineHeight: 18 },
  trackContainer: { height: 30, justifyContent: 'center', marginBottom: 15 },
  trackBackground: { height: 10, backgroundColor: '#F0F0F0', borderRadius: 5, overflow: 'hidden' },
  trackFill: { height: '100%', backgroundColor: '#FF6B6B', borderRadius: 5 },
  treasureIcon: { position: 'absolute', top: 0, backgroundColor: '#fff', borderRadius: 15, padding: 4, elevation: 4, shadowColor: '#FF6B6B', shadowOpacity: 0.3, shadowRadius: 5 },
  coopActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  progressText: { fontSize: 12, color: '#888', fontWeight: 'bold' },
  sendBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B6B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 6 },
  sendBtnText: { color: '#fff', fontSize: 13, fontWeight: '900' },

  // 相機介面樣式
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  cameraPreview: { flex: 1, justifyContent: 'space-between', paddingVertical: 40 },
  cameraHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  closeBtn: { padding: 10 },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  gpsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(74, 222, 128, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  gpsText: { color: '#4ADE80', fontSize: 12, fontWeight: 'bold' },
  crosshair: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -20 }, { translateY: -20 }], justifyContent: 'center', alignItems: 'center' },
  crosshairLine: { backgroundColor: 'rgba(255,255,255,0.3)', position: 'absolute' },
  cameraFooter: { alignItems: 'center', paddingBottom: 40 },
  cameraHint: { color: '#fff', fontSize: 14, marginBottom: 30, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  shutterBtnOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  shutterBtnInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FF6B6B' },

  // 成功彈窗樣式
  successOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  successCard: { width: '85%', backgroundColor: '#fff', borderRadius: 35, padding: 30, alignItems: 'center', elevation: 15, shadowColor: '#FF6B6B', shadowOpacity: 0.3, shadowRadius: 20 },
  successIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 4, borderColor: '#FFE0E0' },
  successTitle: { fontSize: 26, fontWeight: '900', color: '#333', marginBottom: 10 },
  successSub: { fontSize: 14, color: '#666', marginBottom: 25, textAlign: 'center', lineHeight: 22 },
  rewardBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9E5', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, gap: 8, marginBottom: 25 },
  rewardText: { color: '#FFAD0E', fontSize: 16, fontWeight: '900' },
  successBtn: { backgroundColor: '#FF6B6B', width: '100%', paddingVertical: 16, borderRadius: 20, alignItems: 'center', elevation: 5, shadowColor: '#FF6B6B', shadowOpacity: 0.4, shadowRadius: 8 },
  successBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  // 全螢幕地圖樣式
  fullScreenMapContainer: { flex: 1, backgroundColor: '#fff' },
  fullScreenHeader: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fullScreenCloseBtn: { backgroundColor: '#fff', padding: 10, borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  fullScreenFooter: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.7)', padding: 15, borderRadius: 20, alignItems: 'center' },
  fullScreenFooterText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});