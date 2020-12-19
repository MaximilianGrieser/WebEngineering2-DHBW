const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
var mysql = require('mysql');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const { request } = require('express');
const jsonParser = bodyParser.json();
const cors = require('cors')


const server = app.listen(4000, function(){
    console.log("API en cours d'exécution sur le port 3000");
});
module.exports = server;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

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

        if(tables.indexOf("users") === -1) createUsers();
        if(tables.indexOf("events") === -1) createEvents();
        if(tables.indexOf("groups") === -1) createGroups();
        if(tables.indexOf("categories") === -1) createCategories();
        if(tables.indexOf("usergroup") === -1) createUserGroup();
        if(tables.indexOf("eventcategories") === -1) createEventCategories();
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
    con.query("CREATE TABLE events(id INT(255) UNSIGNED AUTO_INCREMENT PRIMARY KEY, userID INT(255), title VARCHAR(255) NOT NULL, location VARCHAR(255), organizer VARCHAR(255) NOT NULL, start VARCHAR(255) NOT NULL, end VARCHAR(255) NOT NULL, statusId VARCHAR(255), allday BOOLEAN, webpage VARCHAR(255), extra VARCHAR(1020))", function(err) {
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

function createUserGroup() {
    con.query("CREATE TABLE usergroup(id INT(255) UNSIGNED AUTO_INCREMENT PRIMARY KEY, userID VARCHAR(255) NOT NULL, groupID VARCHAR(255) NOT NULL)", function(err) {
        if(err) throw err
        console.log("Created Table UserGroup");
    });
}

function createCategories(){
    con.query("CREATE TABLE categories(id INT(255) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)", function(err) {
        if(err) throw err
        console.log("Created Table Categories");
    });
    con.query("INSERT INTO categories (name) VALUES ('none'), ('private'), ('business'), ('school'), ('holiday')", function(err) {
        if(err) throw err
        console.log("Filled Table Categories");
    });
}

function createEventCategories(){
    con.query("CREATE TABLE eventcategories(id INT(255) UNSIGNED AUTO_INCREMENT PRIMARY KEY, eventID INT(255) NOT NULL, categoryID INT(255) NOT NULL)", function(err) {
        if(err) throw err
        console.log("Created Table Event-Categories");
    });
}



app.post("/users", jsonParser, (req, res) => {
    con.query("INSERT INTO users(userID, password) VALUES('" + req.body.userID + "','" + req.body.password + "')", function(err) {
        if(err) throw err;
        console.log("User added");
    });    
})

app.get("/users", jsonParser, (req, res) => {
    con.query("SELECT * FROM users ", function(err, ress) {
        if(err) throw err;
        res.json(ress);
        console.log("All Users requested")
    });
})

app.get("/users/:id/:field", jsonParser, (req, res) => {
    if(req.params.field == "userID"){
        con.query("SELECT * FROM users WHERE userID = '" + req.params.id + "'", function(err, ress) {
            if(err) throw err;
            res.json(ress);
        });
    }else if(req.params.field == "ID"){
        con.query("SELECT * FROM users WHERE id = '" + req.params.id + "'", function(err, ress) {
            if(err) throw err;
            res.json(ress);
        });
    }
})

// ID atribute und all day muss extra gehandelt werden.
app.post("/events", jsonParser, (req, res) => {
    let eventID;
    con.query("INSERT INTO events(userID, title, location, organizer, start, end, statusId, allday, webpage, extra) VALUES('"+ req.body.userID + "','" + req.body.title + "','" + req.body.location + "','" + req.body.organizer + "','" + req.body.start + "','" + req.body.end + "','" + req.body.status + "','" + req.body.allday + "','" + req.body.webpage + "','" + req.body.extra +"')", function(err, result) {
        if(err) throw err;
        console.log("Event added");
        console.log(req.body.categories[0]);
        eventID = result.insertId;
        res.json(req.body);
        for (var i = 0, len = req.body.categories.length; i< len; i++){
            con.query("INSERT INTO eventcategories(eventID, categoryID) VALUES('"+ eventID + "','" + req.body.categories[i].id + "')", function (err) {
                if(err) throw err;
            });
        }
    });
    })

app.get("/events/:id", jsonParser, (req, res) => {
    con.query("SELECT * FROM events WHERE userID = '" + req.params.id + "'", function(err, ress){
        if(err) throw err
        res.json(ress);
        console.log("All events requested " + req.params.id);
    });
})


app.delete("/events/:id", jsonParser, (req, res) => {
    con.query("DELETE FROM events WHERE id = '" + req.params.id + "'", function(err, ress){
        if(err) throw err
        console.log("Removed envent with id: " + req.params.id);
        res.send()
    });
})

app.put("/events/:id", jsonParser, (req, res) => {
    //UPDATE table_name
    //SET column1 = value1, column2 = value2, ...
    //WHERE condition;
    con.query("", function(err, ress){
        if(err) throw err
        console.log("Updated envent with id: " + req.params.id);
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

    con.query("INSERT INTO groups(name) VALUES('" + req.body.name + "')", function(err, ress){
        if(err) throw err
        console.log("Group added")
        res.json()
    })
})

app.post("/usersgroup", jsonParser, (req, res) => {
    con.query("INSERT INTO usergroup(userID, groupID) VALUES('" + req.body.userID + "','" + req.body.groupID + "')", function(err, ress) {
        if(err) throw err;
        console.log("Added User "+ req.body.userID +" To Group" + req.body.groupID)
        res.json(ress);
    });
})

app.get("/usersgroup/:id", jsonParser, (req, res) => {
    con.query("SELECT * FROM usergroup WHERE groupID = '" + req.params.id + "'", function(err, ress){
        if(err) throw err
        console.log("Requested user group with groupId: " + req.params.id);
        res.send(ress)
    });
})

app.delete("/usersgroup/:userID/:groupID", jsonParser, (req, res) => {
    con.query("DELETE FROM usergroup WHERE userID = '" + req.params.userID + "' and groupID = '" + req.params.groupID + "'", function(err, ress) {
        if(err) throw err;
        console.log("Deleted User From Group")
        res.json(ress);
    });
})

app.get("/categories", jsonParser, (req, res) => {
    con.query("SELECT * FROM categories", function(err, ress){
        if(err) throw err
        res.json(ress);
        console.log("All categories requested");
    });
})

app.post("/categories", jsonParser, (req, res) => {
    con.query("INSERT INTO categories(name) VALUES('" + req.body.name + "')", function(err, ress){
        if(err) throw err
        console.log("Categorie added")
        res.json()
    })
})

app.delete("/categories/:id", jsonParser, (req, res) => {
    con.query("DELETE FROM categories WHERE id = '" + req.params.id + "'", function(err, ress){
        if(err) throw err
        console.log("Categorie added")
        res.json()
    })
})

app.get("/eventcategories/:eventid",jsonParser, (req, res) => {
    con.query("SELECT * FROM eventcategories WHERE eventID = '" + req.params.eventid + "'", function(err, ress){
        if(err) throw err
        console.log("EventID requested, " +req.params.eventid)
        res.json(ress)
    })
})

app.listen(port, () => console.log('Calender App listening on port ' + port + '!'))

