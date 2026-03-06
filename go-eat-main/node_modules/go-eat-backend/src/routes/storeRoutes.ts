import { Router } from 'express';
import { applyStore, getPendingStores, reviewStore } from '../controllers/storeController.js';

const router = Router();

// 商家申請 API (App 使用)
router.post('/apply', applyStore);

// 獲取待審核清單 API (管理員 root 使用)
router.get('/pending', getPendingStores);

// 執行審核 API (管理員 root 使用)
router.patch('/review/:id', reviewStore);

export default router;