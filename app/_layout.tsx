import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, Dimensions, Image } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

// 保持 Splash 畫面直到我們準備好
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current; // 用於縮放
  const opacityAnim = useRef(new Animated.Value(0)).current; // 用於底部文字淡入

  useEffect(() => {
    // 1. 模擬資源加載
    setTimeout(async () => {
      await SplashScreen.hideAsync(); // 隱藏系統預設 Splash

      // 2. 啟動 Logo 彈跳動畫
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,     // 阻力（越小彈得越厲害）
        tension: 40,     // 張力
        useNativeDriver: true,
      }).start();

      // 3. 延遲後淡入提示文字
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }).start();
    }, 500);
  }, []);

  // 如果點擊了，就進入 App 主體
  if (isReady) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  return (
    <TouchableWithoutFeedback onPress={() => setIsReady(true)}>
      <View style={styles.container}>
        {/* 中央 Logo 彈跳 */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Image 
            source={require('../assets/images/icon.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.brandName}>GO EAT</Text>
        </Animated.View>

        {/* 底部提示文字 */}
        <Animated.View style={[styles.footer, { opacity: opacityAnim }]}>
          <Text style={styles.startText}>— 點擊任意地方開始你的美食之旅 —</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FF6B6B',
    letterSpacing: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 80,
  },
  startText: {
    fontSize: 14,
    color: '#999',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});