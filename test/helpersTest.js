const assert = require('chai');
const emailChecker = require('../helpers.js');

const testUsers = {
  "Juan": {
    user_id: "Juan",
    email: "1@1.com",
    password: "1"
  },
  "Toussaint": {
    user_id: "Toussaint",
    email: "2@2.com",
    password: "2"
  }
};

describe('emailChecker', function() {
  it("should return a user with valid email", function() {
    const user = emailChecker("1@1.com", users)
    const expectedOutput = "1@1.com";
    assert.equal(user, expectedOutput)
  });

  it("should return an error when email exists but passwor wasn't implemented", function() {
    const user = emailChecker("1@2.com", users)
    const expectedOutput = res.status(400).send(`400 Bad Request. ${email} is already registered. Please use it to log in.`);
    assert.equal(user, expectedOutput)
  });
});