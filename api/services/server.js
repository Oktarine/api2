const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require('http');
const fs = require("fs");
const app = express();

var corsOptions = {

};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
app.get("/api/test/admin1123", function (req, res) {
  res.send({
    hhh: "asdasda"
  })
}

);

const PORT = process.env.PORT || 8080;
const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync('./services/privkey.pem'),
  cert: fs.readFileSync('./services/fullchain.pem'),
}, app);

httpsServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
httpServer.listen(8081, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
}