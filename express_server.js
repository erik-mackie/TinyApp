"use strict"

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); //parses incoming request bodys, get information from forms submition
const randomNumber = require("./randomNumber");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser());

var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// home pagevar cookieParser = require('cookie-parser')
app.get("/", (req, res) => {
  res.send("Hello!");
});

//render listpage
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

// render new page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

//if short url is passed, redirect to longUrl
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
  // register page
app.get('/register', (req, res) => {

  res.render("user_registration");
})

// display form for editing Url
app.get("/urls/:id", (req, res) => {

  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };

  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  const randomKey = randomNumber();
  urlDatabase[randomKey] = req.body["longURL"];
  res.redirect(`urls/${randomKey}`); // redirect too created page

});

// delete a url
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

//update an url
app.post('/urls/:id', (req, res) => {
    let updatedUrl = req.body["update"];
    urlDatabase[req.params.id] = updatedUrl;
    res.redirect("/urls");
});

//login and create cookie
app.post('/login', (req, res) => {
  res.cookie('username', req.body["username"]);
  res.redirect("urls");
});

// logout and delete cookie
app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect("urls");
});

// start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



// logout endpoint clears cookie. use clearcookie API DOC





//started at 445