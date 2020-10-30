const express = require('express');
const app = express();
const port = 3000;
var mysql = require('mysql');

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
    con.query("CREATE DATABASE calendar", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
}

function createUsers(){
    con.query("CREATE TABLE users(id INT(255) UNSIGNED AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)", function(err) {
        if(err) throw err
        console.log("Created Table Users");
    });
}

function createEvents(){
    con.query("CREATE TABLE events(id INT(255) UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL)", function(err) {
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