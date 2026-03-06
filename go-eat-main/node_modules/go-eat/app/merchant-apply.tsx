import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { useRouter, useNavigation, Href } from 'expo-router';
import { ChevronLeft, Store, PhoneCall, Info, Image as ImageIcon, Link as LinkIcon, Gift } from 'lucide-react-native';

const CATEGORIES = ['🥤 飲品', '🍗 炸物', '🍨 甜點', '🍜 主食', '🍢 宵夜', '🍱 其他'];

export default function MerchantApply() {
  const router = useRouter();
  const navigation = useNavigation();
  
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    address: '', 
    category: '', 
    socialLink: '' 
  });
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const isFormDirty = Object.values(form).some(value => value !== '');

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!isFormDirty || isSubmitted) return;
      e.preventDefault();
      Alert.alert('離開申請？', '您輸入的資訊尚未送出，確定要退出嗎？', [
        { text: '繼續填寫', style: 'cancel', onPress: () => {} },
        { text: '退出', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
      ]);
    });
    return unsubscribe;
  }, [navigation, isFormDirty, isSubmitted]);

  const handleSubmit = async () => {
    // 1. 驗證必填欄位
    if (!form.name || !form.phone || !form.address || !form.category) {
      Alert.alert('提醒', '請填寫所有必填欄位 (包含選擇販售類別)');
      return;
    }

    try {
      // 2. 發送資料到後端 API (使用電腦區域網路 IP)
      // 將 localhost 修改為 172.20.10.4
      const response = await fetch('http://172.20.10.4:3000/api/stores/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        // 3. 伺服器回傳成功後，才顯示成功動畫
        setIsSubmitted(true);
        Animated.parallel([
          Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true })
        ]).start();
      } else {
        // 伺服器回傳錯誤訊息 (例如欄位缺失)
        Alert.alert('提交失敗', result.message || '請稍後再試');
      }
    } catch (error) {
      // 網路連線失敗 (例如 IP 填錯、後端沒開、或不在同一個 Wi-Fi)
      console.error('連線錯誤:', error);
      Alert.alert('連線失敗', '無法連線到伺服器，請確保後端已啟動並連至相同 Wi-Fi');
    }
  };

  const handleSimulateUpload = () => {
    setHasPhoto(!hasPhoto);
  };

  if (isSubmitted) {
    return (
      <View style={styles.successContainer}>
        <Animated.View style={[styles.successCard, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.logoCircle}><Store color="#3D3635" size={40} /></View>
          <Text style={styles.successTitle}>申請已送出！</Text>
          <View style={styles.contactNotice}>
            <PhoneCall size={20} color="#3D3635" />
            <Text style={styles.successSub}>專人將於近日與您電話聯絡</Text>
          </View>
          <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.replace('/profile' as Href)}>
            <Text style={styles.backHomeText}>回到會員中心</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color="#3D3635" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>商家入駐</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.introBox}>
          <Text style={styles.title}>加入 GO EAT</Text>
          <Text style={styles.subTitle}>開啟您的數位攤位，吸引更多饕客</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>店名 <Text style={{color: '#E74C3C'}}>*</Text></Text>
          <TextInput style={styles.input} placeholder="例如：金檸本舖" placeholderTextColor="#CCC" onChangeText={(t) => setForm({...form, name: t})} />
          
          <Text style={styles.label}>聯絡電話 <Text style={{color: '#E74C3C'}}>*</Text></Text>
          <TextInput style={styles.input} placeholder="請輸入手機號碼" keyboardType="phone-pad" placeholderTextColor="#CCC" onChangeText={(t) => setForm({...form, phone: t})} />
          
          <Text style={styles.label}>店面地址 <Text style={{color: '#E74C3C'}}>*</Text></Text>
          <TextInput style={[styles.input, { height: 80, paddingTop: 15 }]} placeholder="請輸入完整地址" multiline placeholderTextColor="#CCC" onChangeText={(t) => setForm({...form, address: t})} />
          
          <Text style={styles.label}>販售類別 <Text style={{color: '#E74C3C'}}>*</Text></Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
            {CATEGORIES.map((cat, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.tagBtn, form.category === cat && styles.tagBtnActive]}
                onPress={() => setForm({...form, category: cat})}
              >
                <Text style={[styles.tagText, form.category === cat && styles.tagTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.optionalHeader}>
            <Text style={styles.label}>品牌 IG/FB 連結</Text>
            <Text style={styles.optionalBadge}>選填．推薦</Text>
          </View>
          <View style={styles.inputIconWrapper}>
            <LinkIcon size={20} color="#CCC" style={styles.inputIcon} />
            <TextInput style={[styles.input, { paddingLeft: 45, marginBottom: 0 }]} placeholder="貼上網址讓饕客更快認識你" placeholderTextColor="#CCC" onChangeText={(t) => setForm({...form, socialLink: t})} />
          </View>

          <View style={[styles.optionalHeader, { marginTop: 20 }]}>
            <Text style={styles.label}>菜單或店面照片</Text>
            <Text style={styles.optionalBadge}>選填</Text>
          </View>
          <TouchableOpacity style={[styles.uploadBox, hasPhoto && styles.uploadBoxActive]} onPress={handleSimulateUpload}>
            <ImageIcon size={32} color={hasPhoto ? "#3D3635" : "#CCC"} />
            <Text style={[styles.uploadText, hasPhoto && styles.uploadTextActive]}>
              {hasPhoto ? "已選擇 1 張照片 (點擊重選)" : "點擊上傳照片"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 移到最下方的月費與免費試用提示框 */}
        <View style={styles.feeNoticeBox}>
          <View style={styles.feeHeaderRow}>
            <Gift size={18} color="#3D3635" />
            <Text style={styles.feeNoticeTitle}>專屬曝光與行銷建置</Text>
            <View style={styles.freeTrialBadge}>
              <Text style={styles.freeTrialText}>首 7 日免費</Text>
            </View>
          </View>
          <Text style={styles.feeNoticeDesc}>
            現在申請即享 7 天免費試用期。試用結束後將收取平台維護月費 $200，包含 GO EAT 專屬版面與在地推廣資源。
          </Text>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>提交審核</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>提交即代表您同意 GO EAT 商家服務條款</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25 },
  customHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#3D3635' },
  backBtn: { padding: 8 },
  introBox: { marginBottom: 25 },
  title: { fontSize: 32, fontWeight: '900', color: '#3D3635' },
  subTitle: { fontSize: 14, color: '#AAA', marginTop: 5 },
  
  formGroup: { gap: 5 },
  label: { fontSize: 15, fontWeight: '800', marginBottom: 10, color: '#3D3635', marginLeft: 4 },
  input: { backgroundColor: '#F8F9FB', padding: 18, borderRadius: 20, marginBottom: 20, fontSize: 16, borderWidth: 1, borderColor: '#EEE' },
  
  tagsContainer: { flexDirection: 'row', marginBottom: 20 },
  tagBtn: { backgroundColor: '#F8F9FB', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: '#EEE', marginRight: 10 },
  tagBtnActive: { backgroundColor: '#3D3635', borderColor: '#3D3635' },
  tagText: { color: '#888', fontWeight: '700', fontSize: 14 },
  tagTextActive: { color: '#FFF' },

  optionalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 5 },
  optionalBadge: { fontSize: 12, fontWeight: '800', color: '#666', backgroundColor: '#EEE', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 10 },
  inputIconWrapper: { position: 'relative', justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: 15, zIndex: 1 },
  
  uploadBox: { backgroundColor: '#F8F9FB', borderWidth: 2, borderColor: '#EEE', borderStyle: 'dashed', borderRadius: 20, padding: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  uploadBoxActive: { borderColor: '#3D3635', backgroundColor: '#F8F9FB', borderStyle: 'solid' },
  uploadText: { color: '#CCC', fontWeight: '700', marginTop: 10, fontSize: 14 },
  uploadTextActive: { color: '#3D3635' },

  // 全新質感：費用與免費試用提示框
  feeNoticeBox: { backgroundColor: '#F8F9FB', borderWidth: 1, borderColor: '#E5E5E5', padding: 18, borderRadius: 20, marginBottom: 15 },
  feeHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  feeNoticeTitle: { fontSize: 15, fontWeight: '900', color: '#3D3635', marginLeft: 8, flex: 1 },
  freeTrialBadge: { backgroundColor: '#3D3635', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  freeTrialText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  feeNoticeDesc: { fontSize: 13, color: '#666', lineHeight: 20, marginTop: 4 },

  submitBtn: { backgroundColor: '#3D3635', padding: 20, borderRadius: 25, alignItems: 'center', marginTop: 10, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
  submitText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  footerNote: { fontSize: 12, color: '#CCC', marginTop: 25, textAlign: 'center' },
  
  successContainer: { flex: 1, backgroundColor: '#3D3635', justifyContent: 'center', alignItems: 'center', padding: 30 },
  successCard: { backgroundColor: '#fff', width: '100%', borderRadius: 40, padding: 40, alignItems: 'center' },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  successTitle: { fontSize: 26, fontWeight: '900', color: '#3D3635', marginBottom: 15 },
  contactNotice: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 35 },
  successSub: { fontSize: 16, color: '#666', fontWeight: '600' },
  backHomeBtn: { backgroundColor: '#3D3635', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 20 },
  backHomeText: { color: '#fff', fontWeight: '900' }
});