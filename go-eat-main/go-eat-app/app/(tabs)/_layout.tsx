import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Home, MessageSquare, Flame, Users, User } from 'lucide-react-native'; 
import { HapticTab } from '@/components/haptic-tab';

export default function TabLayout() {
  const activeColor = '#FF6B6B'; 
  const inactiveColor = '#999';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        // --- 懸浮導覽列核心樣式 ---
        tabBarStyle: {
          position: 'absolute',      // 關鍵：讓導覽列懸浮
          bottom: 25,                // 距離底部高度
          left: 20,                  // 距離左側距離
          right: 20,                 // 距離右側距離
          height: 70,                // 導覽列高度
          elevation: 10,             // Android 陰影
          shadowColor: '#000',       // iOS 陰影顏色
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // 帶有一點點透明度
          borderRadius: 35,          // 極致圓潤的邊角
          borderTopWidth: 0,         // 移除上方邊框
          paddingBottom: Platform.OS === 'ios' ? 0 : 0, // 修正懸浮後的間距
          overflow: 'hidden',        // 確保內容不超出圓角
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        tabBarIconStyle: {
          marginTop: 10,
        }
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: '首頁',
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: '社群',
          tabBarIcon: ({ color }) => <MessageSquare size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="swipe"
        options={{
          title: '選餐',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.centerIcon, focused && styles.centerIconActive]}>
              <Flame size={26} color={focused ? '#fff' : color} fill={focused ? '#fff' : 'none'} />
            </View>
          ),
          tabBarLabel: () => null, // 隱藏中間按鈕的文字，更像截圖中的設計
        }}
      />

      <Tabs.Screen
        name="kol"
        options={{
          title: '推薦',
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: '會員',
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  centerIconActive: {
    backgroundColor: '#FF6B6B', // 選中時中間按鈕變色，模仿截圖效果
    // 增加一點發光感
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  }
});