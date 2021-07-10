const express = require("express");
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const morgan = require("morgan");
const bcrypt = require('bcrypt');
const assert = require('chai');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.urlencoded({
  extended: true}
  ));
// app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ["key1"]
}))
app.use(morgan('dev'));

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", user_id: "Juan"},
  "9sm5xK": {longURL: "http://www.google.ca", user_id: "Juan"},
  "b6UTxQ": {longURL: "https://www.channelnewsasia.com/", user_id: "Juan"},
  "i3BoGr": {longURL: "https://www.bbc.co.uk/", user_id: "Juan"},
  "z7gyG4": {longURL: "https://www.france24.com/fr/", user_id: "Juan"}
};

const users = {
  "Juan": {
    user_id: "Juan",
    email: "1@1.com",
    // type in the number "1" on the input bar to input the hash printed below
    password: "$2b$10$eEO74HN9atOO5oBb1Uz9TujECcCW3UmFJWfvIgz40nlCxFji7AXXS"
  },
  "Toussaint": {
    user_id: "Toussaint",
    email: "2@2.com",
    // same as ln 28 but input the number "2" instead
    password: "$2b$10$0ITqH9dFfHlxE6/Un6WhwOjvLLlCIMjJyUJdrbBb00jHkRAbKvtAi"
  }
};

// for generating short URLs
function generateRandomString() {
  let result = "";
  const inputChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charLength = inputChars.length;
  const length = 8;
  for (i = 0; i < length; i = i + 1) {
    result += inputChars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}

// check if an email is already registered
const emailChecker = (email, users) => {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user];
    }
  } return false;
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
    user_id: req.session.user_id
  };
  if (templateVars.user_id) {
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
    user_id: req.session.user_id,
    urls: urlDatabase,
    user: users[req.session.user_id]
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
    user_id: req.session.user_id
  };
  // console.log("128", longURL);
  res.render("urls_shows", templateVars);
});

// GET register: register page
app.get("/register", (req, res) => {
  if (!req.session) {
    return res.redirect("/login");
  }
  const templateVars = {
    user_id: req.session["user_id"],
  };
  res.render("urls_register", templateVars);
});

// GET login: login page
app.get("/login", (req, res) => {
  const templateVars = {
    email: "",
    user_id: req.session.user_id
  };
  res.render("urls_login", templateVars);
}
);

// POST fxns
app.post("/urls/:shortURL", (req, res) => {
  //Create if logic to abort if undefined, return 404 or some error
  urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;
  res.redirect(302, '/urls');
});

// POST MyURLs page: generate a short URL
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    user_id: req.session.user_id,
  }
  res.redirect(`urls/${shortURL}`)
});

// Delete short URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  console.log(shortURL);
  res.redirect("/urls")
});

// POST register
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user_id = generateRandomString(8);
  // console.log("email=", email, "password", password);
  // was email and pwd provided
  if (!email || !password) {
    return res.status(400).send("400 Bad Request. Enter a valid email and password");
  }
  // does the user already exist
  if (emailChecker(email, users)) {
    return res.status(400).send(`400 Bad Request. ${email} is already registered. Please use it to log in.`);
  }

  // register pwd w/ hash if new user
    bcrypt.genSalt(10, (err, salt) => {

      // bcrypt.hash  bcrypt.hashSync
      bcrypt.hash(password, salt, (err, hash) => {
        const newUser = {
          user_id: user_id,
          email: email,
          password: hash
        }
        req.session.user_id = newUser.user_id;
        users[user_id] = newUser;
        console.log(users);
        res.redirect("/urls");
      })
    });
  }
);

// POST login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(403).send("Error 403 Bad Request. Please enter your user_id and password");
  } else if (!emailChecker(email, users)) {
    res.status(403).send("Error 403 Bad Request. Email not registered.");
  } else {
    const user = emailChecker (email, users)
    console.log("user", user);
      if (bcrypt.compareSync(password, user.password)) {
        // req.session --> { user_id: 'fjdksl' }

        req.session.user_id = user.user_id;
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