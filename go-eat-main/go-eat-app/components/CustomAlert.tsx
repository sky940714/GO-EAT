import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;      // 💡 新增：取消按鈕文字
  showCancel?: boolean;     // 💡 新增：是否顯示取消按鈕
  onConfirm?: () => void;
  onCancel?: () => void;    // 💡 新增：取消事件
  onClose: () => void;
}

export default function CustomAlert({ 
  visible, title, message, 
  confirmText = "確定", cancelText = "取消", showCancel = false, 
  onConfirm, onCancel, onClose 
}: CustomAlertProps) {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.spring(scaleValue, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
        Animated.timing(opacityValue, { toValue: 1, duration: 200, useNativeDriver: true })
      ]).start();
    } else {
      Animated.timing(opacityValue, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        scaleValue.setValue(0);
        setShowModal(false); 
      });
    }
  }, [visible]);

  return (
    <Modal transparent visible={showModal} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.alertBox, { transform: [{ scale: scaleValue }], opacity: opacityValue }]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          {/* 💡 按鈕區塊：根據 showCancel 決定要顯示一個還是兩個按鈕 */}
          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => { onClose(); if (onCancel) onCancel(); }}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => { onClose(); if (onConfirm) onConfirm(); }}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  alertBox: { backgroundColor: '#fff', width: '100%', maxWidth: 320, borderRadius: 30, padding: 25, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 },
  title: { fontSize: 22, fontWeight: '900', color: '#3D3635', marginBottom: 10 },
  message: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25, lineHeight: 22, fontWeight: '600' },
  buttonContainer: { flexDirection: 'row', width: '100%', gap: 10, justifyContent: 'space-between' },
  button: { backgroundColor: '#FF6B6B', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 20, flex: 1, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F0F0F0' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  cancelButtonText: { color: '#666' }
});