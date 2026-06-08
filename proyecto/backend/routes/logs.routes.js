import express from 'express';
import { registrarLog } from '../controllers/logs.controller.js';

const router = express.Router();

router.post('/', registrarLog);

export default router;