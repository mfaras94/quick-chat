import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { globalRateLimiter } from "./middleware/rateLimit.middleware.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";


const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.set("trust proxy", 1);

app.use(express.json({limit: "5mb"}));
app.use(urlencoded({extended:true, limit:"5mb"}))
app.use(cors({origin:ENV.CLIENT_URL, credentials:true}))
app.use(cookieParser());

app.use(globalRateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Keep-alive and header timeouts should be aligned with reverse proxy timeouts
// to avoid unexpected EOF/connection reset errors behind CDN/Varnish/Nginx.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;
server.requestTimeout = 120_000;

server.listen(PORT, () => {
  console.log("server is running on port 3000 ");
  connectDB();
});
