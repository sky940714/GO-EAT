import { Router } from 'express';
import { register, login, deleteAccount } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/delete-account', deleteAccount);

export default router;