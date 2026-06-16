const express = require("express");
const fs = require("fs-extra");
const path = require("path");
require("dotenv").config();

const app = express();

// PORT
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVIR LES FICHIERS STATIQUES (Dossier public)
app.use(express.static(path.join(__dirname, "public")));

// LOG SAFE
function log(msg) {
  console.log("🌸 [NEO API] " + msg);
}

// SAFE IMPORT ROUTES
function safeRequire(routePath) {
  try {
    return require(routePath);
  } catch (err) {
    log(`❌ Route manquante ou en erreur : ${routePath}`);
    console.error(err);
    return express.Router();
  }
}

// ROUTES API
const aiRoute = safeRequire("./routes/ai");
const toolsRoute = safeRequire("./routes/tools");
const memoryRoute = safeRequire("./routes/memory");

// USE ROUTES
app.use("/api/ai", aiRoute);
app.use("/api/tools", toolsRoute);
app.use("/api/memory", memoryRoute);

// ACCÈS AUX INTERFACES FRONTEND (ROUTES WEB)
app.get("/", (req, res) => {
  res.json({
    status: "NEO API ONLINE 🌸",
    creator: "Célestin Olua",
    version: "1.0.0",
    interfaces: {
      chat: "/chat",
      social: "/social"
    }
  });
});

// Route pour afficher l'application G-Chat
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});

// Route pour afficher l'application G-Social
app.get("/social", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "social.html"));
});

// HEALTH CHECK
app.get("/ping", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 404 SAFE pour l'API
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "Route API introuvable ❌"
  });
});

// Redirection globale vers l'accueil si page web non trouvée
app.use((req, res) => {
  res.redirect("/");
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack || err.message);
  res.status(err.status || 500).json({
    error: "Erreur serveur interne",
    message: process.env.NODE_ENV !== "production" ? err.message : undefined
  });
});

// START SERVER
app.listen(PORT, () => {
  log(`Serveur lancé sur http://localhost:${PORT}`);
});

// EXPORT POUR VERCEL
module.exports = app;

