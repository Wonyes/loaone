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

app.get("/api/lostark/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        error: "type parameter is required",
      });
    }

    const endpoint = `https://developer-lostark.game.onstove.com/armories/characters/${encodeURIComponent(name)}/${type}`;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `bearer ${process.env.LOSTARK_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: "Failed to fetch from Lost Ark API",
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Lost Ark API Error:", error);
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
