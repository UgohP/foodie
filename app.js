require('dotenv').config()
const express = require('express');
const connectDB = require('./config/db')
const expressLayout = require("express-ejs-layouts");
const app = express();

const PORT = 4000;
connectDB()

app.use(express.static("./public"));
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./routes/main"));
app.use("/", require("./routes/admin"));


app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
