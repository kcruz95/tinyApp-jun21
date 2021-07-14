// for generating randomised short URLs
function generateRandomString(desiredLength) {
  let result = "";
  const inputChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charLength = inputChars.length;
  const length = desiredLength;
  for (i = 0; i < length; i = i + 1) {
    result += inputChars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
};

// checks if an email is already registered
const emailChecker = (email, database) => {
  const users = Object.keys(database);
  console.log(`Users: ${users}`);
  for (user of users) {
    if (email === database[user].email) {
      return database[user];
    }
  }
  return null;
};

// stops another user from altering/deleting another user's URLs
const loginStop = (req, res, urlDatabase) => {
  if (req.session.userId !== urlDatabase[req.params.shortURL].userId) {
    res.status(403).send("Error 403 Bad Request. Cannot alter another user's URLs. Login as said user to do so.");
    return false;
  }
  return true;
};

module.exports = {
  generateRandomString,
  emailChecker,
  loginStop
};