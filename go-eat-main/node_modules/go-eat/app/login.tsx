import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { LogIn, Mail, Lock, ArrowRight, Smartphone, Apple, ChevronLeft } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import CustomAlert from '../components/CustomAlert';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', confirmText: '確定', onConfirm: () => {} });
  
  const router = useRouter();
  const { login } = useAuth();

  const showAlert = (title: string, message: string, confirmText = '確定', onConfirm = () => {}) => {
    setAlertConfig({ visible: true, title, message, confirmText, onConfirm });
  };

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('提醒', '請輸入帳號與密碼');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://172.20.10.4:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.token, data.user); 
        showAlert('登入成功', `歡迎回來，${data.user.fullName}`, '開始美食之旅', () => {
           router.replace('/profile' as Href);
        });
      } else {
        showAlert('登入失敗', data.message || '帳號或密碼錯誤');
      }
    } catch (error) {
      showAlert('連線失敗', '請確認伺服器是否啟動');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 💡 修正：使用自製彈窗顯示開發中提示
  const handleSocialLogin = (platform: string) => {
    showAlert('敬請期待', `${platform} 登入功能正在開發中，請先使用 Email 登入。`);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.inner}>
        
        <TouchableOpacity onPress={() => router.push('/profile' as Href)} style={styles.backButton}>
          <ChevronLeft size={28} color="#3D3635" />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoBox}><LogIn color="#fff" size={32} /></View>
          <Text style={styles.title}>歡迎回來</Text>
          <Text style={styles.subTitle}>登入以開啟更多美食驚喜</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#CCC" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} placeholder="Email" placeholderTextColor="#AAA"
              value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={20} color="#CCC" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} placeholder="密碼" placeholderTextColor="#AAA"
              secureTextEntry value={password} onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={[styles.loginBtn, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Text style={styles.loginText}>立即登入</Text>
                <ArrowRight color="#fff" size={20} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.line} /><Text style={styles.dividerText}>或其他登入方式</Text><View style={styles.line} />
        </View>

        <View style={styles.socialGroup}>
          <TouchableOpacity style={[styles.socialBtn, styles.appleBtn]} onPress={() => handleSocialLogin('Apple')}>
            <Apple size={20} color="#fff" fill="#fff" /><Text style={styles.appleText}>使用 Apple 帳號登入</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialBtn, styles.googleBtn]} onPress={() => handleSocialLogin('Google')}>
            <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' }} style={styles.googleIcon} />
            <Text style={styles.googleText}>使用 Google 帳號登入</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialBtn, styles.phoneBtn]} onPress={() => handleSocialLogin('手機')}>
            <Smartphone size={20} color="#3D3635" /><Text style={styles.phoneText}>使用手機號碼登入</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push('/register' as Href)}>
            <Text style={styles.footerText}>還沒有帳號？ <Text style={styles.highlight}>立即註冊</Text></Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        onConfirm={alertConfig.onConfirm}
        onClose={closeAlert}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  inner: { flex: 1, padding: 30, justifyContent: 'center' },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, zIndex: 10, padding: 10 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoBox: { backgroundColor: '#3D3635', padding: 20, borderRadius: 25, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', color: '#3D3635' },
  subTitle: { fontSize: 14, color: '#AAA', marginTop: 10, fontWeight: '600' },
  form: { gap: 15 },
  inputWrapper: { position: 'relative', justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: 18, zIndex: 1 },
  input: { backgroundColor: '#F8F9FB', padding: 20, paddingLeft: 50, borderRadius: 20, fontSize: 16, borderWidth: 1, borderColor: '#EEE', color: '#333' },
  loginBtn: { backgroundColor: '#3D3635', padding: 20, borderRadius: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 15, elevation: 5 },
  loginText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#EEE' },
  dividerText: { marginHorizontal: 15, color: '#CCC', fontSize: 12, fontWeight: 'bold' },
  socialGroup: { gap: 12 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 20, gap: 12, borderWidth: 1, borderColor: '#EEE' },
  appleBtn: { backgroundColor: '#000', borderColor: '#000' },
  appleText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  googleBtn: { backgroundColor: '#FFF' },
  googleIcon: { width: 18, height: 18 },
  googleText: { color: '#3D3635', fontWeight: 'bold', fontSize: 15 },
  phoneBtn: { backgroundColor: '#F8F9FB' },
  phoneText: { color: '#3D3635', fontWeight: 'bold', fontSize: 15 },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { color: '#AAA', fontWeight: 'bold' },
  highlight: { color: '#3D3635', fontWeight: '900' }
});