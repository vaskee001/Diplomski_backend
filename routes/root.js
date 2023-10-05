const express =require('express');
const router = express.Router();
const path = require('path');

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname,'..', "views", "index.html"));
});

router.get("/new-page(.html)?|/old-page.html", (req, res) => {
  res.sendFile(path.join(__dirname,'..', "views", "new-page.html"));
});

router.get("/str2(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname,'..', "views", "str2.html"));
});

router.get("/str3(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname,'..', "views", "str3.html"));
});

router.get("/str4(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname,'..', "views", "str4.html"));
});

module.exports = router;