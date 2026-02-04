import cors from "cors";
import express from "express";
import bookingRoutes from "./routes/bookings.js";
import kitRoutes from "./routes/kit.js";
import returnsRoutes from "./routes/returns.js";
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.js";
import cookieParser from "cookie-parser";
const app = express();

// allowed URLs for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://kit-booking.paltv.uk" // i think this is the correct URL, but you should verify it
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/kit", kitRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/returns", returnsRoutes);
app.use("/api/admin", adminRoutes);

export default app;
