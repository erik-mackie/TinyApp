"use strict"

var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const randomNumber = require("./randomNumber");

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {

  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
   };

  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const randomKey= randomNumber();
  console.log(req.body);  // debug statement to see POST parameters
  urlDatabase[`${randomKey}`] = req.body["longURL"];
  console.log(urlDatabase)
  let templateVars = { urls: urlDatabase };
  res.redirect(`urls/${randomKey}`);

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

