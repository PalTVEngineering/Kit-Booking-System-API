import express from 'express';
import { createBookings, getBookings } from '../controllers/bookings.js';

const router = express.Router();

router.get("/", getBookings);
router.post("/create", createBookings);

export default router;