const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", user_id: "dm3"},
  "9sm5xK": {longURL: "http://www.google.com", user_id: "dm3"},
  "b6UTxQ": {longURL: "https://www.tsn.ca", user_id: "dm3"},
  "i3BoGr": {longURL: "https://www.google.ca", user_id: "dm3"}
};

function generateRandomString() {
  // let result = "";
  // const inputChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // const charLength = inputChars.length;
  // const length = 8;
  // for (i = 0; i < length; i = i + 1) {
  //   result += inputChars.charAt(Math.floor(Math.random() * charLength));
  // }
  // return result;
}

// GET POST fxns

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: longURL,
    user_id: req.cookies.user_id
  };
  console.log("104", longURL);
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    user_id: req.cookies.user_id,
  }
  res.redirect(`urls/${shortURL}`)
});