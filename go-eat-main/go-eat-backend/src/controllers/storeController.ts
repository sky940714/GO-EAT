import { Request, Response } from 'express';
import pool from '../config/database.js';

export const applyStore = async (req: Request, res: Response) => {
  const { name, phone, address, category, socialLink } = req.body;

  // 基本後端驗證，確保必填欄位不為空
  if (!name || !phone || !address || !category) {
    return res.status(400).json({ message: '請填寫所有必填欄位' });
  }

  try {
    // 2. 執行 SQL 插入指令
    const [result] = await pool.execute(
      'INSERT INTO stores (name, phone, address, category, social_link) VALUES (?, ?, ?, ?, ?)',
      [name, phone, address, category, socialLink || null]
    );

    res.status(201).json({ 
      message: '商家申請已成功送出', 
      storeId: (result as any).insertId 
    });
  } catch (error) {
    console.error('資料庫寫入失敗:', error);
    res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
  }
};

// 獲取所有「待審核」商家
export const getPendingStores = async (req: Request, res: Response) => {
  try {
    // 確保選取所有欄位 (*)，並依據建立時間 (created_at) 倒序排列
    const [rows] = await pool.execute(
      'SELECT * FROM stores WHERE status = "pending" ORDER BY created_at DESC'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('獲取清單失敗:', error);
    res.status(500).json({ message: '獲取清單失敗' });
  }
};

// 審核商家 (更新狀態)
export const reviewStore = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' 或 'rejected'

  if (!['active', 'rejected'].includes(status)) {
    return res.status(400).json({ message: '無效的狀態' });
  }

  try {
    await pool.execute(
      'UPDATE stores SET status = ? WHERE id = ?',
      [status, id]
    );
    res.status(200).json({ message: `商家狀態已更新為 ${status}` });
  } catch (error) {
    res.status(500).json({ message: '審核操作失敗' });
  }
};