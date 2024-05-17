// routes/sessions.js

const express = require("express");
const router = express.Router();

module.exports = router;

module.exports = (trades) => {
  const trade = require("../controller/tradesController");

  const router = require("express").Router();

  router.patch("/:id", trade.patch);

  router.put("/:id", trade.update);

  router.delete("/:id", trade.delete);

  router.get("/", trade.get);

  router.get("/:id", trade.getById);

  router.post("/", trade.create);

  trades.use("/api/trades", router);
};
