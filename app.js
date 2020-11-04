const express = require('express');
const app = express();
const port = 3000;
var mysql = require('mysql');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const { request } = require('express');
const jsonParser = bodyParser.json();

var con = mysql.createConnection({
    host: "localhost",
    user: "Jarvis",
    password: "187",
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    checkIfDatabaseExists("calendar");
});

function checkIfDatabaseExists(name) {
    con.query("SHOW DATABASES LIKE '" + name + "'", function(err, results) {
        if(err) throw err;
        if(results.length !== 1){
            createDatabase();
        }else {
            console.log("Database found");
        }
        con.changeUser({database : name}, function(err) {
            if (err) throw err;
        });
        checkIfTablesExists();
    });
}

function checkIfTablesExists() {
    con.query("SHOW TABLES", function(err, results) {
        if(err) throw err;

        let tables = [];
        results.forEach(result => {
            tables.push(result.Tables_in_calendar);
        });
        console.log("Existing Tables found: " + tables);

        if(tables.indexOf("users") == -1) createUsers();
        if(tables.indexOf("events") == -1) createEvents();
        if(tables.indexOf("groups") == -1) createGroups();
    });
}

function createDatabase() {
    con.query("CREATE DATABASE calendar", function (err) {
        if (err) throw err;
        console.log("Database created");
    });
}

function createUsers(){
    con.query("CREATE TABLE users(id INT(255) UNSIGNED AUTO_INCREMENT PRIMARY KEY, userID VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)", function(err) {
        if(err) throw err
        console.log("Created Table Users");
    });
}

function createEvents(){
    con.query("CREATE TABLE events(id INT(255) UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, location VARCHAR(255), organizer VARCHAR(255) NOT NULL, start VARCHAR(255) NOT NULL, end VARCHAR(255) NOT NULL, statusId VARCHAR(255), allday BOOLEAN, webpage VARCHAR(255), imagedata VARCHAR(255), categorieId VARCHAR(255), extra VARCHAR(1020))", function(err) {
        if(err) throw err
        console.log("Created Table Events");
    });
}

function createGroups(){
    con.query("CREATE TABLE groups(id INT(255) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)", function(err) {
        if(err) throw err
        console.log("Created Table Users");
    });
}


app.post("/users", jsonParser, (req, res) => {
    con.query("INSERT INTO users(userID, password) VALUES('" + req.body.userID + "','" + req.body.password + "')", function(err) {
        if(err) throw err;
        console.log("User added");
    });    
})

app.get("/users/:id", jsonParser, (req, res) => {
    con.query("SELECT password FROM users WHERE userID = '" + req.params.id + "'", function(err, ress) {
        if(err) throw err;
        res.json(ress);
    });
})

// ID atribute und all day muss extra gehandelt werden.
app.post("/events", jsonParser, (req, res) => {
    con.query("INSERT INTO events(title, location, organizer, start, end, statusId, allday, webpage, imagedata, categorieId, extra) VALUES('"+ req.body.title + "','" + req.body.location + "','" + req.body.organizer + "','" + req.body.start + "','" + req.body.end + "','" + 1 + "','" + req.body.allday + "','" + req.body.webpage + "','" + req.body.imagedata + "','" + 1 +"','" + req.body.extra +"')", function(err) {
        if(err) throw err;
        console.log("Event added");
        res.json(req.body);
    }); 
})

app.get("/events", jsonParser, (req, res) => {
    con.query("SELECT * FROM events", function(err, ress){
        if(err) throw err
        res.json(ress);
        console.log("All events requested");
    });
})

app.delete("/events/:id", jsonParser, (req, res) => {
    con.query("DELETE FROM events WHERE id = '" + req.params.id + "'", function(err, ress){
        if(err) throw err
        console.log("Removed envent with id: " + req.params.id);
        res.send()
    });
})

app.get("/groups", jsonParser, (req, res) => {
    con.query("SELECT * FROM groups", function(err, ress){
        if(err) throw err
        res.json(ress);
        console.log("All groups requested");
    });
})

app.post("/groups", jsonParser, (req, res) => {
    console.log(req.body)
    con.query("INSERT INTO groups(name) VALUES('" + req.body.name + "')", function(err, ress){
        if(err) throw err
        console.log("Group added")
        res.json()
    })
})

app.listen(port, () => console.log('Calender App listening on port ' + port + '!'))