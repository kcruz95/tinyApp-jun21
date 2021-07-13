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
    // same as ln 37 but input the number "2" instead
    password: "$2b$10$0ITqH9dFfHlxE6/Un6WhwOjvLLlCIMjJyUJdrbBb00jHkRAbKvtAi"
  }
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


module.exports = {
  generateRandomString,
  emailChecker
};