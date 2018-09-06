"use strict"

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); //parses incoming request bodys, get information from forms submition
const utilities = require("./utilities");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser());

let urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

let users = {
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
console.log(users)
// home pagevar cookieParser = require('cookie-parser')
app.get("/", (req, res) => {
  res.send("Hello!");
});

//render listpage
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    users: req.cookies["user_id"]
  };
  res.render("urls_index", templateVars);
});

// render new page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    users: req.cookies["user_id"]
  };
  res.render("urls_new", templateVars);
});

//if short url is passed, redirect to longUrl
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

  // render register page
app.get('/register', (req, res) => {
  res.render("user_registration");
})

// display form for editing Url
app.get("/urls/:id", (req, res) => {

  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    users: req.cookies["user_id"]
  };

  res.render("urls_show", templateVars);
});

//
app.post("/urls", (req, res) => {
  const randomKey = utilities.randomNumber();
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
  res.redirect("urls");s
});

// logout and delete cookie
app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect("urls");
});

//handle register data
app.post('/register', (req, res) => {
  let randomID = utilities.randomNumber();
  if (req.body['email'] === undefined || req.body['password'] === undefined ) {
    res.status(400);
    res.send("Missing email, or password");
  } else if (utilities.searchUsers(users, 'email', req.body['email'])) {
    res.status(400);;
    res.send("Email, already exists");
  } else {
    users[randomID] = {
      id: `${randomID}`,
      email: req.body['email'],
      password: req.body['password']
    };
    console.log(users)
    res.cookie('user_id', randomID);
    res.redirect("/urls");
  }
})


// start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



// logout endpoint clears cookie. use clearcookie API DOC





//started at 445 - 7

