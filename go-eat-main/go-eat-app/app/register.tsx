import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Linking, ActivityIndicator, Image } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { UserPlus, User, Mail, Lock, ChevronLeft, CheckCircle, Apple, Smartphone } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';

export default function RegisterScreen() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', confirmText: '確定', onConfirm: () => {} });
  
  const showAlert = (title: string, message: string, confirmText = '確定', onConfirm = () => {}) => {
    setAlertConfig({ visible: true, title, message, confirmText, onConfirm });
  };
  const closeAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

  // 💡 修正：使用自製彈窗顯示開發中提示
  const handleSocialRegister = (platform: string) => {
    showAlert('敬請期待', `${platform} 註冊功能正在開發中，請先使用 Email 註冊。`);
  };

  const validateForm = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!form.fullName.trim()) return '請輸入您的姓名';
    if (!emailRegex.test(form.email)) return '請輸入有效的 Email 格式';
    if (form.password.length < 6) return '密碼長度至少需 6 位元';
    return null;
  };

  const handleRegister = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      showAlert('提醒', errorMsg);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://172.20.10.4:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        showAlert('註冊成功', '歡迎加入 GO EAT！現在請登入您的帳號', '立即登入', () => {
          router.push('/login' as Href);
        });
      } else {
        showAlert('註冊失敗', data.message || '該 Email 可能已被使用');
      }
    } catch (error) {
      showAlert('連線失敗', '無法連接到伺服器，請檢查網路或後端狀態');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.push('/profile' as Href)} style={styles.backBtn}>
          <ChevronLeft color="#3D3635" size={28} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoBox}><UserPlus color="#fff" size={32} /></View>
          <Text style={styles.title}>建立帳號</Text>
          <Text style={styles.subTitle}>一分鐘加入，開始發掘在地美味</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <User size={20} color="#CCC" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="全名 / 暱稱" placeholderTextColor="#AAA" onChangeText={(t) => setForm({...form, fullName: t})} />
          </View>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#CCC" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#AAA" autoCapitalize="none" keyboardType="email-address" onChangeText={(t) => setForm({...form, email: t})} />
          </View>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#CCC" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="設定密碼 (至少 6 位)" placeholderTextColor="#AAA" secureTextEntry onChangeText={(t) => setForm({...form, password: t})} />
          </View>

          <TouchableOpacity style={[styles.regBtn, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <CheckCircle color="#fff" size={20} /><Text style={styles.regText}>同意條款並註冊</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.line} /><Text style={styles.dividerText}>或使用以下方式快速註冊</Text><View style={styles.line} />
        </View>

        <View style={styles.socialGroup}>
          <TouchableOpacity style={[styles.socialBtn, styles.appleBtn]} onPress={() => handleSocialRegister('Apple')}>
            <Apple size={20} color="#fff" fill="#fff" /><Text style={styles.appleText}>Sign up with Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, styles.googleBtn]} onPress={() => handleSocialRegister('Google')}>
            <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' }} style={styles.googleIcon} />
            <Text style={styles.googleText}>使用 Google 帳號註冊</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, styles.phoneBtn]} onPress={() => handleSocialRegister('手機')}>
            <Smartphone size={20} color="#3D3635" /><Text style={styles.phoneText}>使用手機號碼註冊</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.legalText}>
          註冊即代表您同意 GO EAT 的 <Text style={styles.link} onPress={() => Linking.openURL('https://your-privacy-policy.com')}> 使用者條款 </Text> 與 <Text style={styles.link} onPress={() => Linking.openURL('https://your-privacy-policy.com')}> 隱私權政策 </Text>
        </Text>
      </ScrollView>

      <CustomAlert 
        visible={alertConfig.visible} title={alertConfig.title} message={alertConfig.message}
        confirmText={alertConfig.confirmText} onConfirm={alertConfig.onConfirm} onClose={closeAlert}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  inner: { padding: 30, paddingTop: 60, paddingBottom: 60 },
  backBtn: { marginBottom: 20, width: 40 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoBox: { backgroundColor: '#FF6B6B', padding: 20, borderRadius: 25, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', color: '#3D3635' },
  subTitle: { fontSize: 14, color: '#AAA', marginTop: 10, fontWeight: '600', textAlign: 'center' },
  form: { gap: 18 },
  inputWrapper: { position: 'relative', justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: 18, zIndex: 1 },
  input: { backgroundColor: '#F8F9FB', padding: 20, paddingLeft: 50, borderRadius: 22, fontSize: 16, borderWidth: 1, borderColor: '#EEE', color: '#333' },
  regBtn: { backgroundColor: '#3D3635', padding: 20, borderRadius: 25, alignItems: 'center', marginTop: 10, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  regText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 35 },
  line: { flex: 1, height: 1, backgroundColor: '#EEE' },
  dividerText: { marginHorizontal: 15, color: '#CCC', fontSize: 12, fontWeight: 'bold' },
  socialGroup: { gap: 12, marginBottom: 20 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 22, gap: 12, borderWidth: 1, borderColor: '#EEE' },
  appleBtn: { backgroundColor: '#000', borderColor: '#000' },
  appleText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  googleBtn: { backgroundColor: '#FFF' },
  googleIcon: { width: 18, height: 18 },
  googleText: { color: '#3D3635', fontWeight: 'bold', fontSize: 15 },
  phoneBtn: { backgroundColor: '#F8F9FB' },
  phoneText: { color: '#3D3635', fontWeight: 'bold', fontSize: 15 },
  legalText: { fontSize: 12, color: '#AAA', textAlign: 'center', marginTop: 25, lineHeight: 20 },
  link: { color: '#FF6B6B', fontWeight: 'bold', textDecorationLine: 'underline' }
});