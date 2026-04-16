import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { Server } from "socket.io";


dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});
app.use("/api/admin", adminRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/report", reportRoutes);

const PORT = process.env.PORT || 3000;

const server=app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export { io };