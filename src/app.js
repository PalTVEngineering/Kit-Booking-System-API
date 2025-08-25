import cors from "cors";
import express from "express";
import kitRoutes from "./routes/kit.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/kit", kitRoutes);

export default app;
