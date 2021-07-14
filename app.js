// Review and experiment with the following simple web server code.

// It consists of a basic HTTP web server that responds with a string containing the request path and method.

const { request, response } = require("express");
const http = require("http");
const PORT = 8080;

// a function which handles requests and sends response
const requestHandler = function(request, response) {
  if(request.url === "/")
  response.end("Welcome!");
};

if (request.url === "urls") {
  response.end("www.lighthouselabs.ca\nwww.google.com")
};

if (response.statusCode = 404) {
  response.end("404 Page Not Found")
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});

/*
Synchronous bcrypt code

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

  VS

Asynchronous bcrypt code
  
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      const newUser = {
        userId: userId,
        email: email,
        password: hash
        };
        req.session.userId = newUser.userId;
        users[userId] = newUser;
        console.log(users);
        res.redirect("/urls");
        });
        });
*/