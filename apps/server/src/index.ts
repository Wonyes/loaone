import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "loaone server running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/character/:name", async (req, res) => {
  try {
    const { name } = req.params;
    res.json({
      success: true,
      character: {
        name,
        level: 1620,
        class: "버서커",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 loaone server: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
