import express from "express";
import { confirmReturn, findUserBookings, getBookingAndKits, getBookingKits } from "../controllers/returns.js";

const router = express.Router();

router.post("/find-user-bookings", findUserBookings);
router.get("/booking-kits/:bookingId", getBookingKits); 
router.get("/booking-and-kits", getBookingAndKits);
router.post("/confirm-return", confirmReturn);

export default router;
