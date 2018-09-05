"use strict"

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); //parses incoming request bodys, get information from forms submition
const randomNumber = require("./randomNumber");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

console.log(urlDatabase);

app.get("/", (req, res) => {
  res.send("Hello!");
});

//render listpage
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// render new page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// display form for editing Url
app.get("/urls/:id", (req, res) => {

  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };

  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  const randomKey = randomNumber();
  urlDatabase[randomKey] = req.body["longURL"];
  console.log(urlDatabase)
  /*let templateVars = { urls: urlDatabase };*/
  res.redirect(`urls/${randomKey}`); // redirect too created page
  /*res.redirect('/urls');*/ //redirect too url list
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
    console.log(urlDatabase)

    res.redirect("/urls");
})

// start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// update once a user submits and update request it should
// modify the corisonding URL and and redirect back to /urls

