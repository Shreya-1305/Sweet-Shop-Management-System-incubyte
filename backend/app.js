const express = require("express");
const authRoutes = require("./routes/authRoutes");
const sweetRoutes = require("./routes/sweetRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/sweets", sweetRoutes);

module.exports = app;
