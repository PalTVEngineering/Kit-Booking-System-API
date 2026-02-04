import cors from "cors";
import express from "express";
import bookingRoutes from "./routes/bookings.js";
import kitRoutes from "./routes/kit.js";
import returnsRoutes from "./routes/returns.js";
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // IMPORTANT: need to add production IP or URL so it works in production (wildcards dont work with credentials)
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
