var express = require('express');
var moment = require('moment');
var pgp = require('pg-promise')();
var app = express();
var port = process.env.PORT || 5000
app.listen(port, function () {
  console.log('Server is running...'+ port);
});

var db;
db = pgp(`postgres://postgres:1710@localhost:5432/react_prime_thien`);



app.use(express.json())
app.use(function(req, res, next) {
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

function getData(sql, res){
    db.any(sql).then(function (data) {
        console.log('DATA:', data)
        res.send(data);
    })
}

app.get('/data', function (req, res) {
        var sql = "select * from u_user";
        getData(sql, res)
    }
);
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "angular"
});
var pool  = mysql.createPool({
  connectionLimit : 10,
    host: "127.0.0.1",
  user: "root",
  password: "",
  database: "angular"
});
app.get('/employee', function (req, res) {
    var sql = "select * from employee";
    getData(sql, res)
});
app.get('/employee/:id', function (req, res) {
    pool.query('select * from employee where id = ' + req.params.id, function (err, recordset) {
      if (err) console.log(err)
      res.send(recordset);

    });
});
app.get('/address', function (req, res) {
  pool.query('select * from address', function (err, recordset) {
      if (err) console.log(err)
      res.send(recordset);

    });
});

app.post('/employee/new', (req, res) => {
  console.log("new employee" + req.body);
  const newEmp = req.body;
  let sql = 'insert into employee(name, gender, birthday, address) ' +
      `values('${newEmp.name}',${newEmp.gender},${newEmp.birthday && '\''+moment(newEmp.birthday).format('DD/MM/YYYY')+'\''},'${newEmp.city}')` ;
  pool.query(sql, function (err, recordset) {
      if (err) throw err;
      res.send(recordset);

    });
});

app.post('/employee/edit', (req, res) => {
  console.log(req.body);
  const emp = req.body;
  let sql = `update employee set name = '${emp.name}', gender = ${emp.gender}, birthday = ${emp.birthday && '\''+moment(emp.birthday).format('DD/MM/YYYY')+'\''}, city = '${emp.city}' where id = ${emp.id}` ;
  pool.query(sql, function (err, recordset) {
      if (err) throw err;
      res.send(recordset);

    });
});

app.post('/employee/delete', (req, res) => {
  const emp = req.body;
  let idList = [];
  emp.forEach(item => idList.push(item.id))
  let sqlDelete = `delete from employee where id in (` + idList.toString() + ')' ;
  pool.query(sqlDelete, function (err, recordset) {
      if (err) throw err;
      res.send(recordset);

    });
});
app.post('/login', (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;
  let sqlLogin = `select * from user where username like '${user}' and password like '${pwd}'` ;
  pool.query(sqlLogin, function (err, recordset) {
      if (err) throw err;
      res.send(recordset[0].username);

  });
});

