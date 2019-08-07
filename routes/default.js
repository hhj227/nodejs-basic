const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("*", (request, response, next) => {
  db.query(`SELECT * FROM topic`, (error, topics) => {
    if (error) {
      throw error;
    }
    request.body.list = topics;
    next();
  });
});

module.exports = router;