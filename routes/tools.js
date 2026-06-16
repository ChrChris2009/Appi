const express = require("express");
const router = express.Router();

// HEURE
router.get("/time", (req, res) => {
  res.json({
    time: new Date().toLocaleString("fr-FR")
  });
});

// PREFIX
router.get("/prefix", (req, res) => {
  res.json({
    prefix: "/"
  });
});

module.exports = router;

