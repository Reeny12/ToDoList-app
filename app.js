const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const methodOverride = require("method-override");


const app = express();

/*// conenction to mongodb
mongoose.connect("mongodb://localhost:27017/Todolist", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});*/

mongoose.connect("mongodb://localhost:27017/Todolist");

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));


// routes
//app.use(require("./routes/index"))
app.use(require("./routes/todo"))
app.use(require("./routes/auth"));



// server configurations....
app.listen(3000, () => console.log("Server started listening on port: 3000"));