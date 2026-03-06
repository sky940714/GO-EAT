import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import storeRoutes from './routes/storeRoutes.js';
import authRoutes from './routes/authRoutes.js'; // 1. 引入

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件 (Middleware)
app.use(cors()); // 允許跨網域請求 (讓 App 能連上後端)
app.use(express.json()); // 解析 JSON 格式的請求內容
// 註冊路由
app.use('/api/stores', storeRoutes);
app.use('/api/auth', authRoutes); // 2. 註冊認證路由
// 測試用首頁
app.get('/', (req, res) => {
  res.send('GO EAT 後端伺服器運行中 🚀');
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});