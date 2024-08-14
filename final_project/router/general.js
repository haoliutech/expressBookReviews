const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
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
        } catch (err) {
            console.log(err);
            res.send("something wrong")
        }
    }
);

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const bookList = await Promise.resolve(books)
        return res.send(JSON.stringify(bookList, null, 4));
    } catch {
        console.error("Fail to retrieve books");
        res.status(500).send('Failed to retrieve books');
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    //Write your code here
    const isbn = req.params['isbn']
    try {
        const filtered_books = await new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book)
            } else {
                reject("Book not found")
            }
        })
        return res.send(JSON.stringify(filtered_books, null, 4));

    } catch (error) {
        return res.status(500).send(error)
    }

});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const filtered_books =
            await new Promise((resolve, reject) => {
                const author = req.params['author']
                const filtered =
                    Object.entries(books)
                        .filter(([isbn, details]) => details.author.toLowerCase() === author.toLowerCase())
                        .map(([isbn, {author, details}]) => ({isbn, ...details}))
                if (filtered && filtered.length > 0) {
                    resolve(filtered)
                } else {
                    reject("Authors not found")
                }
            })
        return res.send(JSON.stringify({"booksbyauthor": filtered_books}, null, 4));
    }
    catch (error){
        return res.status(500).send(error)
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params["title"]
        const filtered_books = await new Promise((resolve, reject) => {
            const filtered = Object.entries(books)
                .filter(([isbn, detail]) => (detail["title"].toLowerCase() === title.toLowerCase()))
                .map(([isbn, {title, ...detail}]) => ({isbn, ...detail}))
            if (filtered && filtered.length > 0) {
                resolve(filtered)
            }
            else {
                reject("Title not found")
            }
        })
        return res.send(JSON.stringify({"booksbytitle" : filtered_books}, null, 4));
    }

    catch(error){
        return res.status(500).send(error)
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    if (Object.keys(books).includes(req.params["isbn"])) {
        const filtered_review = Object.entries(books)
            .filter(([isbn, detail]) => (isbn === req.params["isbn"]))
            .map(([isbn, {review, ...detail}]) => ({review}))
        return res.send(JSON.stringify(filtered_review.values(), null, 4))
    }
    return res.status(300).json({message: "No review found"});
});

module.exports.general = public_users;
