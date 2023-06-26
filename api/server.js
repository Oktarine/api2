const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require('http');
const fs = require("fs");
const app = express();
const mysql = require("mysql");


const config = require("./app/config/db.config.js");
var corsOptions = {
};


const connection = mysql.createConnection({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DB,
  port: config.PORT
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();



app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


app.get("/taskList/:id?", (req, res) => {

  let userId = 1;
  if (req.params.id) {
    userId = Number(req.params.id)
  }

  connection.query(`SELECT * FROM todo WHERE user_id = '${userId}'`, async function (err, result) {
    if (err) throw err;
    if (result) {
      res.send({
        result
      });

    }
  })


});


app.post("/addTask", (req, res) => {

  if (!req.body) res.sendStatus(400);

  let title = req.body.title;
  let completed = 0;
  let description = req.body.description;
  let user_id = req.body.user_id;


  connection.query(`INSERT INTO todo (title , completed ,description ,user_id  ) VALUES ('${title}', '${completed}','${description}','${user_id}')  `, function (err, result) {
    if (err) throw err;
  })


  res.json({ message: "ok." });
});


app.post("/delTask", (req, res) => {

  if (!req.body) res.sendStatus(400);

  let id = req.body.id;

  connection.query(`DELETE FROM todo WHERE id = ${id}`, async function (err, result) {
    if (err) throw err;
    if (result) {
      console.log(result)
      res.json({ message: "ok." });
    }
  })


});


app.post("/compTask", (req, res) => {

  if (!req.body) res.sendStatus(400);

  let id = req.body.id;

  connection.query(`UPDATE todo SET completed = 1 WHERE id = ${id}`, async function (err, result) {
    if (err) throw err;
    if (result) {
      console.log(result)
      res.json({ message: "ok." });
    }
  })


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

const PORT = process.env.PORT || 2083;
const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync('./services/privkey.pem'),
  cert: fs.readFileSync('./services/fullchain.pem'),
}, app);

// httpsServer.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });


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