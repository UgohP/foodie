const express = require('express');
const expressLayout = require("express-ejs-layouts");
const app = express();

PORT = 4000;

app.use(express.static("./public"));
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./routes/main"));

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
