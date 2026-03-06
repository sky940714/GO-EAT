"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, CheckCircle, XCircle, Clock, LogOut, RefreshCcw, ExternalLink, Eye, X } from 'lucide-react';

interface StoreData {
  id: number;
  name: string;
  phone: string;
  address: string;
  category: string;
  social_link?: string;
  photo_url?: string;
  status: 'pending' | 'active' | 'rejected';
  created_at: string;
}

export default function AdminDashboard() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null); // 控制彈窗
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn');
    if (!auth) { router.push('/login'); return; }
    fetchPendingStores();
  }, []);

  const fetchPendingStores = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/pending`);
      const data = await res.json();
      setStores(data);
    } catch (err) {
      console.error("抓取失敗", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: number, status: 'active' | 'rejected') => {
    try {
      const res = await fetch(`${API_BASE}/review/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setStores(stores.filter(s => s.id !== id));
        setSelectedStore(null); // 如果彈窗開著，審核後關閉
      }
    } catch (err) {
      alert("審核操作失敗");
    }
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-4 md:p-10 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight">GO EAT 指揮部</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">
              目前有 {stores.length} 筆待審核申請
            </p>
          </div>
          <button onClick={() => { localStorage.removeItem('isLoggedIn'); router.push('/login'); }} 
                  className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm">
            <LogOut size={18} /> 登出
          </button>
        </div>

        {/* 商家表格 */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-5 text-xs font-black text-gray-400 uppercase">申請日期</th>
                  <th className="p-5 text-xs font-black text-gray-400 uppercase">店家名稱</th>
                  <th className="p-5 text-xs font-black text-gray-400 uppercase">類別</th>
                  <th className="p-5 text-xs font-black text-gray-400 uppercase text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedStore(store)}>
                    <td className="p-5 text-sm text-gray-400 font-medium">
                      {new Date(store.created_at).toLocaleDateString('zh-TW')}
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-gray-800">{store.name}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">{store.address}</div>
                    </td>
                    <td className="p-5">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{store.category}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-center">
                        <button className="bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black transition-all">
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 詳情彈窗 (Modal) */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setSelectedStore(null)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-900 transition-colors">
              <X size={28} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gray-100 p-4 rounded-3xl text-gray-800"><Store size={32} /></div>
              <div>
                <h2 className="text-2xl font-black">{selectedStore.name}</h2>
                <p className="text-gray-400 font-bold">{selectedStore.category}</p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-black text-gray-300 uppercase">聯絡電話</p>
                <p className="font-bold text-gray-700">{selectedStore.phone}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-black text-gray-300 uppercase">店面地址</p>
                <p className="font-bold text-gray-700">{selectedStore.address}</p>
              </div>
              
              {selectedStore.social_link && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-black text-gray-300 uppercase">品牌連結</p>
                  <a href={selectedStore.social_link} target="_blank" className="text-blue-600 font-bold flex items-center gap-1 hover:underline">
                    點此開啟 IG/FB <ExternalLink size={14} />
                  </a>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <p className="text-xs font-black text-gray-300 uppercase">商家照片</p>
                {selectedStore.photo_url ? (
                  <img src={selectedStore.photo_url} className="w-full h-48 object-cover rounded-3xl mt-2 border border-gray-100" alt="Menu" />
                ) : (
                  <div className="w-full h-24 bg-gray-50 rounded-3xl mt-2 flex items-center justify-center text-gray-300 text-sm font-bold border-2 border-dashed border-gray-100">
                    商家未提供照片
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => handleReview(selectedStore.id, 'active')} className="flex-1 bg-gray-900 text-white py-5 rounded-3xl font-black hover:bg-black transition-all shadow-xl shadow-gray-200">
                核准入駐
              </button>
              <button onClick={() => handleReview(selectedStore.id, 'rejected')} className="flex-1 border-2 border-gray-100 text-gray-400 py-5 rounded-3xl font-black hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
                拒絕申請
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}