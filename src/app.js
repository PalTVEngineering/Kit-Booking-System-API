import cors from "cors";
import express from "express";
import bookingRoutes from "./routes/bookings.js";
import kitRoutes from "./routes/kit.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/kit", kitRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;
