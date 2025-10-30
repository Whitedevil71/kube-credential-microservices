import { Router } from 'express';
import { issueCredential, healthCheck } from '../controllers/issuanceController';

const router = Router();

router.post('/issue', issueCredential);
router.get('/health', healthCheck);

export default router;
