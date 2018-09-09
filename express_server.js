"use strict";

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const utilities = require("./utilities");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession({
  secret: 'PleaseKeepThisASecret'
}));

let urlDatabase = {
  'pler31': {
    'b2xVn2': 'http://www.lighthouselabs.ca',
    'ag4gda': 'http://www.google.ca'
  },
  '13d345': {
    '13d5wa': 'http://www.facebook.ca',
    '5sc2fz': 'http://www.whatever.ca'
  }
};

let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  }

};

// home redirects
app.get("/", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {
      urls: urlDatabase[req.session.user_id],
      user: users[req.session.user_id]
    };
    res.render("urls_new", templateVars);
  } else {
    res.render("user_login");
  }
});


//render listpage
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase[req.session.user_id],
    user: users[req.session.user_id]
  };

  res.render("urls_index", templateVars);
});


// render new page
app.get("/urls/new", (req, res) => {
  // check to see if user is logged in
  if (utilities.searchUsers(users, "id", req.session.user_id)) {
    let templateVars = {
      user: users[req.session.user_id]
    };
  res.render("urls_new", templateVars);
  // if not logged in render login page
  }else {
    res.render("user_login");
  }
});


//if short url is passed, redirect to longUrl
app.get("/u/:shortURL", (req, res) => {
  let longUrl = false;
  for (var url in urlDatabase) {
    if(urlDatabase[url][req.params.shortURL]) {
       longUrl = urlDatabase[url][req.params.shortURL];
  }
  }
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.send('Short URL not owned');
  }
});

  // render register page
app.get('/register', (req, res) => {
  let templateVars = {
    urls: urlDatabase[req.session.user_id],
    user: users[req.session.user_id]
  };
  if (req.session.user_id) {
    res.render("urls_index", templateVars);
  } else {
    res.render("user_registration");
  }
});



// render login page
app.get('/login', (req, res) => {
  let templateVars = {
      urls: urlDatabase[req.session.user_id],
      user: users[req.session.user_id]
  };
  if (req.session.user_id) {
    res.render("urls_index", templateVars);
  } else {
    res.render("user_login", templateVars);
  }
})


// display form for editing Url
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    belongToUser: false
  };
  let inUserObject = utilities.checkBelongsToUser(urlDatabase, req.params.id, req.session.user_id);
  // if passed value belongs to user, display
  if (inUserObject) {
    templateVars.shortURL = req.params.id;
    templateVars.longURL = urlDatabase[req.session.user_id][req.params.id],
    templateVars.belongToUser = true;
  // if in another users data object, show alert on page
  } else {
    res.status(403);
    res.send('Short URL not owned');
  }
  res.render("urls_show", templateVars);
});


//create URL and redirect to edit page
app.post("/urls", (req, res) => {
  const randomKey = utilities.randomNumber();
  // check if database has existing user and create if not
  if (!urlDatabase.hasOwnProperty(req.session.user_id)) {
    urlDatabase[req.session.user_id] = {};
    urlDatabase[req.session.user_id][randomKey] = req.body["longURL"];
  } else {
    urlDatabase[req.session.user_id][randomKey] = req.body["longURL"];
  }
  res.redirect(`urls/${randomKey}`);

});


// delete a url
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.session.user_id][req.params.id];
  res.redirect("/urls");
});


//update an url
app.post('/urls/:id', (req, res) => {
  let updatedUrl = req.body["update"];
  urlDatabase[req.session.user_id][req.params.id] = updatedUrl;
  res.redirect("/urls");
});


//login and create cookie
app.post('/login', (req, res) => {
// find if long user email exists
  let userExists = utilities.searchUsers(users, 'email', req.body['email']);
// if user exists check password
  if (userExists) {
    let correctPass = bcrypt.compareSync(req.body['password'], userExists.password);

    if (correctPass) {
      // find user and reset session ID
      let confirmedEmail = utilities.searchUsers(users, 'email', req.body['email'])
      req.session.user_id = confirmedEmail['id'];
      res.redirect('/urls');

    } else {
      res.status(403);
      res.send('Incorrect Password');
    }

  } else {
    res.status(403);
    res.send('Incorrect Email, or does not exist');
  }
});


// logout and delete cookie
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect("urls");
});


//handle register data create cookie
app.post('/register', (req, res) => {
  let randomID = utilities.randomNumber();
  if (!req.body['email'] || !req.body['password']) {
    res.status(400);
    res.send("Missing email, or password");
  } else if (utilities.searchUsers(users, 'email', req.body['email'])) { // refactor// refactor
    res.status(400);
    res.send("Email, already exists");
  } else {
    users[randomID] = {
      id: `${randomID}`,
      email: req.body['email'],
      password: bcrypt.hashSync(req.body['password'], 10)
    };
    req.session.user_id = randomID;
    res.redirect("/urls");
  }
})


// start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



