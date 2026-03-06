import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native'; // 💡 引入 Platform 來判斷當前環境

interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  login: (token: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 💡 建立一個跨平台的儲存小幫手
const setStorageItemAsync = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    try { localStorage.setItem(key, value); } catch (e) { console.error(e); }
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getStorageItemAsync = async (key: string) => {
  if (Platform.OS === 'web') {
    try { return localStorage.getItem(key); } catch (e) { console.error(e); return null; }
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteStorageItemAsync = async (key: string) => {
  if (Platform.OS === 'web') {
    try { localStorage.removeItem(key); } catch (e) { console.error(e); }
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        // 💡 使用跨平台小幫手讀取
        const token = await getStorageItemAsync('userToken');
        const savedUser = await getStorageItemAsync('userData');
        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("初始化載入狀態失敗", e);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (token: string, userData: any) => {
    // 💡 使用跨平台小幫手寫入
    await setStorageItemAsync('userToken', token);
    await setStorageItemAsync('userData', JSON.stringify(userData));
    setUser(userData); 
  };

  const logout = async () => {
    // 💡 使用跨平台小幫手刪除
    await deleteStorageItemAsync('userToken');
    await deleteStorageItemAsync('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth 必須在 AuthProvider 內使用");
  return context;
};