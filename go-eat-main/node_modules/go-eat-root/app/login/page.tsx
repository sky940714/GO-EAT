"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 這裡我們暫時使用簡易硬編碼驗證，未來可改為 API 驗證
    if (password === 'admin888') { // 這是你的暫時密碼
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/');
    } else {
      alert('密碼錯誤，請重新輸入');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Lock className="text-gray-800" size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-800">GO EAT 管理中心</h1>
          <p className="text-gray-400 text-sm mt-2">請輸入管理員金鑰以繼續</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="password"
            placeholder="管理員密碼"
            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-gray-800 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit"
            className="w-full bg-gray-800 text-white p-4 rounded-2xl font-bold hover:bg-black transition-colors shadow-lg"
          >
            登入系統
          </button>
        </form>
      </div>
    </div>
  );
}