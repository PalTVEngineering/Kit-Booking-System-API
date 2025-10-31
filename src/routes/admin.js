import express from "express";
import { adminLogin, getAllBookingsWithKits } from "../controllers/admin.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", adminLogin);
router.get("/bookings", getAllBookingsWithKits);

export default router;
