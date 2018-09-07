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
  },
};

// home pagevar cookieParser = require('cookie-parser')
app.get("/", (req, res) => {
  res.render("welcome");
});


//render listpage
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase[req.cookies['user_id']],
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});


// render new page
app.get("/urls/new", (req, res) => {
  // check to see if user is logged in
  if (utilities.searchUsers(users, "id", req.cookies['user_id'])) {
  let templateVars = {
    user: users[req.cookies["user_id"]]
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
    res.status(403);
  }
});

  // render register page
app.get('/register', (req, res) => {
  res.render("user_registration");
});


// render login page
app.get('/login', (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("user_login", templateVars);
});


// display form for editing Url
app.get("/urls/:id", (req, res) => {
   let templateVars = {
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id],
      user: users[req.cookies["user_id"]],
      belongToUser: false
    };

  let inUserObject = utilities.checkBelongsToUser(urlDatabase, req.params.id, req.cookies['user_id']);
  // if in another users data object, show alert on page
  if (req.params.id !== inUserObject ) {
      templateVars.belongToUser = true;
  }

  res.render("urls_show", templateVars);
});


//create URL and redirect to edit page
app.post("/urls", (req, res) => {
  const randomKey = utilities.randomNumber();
  // check if database has existing user and create if not
  if (!urlDatabase.hasOwnProperty(req.cookies['user_id'])) {
    urlDatabase[req.cookies["user_id"]] = {};
    urlDatabase[req.cookies["user_id"]][randomKey] = req.body["longURL"];
  } else {
    // if exists, add to object
    urlDatabase[req.cookies["user_id"]][randomKey] = req.body["longURL"];
  }
  console.log(urlDatabase)
  res.redirect(`urls/${randomKey}`); // redirect too created page eventualy

});


// delete a url
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.cookies['user_id']][req.params.id];
  res.redirect("/urls");
});


//update an url
app.post('/urls/:id', (req, res) => {
  let updatedUrl = req.body["update"];
  urlDatabase[req.params.id] = updatedUrl;
  res.redirect("/urls");
});
//error code 403 fosearchUsers(users, 'email', req.body['email']))r forbidden
// compare if params :id is in the current users directory based off cookie


//login and create cookie
app.post('/login', (req, res) => {
  // find if long user email exists and if so, if password matches
let hasEmail = utilities.searchUsers(users, 'email', req.body['email']);
let hasPassword = utilities.searchUsers(users, 'password', req.body['password']);

  if (hasEmail && hasPassword) {
      //turn object into array
      // can just use search users??
      // can just use search users??
      // can just use search users??
      let usersArray = Object.keys(users).map(user => {
        return users[user];
      });
      // filter object for entry
      let currentUser = usersArray.filter(user => {
        return user.email === req.body['email'];
      })[0];
      // can just use search users??
      // can just use search users??
      // can just use search users??
      console.log(urlDatabase)
      res.cookie('user_id', currentUser['id']);
      res.redirect('/urls');
    } else {
      let errorMessage = !hasEmail ? 'Incorrect Email' : 'Incorrect Password';
      res.status(403);;
      res.send(errorMessage);
    }
});


// logout and delete cookie
app.post('/logout', (req, res) => {
  res.clearCookie('user_id')
  res.redirect("urls");
});

//refactor if else

//handle register data create cookie
app.post('/register', (req, res) => {
  let randomID = utilities.randomNumber();
  if (!req.body['email'] || !req.body['password']) {
    res.status(400);
    res.send("Missing email, or password");
  } else if (utilities.searchUsers(users, 'email', req.body['email'])) {
    res.status(400);
    res.send("Email, already exists");
  } else {
    users[randomID] = {
      id: `${randomID}`,
      email: req.body['email'],
      password: req.body['password']
    };
    res.cookie('user_id', randomID);
    res.redirect("/urls");
  }
})


// start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




// urls page will need to filter data base

// urls/:id should display a message if the user isnt logged in, or if the url with the matching

// :id doesnt belong to them

//

