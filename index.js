const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
require("dotenv").config();

const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");

const app = express();
const port = process.env.PORT;

// override with POST
app.use(methodOverride("_method"));

// App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Connect DB
database.connect();

// Set up
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

// Routes init
routeAdmin(app);
routeClient(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
