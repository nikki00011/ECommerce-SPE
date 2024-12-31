const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.json());
app.use(cors());
const authRouter = require("./route.js");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

let dbURL = process.env.DB_URL;

authRouter.passTokens(REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET);

app.use("/auth", authRouter.router);

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => {
    console.log("Failed to connect to MONGOO", e.message);
  });

module.exports = app;
