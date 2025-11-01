import express from "express";
import { confirmReturn, findUserBookings, getBookingAndKits } from "../controllers/returns.js";

const router = express.Router();

router.post("/find-user-bookings", findUserBookings);
router.get("/booking-and-kits", getBookingAndKits);
router.post("/confirm-return", confirmReturn);

export default router;
