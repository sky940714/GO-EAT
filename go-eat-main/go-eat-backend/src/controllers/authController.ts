import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET as string;

// 1. 註冊帳號
export const register = async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;

  try {
    // 檢查 Email 是否已被註冊
    const [existing]: any = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: '此 Email 已被註冊' });

    // 密碼加密 (雜湊處理)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 存入資料庫
    await pool.execute(
      'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
      [email, passwordHash, fullName]
    );

    res.status(201).json({ message: '註冊成功' });
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 2. 登入帳號
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const [users]: any = await pool.execute('SELECT * FROM users WHERE email = ? AND status = "active"', [email]);
    const user = users[0];

    if (!user) return res.status(401).json({ message: '帳號或密碼錯誤' });

    // 驗證密碼是否正確
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: '帳號或密碼錯誤' });

    // 核發 JWT 通行證 (效期 7 天)
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, email: user.email, fullName: user.full_name } });
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 3. 刪除帳號 (符合 Apple 規範)
export const deleteAccount = async (req: Request, res: Response) => {
  const { userId } = req.body; // 實務上應從 Token 中解析 userId

  try {
    // 執行軟刪除：更新狀態並紀錄時間
    await pool.execute(
      'UPDATE users SET status = "deleted", deleted_at = NOW() WHERE id = ?',
      [userId]
    );
    res.json({ message: '帳號已成功註銷，相關資料將於作業時間後刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除失敗' });
  }
};