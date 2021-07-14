const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const morgan = require("morgan");
const bcrypt = require('bcrypt');
const { generateRandomString, emailChecker, loginStop } = require('./helpers');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.urlencoded({
  extended: true}
));
app.use(cookieSession({
  name: "session",
  keys: ["key1"]
}));
app.use(morgan('dev'));

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userId: "Juan"},
  "9sm5xK": {longURL: "http://www.google.ca", userId: "Juan"},
  "b6UTxQ": {longURL: "https://www.channelnewsasia.com/", userId: "Juan"},
  "i3BoGr": {longURL: "https://www.bbc.co.uk/", userId: "Juan"},
  "z7gyG4": {longURL: "https://www.france24.com/fr/", userId: "Toussaint"}
};

const users = {
  "Juan": {
    userId: "Juan",
    email: "1@1.com",
    // type in the number "1" on the input bar to input the hash printed below
    password: "$2b$10$eEO74HN9atOO5oBb1Uz9TujECcCW3UmFJWfvIgz40nlCxFji7AXXS"
  },
  "Toussaint": {
    userId: "Toussaint",
    email: "2@2.com",
    // same as ln 37 but input the number "2" instead
    password: "$2b$10$0ITqH9dFfHlxE6/Un6WhwOjvLLlCIMjJyUJdrbBb00jHkRAbKvtAi"
  }
};

// GET fxns

// determine if logged into server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  if (!req.session) {
    return res.redirect("/login");
  }
  const templateVars = {
    urls: urlDatabase,
    userId: req.session.userId
  };
  if (templateVars.userId) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  if (!req.session) {
    return res.redirect("/login");
  }
  const templateVars = {
    userId: req.session.userId,
    urls: urlDatabase,
    user: users[req.session.userId]
  };
  res.render("urls_index", templateVars);
});

// GET short URLs: when you click on the shortened URL link
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: longURL,
    userId: req.session.userId,
    user: users[req.session.userId]
  };
  res.render("urls_shows", templateVars);
});

// GET register: register page
app.get("/register", (req, res) => {
  if (!req.session) {
    return res.redirect("/login");
  }
  const templateVars = {
    userId: req.session["userId"],
  };
  res.render("urls_register", templateVars);
});

// GET login: login page
app.get("/login", (req, res) => {
  const templateVars = {
    email: "",
    userId: req.session.userId
  };
  res.render("urls_login", templateVars);
}
);

// POST fxns
// if !logged in cannot access /urls
app.post("/urls/:shortURL", (req, res) => {
  if (!req.session) {
    return res.redirect("/login");
  }
  // if ! user, can't change other URLs
  if (loginStop(req, res, urlDatabase)) {
    urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;
    res.redirect(302, '/urls');
  }
});

// POST MyURLs page: generate a short URL
app.post("/urls", (req, res) => {
  if (!req.session) {
    return res.redirect("/login");
  }
  console.log(req.body);
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userId: req.session.userId,
  };
  res.redirect(`urls/${shortURL}`);
});

// Delete short URL
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.session) {
    return res.redirect("/login");
  }
  if (loginStop(req, res, urlDatabase)) {
    urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;
    res.redirect(302, '/urls');
  }
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  console.log(shortURL);
  res.redirect("/urls");
});

// POST register
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = generateRandomString();

  // was email and pwd provided
  if (!email || !password) {
    return res.status(400).send("400 Bad Request. Enter a valid email and password");
  }
  // does the user already exist
  console.log(users);
  if (emailChecker(email, users)) {
    return res.status(400).send(`400 Bad Request. ${email} is already registered. Please use it to log in.`);
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const newUser = {
    userId: userId,
    email: email,
    password: hash
  };
  req.session.userId = newUser.userId;
  users[userId] = newUser;
  console.log(users);
  res.redirect("/urls");

  // bcrypt.genSalt(10, (err, salt) => {
  //   bcrypt.hash(password, salt, (err, hash) => {
  //     const newUser = {
  //       userId: userId,
  //       email: email,
  //       password: hash
  //     };
  //     req.session.userId = newUser.userId;
  //     users[userId] = newUser;
  //     console.log(users);
  //     res.redirect("/urls");
  //   });
  // });
});

// POST login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(403).send("Error 403 Bad Request. Please enter your userId and password");
  } else if (!emailChecker(email, users)) {
    res.status(403).send("Error 403 Bad Request. Email not registered.");
  } else {
    const user = emailChecker(email, users);
    console.log("user", user);
    if (bcrypt.compareSync(password, user.password)) {
      req.session.userId = user.userId;
      res.redirect("/urls");
    } else {
      res.status(403).send("Error 403 Bad Request. Incorrect Password!");
    }
  }
});

// POST logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});