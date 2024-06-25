const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const route = require("./routes/client/index.route");
const database = require("./config/database");

const app = express();
const port = process.env.PORT;

// Connect DB
database.connect();

// Set up
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

// Routes init
route(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
