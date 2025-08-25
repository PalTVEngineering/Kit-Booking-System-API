import cors from "cors";
import express from "express";
import userRoutes from "./routes/users.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);

export default app;
