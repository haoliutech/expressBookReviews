const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  try {
  const username = req.body.username;
  const password = req.body.password;
  if (!isValid(username) || !isValid(password)) {
    return res.send("Please enter valid username and password");
  }
  if (users.find(user => user.username === username)) {
    return res.send("The username has been taken");
  }
  users.push({
    "username": username,
    "password": password,
  })
  return res.send("Customer successfully registered. Now you can login");
}
  catch (err) {
    console.log(err);
    res.send("something wrong")
  }
    }
);

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params['isbn']
  const filtered_books = books[isbn]
  if (filtered_books) {
    return res.send(JSON.stringify(filtered_books, null, 4));
  }
  return res.send( `No book found.`);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const filtered_books =
      Object.entries(books)
          .filter(([isbn, detail]) => detail["author"].toLowerCase() === req.params["author"].toLowerCase())
          .map(([isbn, {author, ...detail}]) => ({isbn, ...detail}))
  if (filtered_books.length > 0) {
    return res.send(JSON.stringify({"booksbyauthor": filtered_books}, null, 4));
  }
  return res.status(300).json({message: "No book found."});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  const title = req.params["title"]
  const filtered_books =
      Object.entries(books)
      .filter(([isbn, detail]) => (detail["title"].toLowerCase() === title.toLowerCase()))
      .map(([isbn, {title, ...detail}]) => ({isbn, ...detail}))
  if (filtered_books.length > 0) {
    return res.send(JSON.stringify({"booksbytitle": filtered_books}, null, 4));
  }
  return res.status(300).json({message: "No book found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  if (Object.keys(books).includes(req.params["isbn"])) {
    const filtered_review = Object.entries(books)
        .filter(([isbn, detail]) => (isbn === req.params["isbn"]))
        .map(([isbn, {review, ...detail}]) => ({review}))
    return res.send(JSON.stringify(filtered_review.values(), null, 4))
  }
  return res.status(300).json({message: "No review found"});
});

module.exports.general = public_users;
