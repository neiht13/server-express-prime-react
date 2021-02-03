var express = require('express');
var moment = require('moment');
var cors = require('cors');
var app = express();
var port = process.env.PORT || 5050

app.listen(port, function () {
  console.log('Server is running...'+ port);
});
app.use(express.json());
app.use(cors);

app.use(function(req, res, next) {
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.get('/data', function (req, res) {
  res.json({txt: 'Hello'})
});
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "angular"
});
app.get('/employee', function (req, res) {
  connection.connect(function (err) {
    connection.query('select * from employee', function (err, recordset) {
      if (err) console.log(err)
      res.send(recordset);

    });
  });
});
app.get('/employee/:id', function (req, res) {
  connection.connect(function (err) {
    connection.query('select * from employee where id = ' + req.params.id, function (err, recordset) {
      if (err) console.log(err)
      res.send(recordset);

    });
  });
});
app.get('/address', function (req, res) {
  connection.connect(function (err) {
    connection.query('select * from address', function (err, recordset) {
      if (err) console.log(err)
      res.send(recordset);

    });
  });
});

app.post('/employee/new', (req, res) => {
  console.log("new employee" + req.body);
  const newEmp = req.body;
  let sql = 'insert into employee(name, gender, birthday, address) ' +
      `values('${newEmp.name}',${newEmp.gender},${newEmp.birthday && '\''+moment(newEmp.birthday).format('DD/MM/YYYY')+'\''},'${newEmp.city}')` ;
  connection.connect(function (err) {
    connection.query(sql, function (err, recordset) {
      if (err) throw err;
      res.send(recordset);

    });
  });
});

app.post('/employee/edit', (req, res) => {
  console.log(req.body);
  const emp = req.body;
  let sql = `update employee set name = '${emp.name}', gender = ${emp.gender}, birthday = ${emp.birthday && '\''+moment(emp.birthday).format('DD/MM/YYYY')+'\''}, city = '${emp.city}' where id = ${emp.id}` ;
  connection.connect(function (err) {
    connection.query(sql, function (err, recordset) {
      if (err) throw err;
      res.send(recordset);

    });
  });
});

app.post('/employee/delete', (req, res) => {
  const emp = req.body;
  let idList = [];
  emp.forEach(item => idList.push(item.id))
  let sqlDelete = `delete from employee where id in (` + idList.toString() + ')' ;
  connection.connect(function (err) {
    connection.query(sqlDelete, function (err, recordset) {
      if (err) throw err;
      res.send(recordset);

    });
  });
});
app.post('/login', (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;
  let sqlLogin = `select * from user where username like '${user}' and password like '${pwd}'` ;
  connection.connect(function (err) {
    connection.query(sqlLogin, function (err, recordset) {
      if (err) throw err;
      res.send(recordset[0].username);

    });
  });
});

