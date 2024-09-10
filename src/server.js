import express from "express";
import cors from "cors";
import path from "path";
import env from "dotenv";
import { initializeSocket } from "./libs/wa_web.js";
import send_message_controllers from "./controllers/send_message_controllers.js";
import http from "http";
import fs from "fs";
env.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Membuat server HTTP
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(path.dirname(""), "public")));

// ROUTES
app.use("/api", send_message_controllers);

// Menggunakan server yang sudah dibuat untuk mendengarkan koneksi
server.listen(PORT, "0.0.0.0", () => {
  console.log(`
    SERVER RUNNING TO PORT ${PORT}
  `);
});
