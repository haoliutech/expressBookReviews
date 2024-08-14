const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
//write code to check is the username is valid
    return username && username.trim().length > 0;
}

const authenticatedUser = (username, password) => { //returns boolean
//write code to check if username and password match the one we have in records.
    return users.some((u) => u.username === username && u.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!isValid(username) || !isValid(password)) {
        return res.send("Please enter valid username and password");
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {username: username},
            'access',
            {expiresIn: '1h'}
        )
        req.session.authorization = {accessToken}
        return res.status(200).json({message: "Customer successfully logged in"},);
    }
    return res.status(403).json({message: "Incorrect username or password"});

});

// Add a book review
regd_users.put("/auth/review/:isbn",(req, res) => {
    //Write your code here
    const user = req.user.username;
    const review = req.query["review"]
    const isbn = req.params["isbn"];
    const book = books[isbn]
    if (!book) {
        return res.status(404).json({message: "Book not found"});
    }
    if (!review) {
        return res.status(404).json({message: "Review not provided"});
    }
    book["reviews"][user] = {review}
    return res.status(200).json({message: `The review for the book with ISBN ${isbn} has been added/updated`});
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const user = req.user.username;
    const isbn = req.params["isbn"];
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({message: "Book not found"});
    }
    if (!book["reviews"][user]) {
        return res.status(404).json({message: "You have not reviewed this book yet."})
    }
    delete(book["reviews"][user])
    return res.status(200).json({message: `The review for the book with ISBN ${isbn} has been deleted.`});

})



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
