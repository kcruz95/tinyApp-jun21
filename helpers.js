// for generating randomised short URLs
function generateRandomString() {
  let result = "";
  const inputChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charLength = inputChars.length;
  const length = 8;
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
      return users[user];
    }
  }
  return null;
};

module.exports = generateRandomString;
module.exports = emailChecker;