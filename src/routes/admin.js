import express from "express";
import { adminLogin, getAllBookingsWithKits } from "../controllers/admin.js";
import authenticate from "../auth/auth.js";
const router = express.Router();

// POST /api/admin/login
router.post("/login", adminLogin);
router.get("/bookings", authenticate, getAllBookingsWithKits);
router.delete("/booking/delete", authenticate, deleteBooking);

export default router;
