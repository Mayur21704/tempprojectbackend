// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getUserBookings,
} from "../controllers/bookingController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { generateTicket, getPdfTicket } from "../controllers/pdfController.js";

const router = express.Router();

// Route to create a booking
router.post("/create", verifyToken, createBooking);

// Route to get all bookings for a user
router.get("/:userId", verifyToken, getUserBookings);

router.post("/generateTicket/:bookingId", generateTicket);

// routes/pdfRoutes.js (continued)
router.get("/downloadTicket/:bookingId", getPdfTicket);

export default router;
