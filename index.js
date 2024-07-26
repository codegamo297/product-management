const express = require("express");
const methodOverride = require("method-override");
const flash = require("express-flash");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");
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
app.locals.moment = moment;

// Connect DB
database.connect();

// Body parse the data
app.use(express.json()); //request json
app.use(express.urlencoded({ extended: true })); // request URL-encoded

// Set up
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "/public")));

// New Route to the TinyMCE Node module
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// Tooltip message (notification)
app.use(
    session({
        secret: process.env.SECRET_TOOLTIP,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 },
    })
);
app.use(flash());

// Cookies
app.use(cookieParser());

// Routes init
routeAdmin(app);
routeClient(app);
app.get("*", (req, res) => {
    res.render("client/pages/error/404", {
        pageTitle: "404 Not Found",
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
