const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return !(!username || username.trim().length === 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return !!users.find((u) => u.username === username && u.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!isValid(username) || !isValid(password)) {return res.send("Please enter valid username and password");}
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: {username: username, password: password}},
        'access',
        {expiresIn: '1h'}
    )
    req.session.authorization = {accessToken}
    return res.status(200).json({message: "Customer successfully logged in"});
  }
  return res.status(403).json({message: "Incorrect username or password"});

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
