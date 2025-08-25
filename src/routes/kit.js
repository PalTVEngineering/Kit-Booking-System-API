import express from 'express';
import { getKit } from '../controllers/kit.js';

const router = express.Router();

router.get("/", getKit);

export default router;