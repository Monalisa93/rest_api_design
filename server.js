const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

require("./src/routes/product.routes.js")(app);

var PORT = process.env["port"] || 3000;

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`);
});

module.exports = { app };
