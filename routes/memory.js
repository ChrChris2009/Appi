const express = require("express");
const fs = require("fs-extra");
const path = require("path");

const router = express.Router();
const DB_DIR = path.join(__dirname, "../database");
const DB = path.join(DB_DIR, "memory.json");

// LOAD
function load() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.ensureDirSync(DB_DIR);
    }
    if (!fs.existsSync(DB)) {
      fs.writeJSONSync(DB, {});
      return {};
    }
    return fs.readJSONSync(DB);
  } catch (error) {
    console.error("Erreur de chargement de la base de données :", error);
    return {};
  }
}

// SAVE
function save(data) {
  try {
    fs.ensureDirSync(DB_DIR);
    fs.writeJSONSync(DB, data, { spaces: 2 });
  } catch (error) {
    console.error("Erreur d'écriture dans la base de données :", error);
  }
}

// GET USER
router.get("/:id", (req, res) => {
  const db = load();
  const id = req.params.id;

  res.json(db[id] || { name: null, messages: 0 });
});

// SET USER
router.post("/:id", (req, res) => {
  const db = load();
  const id = req.params.id;

  db[id] = req.body;
  save(db);

  res.json({ success: true });
});

module.exports = router;

