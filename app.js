const express = require("express");
const ExpressError = require("./ExpressErrors");
const itemRoutes = require("./routes/item-routes");
const app = express();

app.use(express.json());
app.use("/items", itemRoutes);

/** 404 handler */
app.use(function (req, res, next) {
  return new ExpressError("Not Found", 404);
});

/** general error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.msg,
  });
});

module.exports = app;
