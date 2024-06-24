const express = require("express");

const route = require("./routes/client/index.route");

const app = express();
const port = 2306;

app.set("views", "./views");
app.set("view engine", "pug");

// Routes init
route(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
