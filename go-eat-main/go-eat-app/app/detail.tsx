import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { ChevronLeft, Star, Navigation, Share2, Clock, MapPin, Heart, ThumbsUp, CreditCard, Cuboid, Bike, PlayCircle, Video } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
// 匯入原本的假資料
import { STORES } from '../constants/mockData';
// 💡 匯入自製彈窗
import CustomAlert from '../components/CustomAlert';

const { width } = Dimensions.get('window');

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // 💡 彈窗狀態設定
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', confirmText: '確定' });
  const showAlert = (title: string, message: string) => {
    setAlertConfig({ visible: true, title, message, confirmText: '確定' });
  };
  const closeAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));
  
  // 💡 我們的完美金檸本舖預設資料 (擴充了招牌照片與 KOL 狀態)
  const fallbackStore = {
    name: '金檸本舖',
    rate: '4.9',
    cat: '在地飲品',
    img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800', 
    tags: ['#手搖飲', '#新鮮檸檬', '#消暑必備'],
    priceLevel: '均消 $50',
    distance: '300m',
    desc: '堅持嚴選新鮮檸檬與獨家熬煮糖水，酸甜完美平衡的極致口感。',
    address: '在地商圈第 3 排第 5 攤',
    openStatus: '營業中 (至 23:00)',
    payments: ['現金', 'LINE Pay', '街口支付'],
    // 💡 1. 招牌必點加入圖片
    signatureItems: [
      { rank: '🥇', name: '招牌金檸茶', price: '$50', desc: '手洗新鮮檸檬搭配完美比例糖水', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400' },
      { rank: '🥈', name: '經典特調冰茶', price: '$60', desc: '消暑解渴的絕佳選擇', img: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=400' },
      { rank: '🥉', name: '金檸氣泡飲', price: '$65', desc: '綿密氣泡帶來爽快口感', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400' }
    ],
    // 💡 2. KOL 影片資料 (你可以試著把它改成 null 來看看「尚未有KOL」的畫面)
    kolVideo: null 
    /* 測試有影片的狀態可替換為：
    kolVideo: { title: '夏天必喝！這間隱藏版手搖飲太神啦🍹', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800' }
    */
  };

  const foundStore = STORES.find((s: any) => s.id?.toString() === id);
  const store: any = foundStore || fallbackStore;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* 🌟 首圖區 */}
        <View style={styles.imageHeader}>
          <Image source={{ uri: store.img || fallbackStore.img }} style={styles.mainImg} />
          
          <View style={styles.topNav}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} activeOpacity={0.7}>
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.iconBtn} activeOpacity={0.7}>
              <Heart size={24} color={isFavorite ? "#FF6B6B" : "#fff"} fill={isFavorite ? "#FF6B6B" : "transparent"} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.threeDBtn} onPress={() => showAlert('開發中', '3D 食物模型掃描功能正在開發中！')}>
            <Cuboid size={16} color="#fff" />
            <Text style={styles.threeDText}>3D 實體預覽</Text>
          </TouchableOpacity>

          <View style={styles.roundedCorner} />
        </View>

        <View style={styles.content}>
          
          {/* ⚡ 核心決策區 */}
          <View style={styles.titleSection}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.descText}>{store.desc || fallbackStore.desc}</Text>
            
            <View style={styles.tagsRow}>
              {(store.tags || fallbackStore.tags).map((tag: string, index: number) => (
                <View key={index} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.rateBadge}>
                <Star size={16} color="#FFAD0E" fill="#FFAD0E" />
                <Text style={styles.rateText}>{store.rate}</Text>
              </View>
              <Text style={styles.indicatorText}>💰 {store.priceLevel || fallbackStore.priceLevel}</Text>
              <Text style={styles.indicatorText}>📍 {store.distance || fallbackStore.distance}</Text>
            </View>
          </View>

          {/* 💡 修正：導航與外送按鈕 */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.mainAction} activeOpacity={0.8}>
              <Navigation size={22} color="#fff" />
              <Text style={styles.actionText}>開始導航</Text>
            </TouchableOpacity>
            
            {/* 新增的外送按鈕 */}
            <TouchableOpacity 
              style={styles.subAction} 
              activeOpacity={0.7}
              onPress={() => showAlert('外送服務', '目前外送功能正在加緊串接中，敬請期待！')}
            >
              <Bike size={22} color="#666" />
              <Text style={styles.subActionText}>外送</Text>
            </TouchableOpacity>
          </View>

          {/* 🏆 招牌必點區 (💡 加入照片排版) */}
          <View style={styles.sectionHeader}>
            <ThumbsUp size={20} color="#3D3635" />
            <Text style={styles.sectionTitle}>招牌必點</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.signatureScroll}>
            {(store.signatureItems || fallbackStore.signatureItems).map((item: any, index: number) => (
              <View key={index} style={styles.signatureCard}>
                <Image source={{ uri: item.img }} style={styles.sigImg} />
                <View style={styles.sigContent}>
                  <Text style={styles.sigRank}>{item.rank}</Text>
                  <Text style={styles.sigName}>{item.name}</Text>
                  <Text style={styles.sigPrice}>{item.price}</Text>
                  <Text style={styles.sigDesc} numberOfLines={2}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* 🕰️ 實用營業資訊區 */}
          <Text style={[styles.sectionTitle, { marginTop: 25, marginBottom: 15 }]}>實用資訊</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}><Clock size={18} color="#3498db" /></View>
              <View>
                <Text style={styles.infoLabel}>營業狀態</Text>
                <Text style={styles.infoValue}>🟢 {store.openStatus || fallbackStore.openStatus}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}><MapPin size={18} color="#e74c3c" /></View>
              <View>
                <Text style={styles.infoLabel}>攤位位置</Text>
                <Text style={styles.infoValue}>{store.address || fallbackStore.address}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}><CreditCard size={18} color="#2ecc71" /></View>
              <View>
                <Text style={styles.infoLabel}>支付方式</Text>
                <View style={styles.paymentRow}>
                  {(store.payments || fallbackStore.payments).map((pay: string, i: number) => (
                    <Text key={i} style={styles.paymentPill}>{pay}</Text>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* 🎬 網紅推薦評價區 (💡 條件渲染) */}
          <Text style={[styles.sectionTitle, { marginTop: 35, marginBottom: 15 }]}>KOL 推薦評價</Text>
          
          {store.kolVideo ? (
            // 有 KOL 影片時顯示
            <TouchableOpacity 
              style={styles.kolCard} 
              activeOpacity={0.9} 
              onPress={() => showAlert('播放影片', '影音播放器串接中...')}
            >
              <Image source={{ uri: store.kolVideo.thumbnail }} style={styles.kolThumbnail} />
              <View style={styles.playOverlay}>
                <PlayCircle size={50} color="#fff" />
              </View>
              <View style={styles.kolInfoBox}>
                <Text style={styles.kolTitle} numberOfLines={2}>{store.kolVideo.title}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            // 沒有 KOL 影片時顯示
            <View style={styles.emptyKolCard}>
              <Video size={40} color="#DDD" style={{ marginBottom: 10 }} />
              <Text style={styles.emptyKolText}>尚未有 KOL 到店拍攝</Text>
              <Text style={styles.emptyKolSubText}>這間隱藏美食等你來發掘！</Text>
            </View>
          )}
          
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      {/* 💡 動畫彈窗 */}
      <CustomAlert 
        visible={alertConfig.visible} title={alertConfig.title} message={alertConfig.message}
        confirmText={alertConfig.confirmText} onClose={closeAlert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageHeader: { height: 350, width: width, position: 'relative' },
  mainImg: { width: '100%', height: '100%' },
  topNav: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  iconBtn: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 20 },
  threeDBtn: { position: 'absolute', bottom: 60, right: 20, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, gap: 5 },
  threeDText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  roundedCorner: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 30, backgroundColor: '#fff', borderTopLeftRadius: 35, borderTopRightRadius: 35 },
  
  content: { paddingHorizontal: 25 },
  titleSection: { marginBottom: 20 },
  storeName: { fontSize: 32, fontWeight: '900', color: '#3D3635', marginBottom: 8 },
  descText: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 15 },
  
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  tagPill: { backgroundColor: '#F0F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagText: { color: '#666', fontSize: 12, fontWeight: 'bold' },
  
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  rateBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9E5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  rateText: { color: '#FFAD0E', fontWeight: '900', marginLeft: 4, fontSize: 16 },
  indicatorText: { color: '#888', fontWeight: 'bold', fontSize: 14 },
  
  actionRow: { flexDirection: 'row', gap: 15, marginBottom: 35 },
  mainAction: { flex: 2, backgroundColor: '#FF6B6B', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 20, gap: 10, elevation: 3, shadowColor: '#FF6B6B', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  actionText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  subAction: { flex: 1, backgroundColor: '#F5F5F5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 20, gap: 8 },
  subActionText: { color: '#666', fontSize: 16, fontWeight: '900' },
  
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#3D3635' },
  
  signatureScroll: { gap: 15, paddingRight: 25 },
  signatureCard: { backgroundColor: '#F8F9FB', borderRadius: 20, width: 200, borderWidth: 1, borderColor: '#EEE', overflow: 'hidden' },
  sigImg: { width: '100%', height: 130, backgroundColor: '#EEE' },
  sigContent: { padding: 15 },
  sigRank: { fontSize: 20, position: 'absolute', top: -15, right: 10, zIndex: 10 },
  sigName: { fontSize: 16, fontWeight: '900', color: '#3D3635', marginBottom: 5 },
  sigPrice: { fontSize: 18, fontWeight: '900', color: '#FF6B6B', marginBottom: 8 },
  sigDesc: { fontSize: 12, color: '#888', lineHeight: 18 },
  
  infoCard: { backgroundColor: '#F8F9FB', borderRadius: 25, padding: 20, borderWidth: 1, borderColor: '#EEE' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  infoIconBox: { backgroundColor: '#fff', width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 1 },
  infoLabel: { fontSize: 12, color: '#AAA', fontWeight: 'bold', marginBottom: 2 },
  infoValue: { fontSize: 14, color: '#3D3635', fontWeight: '900' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 15, marginLeft: 55 },
  
  paymentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  paymentPill: { fontSize: 10, color: '#666', backgroundColor: '#E0E0E0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontWeight: 'bold' },

  kolCard: { borderRadius: 20, overflow: 'hidden', backgroundColor: '#000', elevation: 3 },
  kolThumbnail: { width: '100%', height: 200, opacity: 0.8 },
  playOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  kolInfoBox: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, paddingTop: 30, backgroundColor: 'rgba(0,0,0,0.4)' },
  kolTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', lineHeight: 22 },
  emptyKolCard: { backgroundColor: '#F8F9FB', borderRadius: 20, padding: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#DDD', borderStyle: 'dashed' },
  emptyKolText: { fontSize: 16, color: '#888', fontWeight: 'bold', marginBottom: 5 },
  emptyKolSubText: { fontSize: 12, color: '#AAA' }
});