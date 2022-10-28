// Thiết lập máy chủ Express web server

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "*",
  // credentials: true,
  // method: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Authorization', 'Content-Type', ]
};

app.use(cors(corsOptions));

// parse request của content type - application/json
app.use(bodyParser.json());

// parse request của content type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome" });
// });

// app.post("/tutorials", (req, res) => {
//   res.json({ message: "Welcome" });
// });

// app.get("/tutorials", (req, res) => {
//   res.json({
//     result: [
//       { name: "title", description: "description" },
//       { name: "title2", description: "description2" },
//       { name: "title3", description: "description3" },
//       { name: "title4", description: "description4" },
//     ],
//   });
// });

// app.delete("/tutorials", (req, res) => {
//   res.json({ message: "Welcome" });
// });

require("./app/routes/tutorial.routes")(app);

//set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
