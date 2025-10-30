import { Router } from 'express';
import { verifyCredential, healthCheck } from '../controllers/verificationController';

const router = Router();

router.post('/verify', verifyCredential);
router.get('/health', healthCheck);

export default router;
