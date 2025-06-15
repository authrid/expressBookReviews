const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    if (isValid(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const data = await promiseCb((resolve) => {
        const booksList = Object.values(books);
        resolve(booksList);
      }, 3000);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: "Internal server error." });
    }
});

// TASK 10 - Get teh book list available in the shop using Promises
public_users.get('/books', function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
    });
});
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const data = await promiseCb((resolve) => {
        const isbn = req.params.isbn + "";
        const book = books[isbn];
        resolve(book);resolve
      }, 3000);
      if(data){
        return res.status(200).json(data);
      }
      return res.status(404).json({ message: "Invalid ISBN" });
    } catch (error) {
      return res.status(404).json({ message: "Internal server error." });
    }
});

public_users.get('books/isbn/:isbn', function (req, res) {
    const get_books_isbn = new Promise((resolve, reject)  => {
        const isbn = req.params.isbn;
        if (req.params.isbn <= 10) {
            resolve(res.send(books[isbn]));
        } else {
            reject(res.send("ISBN not found"));
        }
    });
    get_books_isbn.then(function (){
        console.log("Promise for task 11 is resolved");
    }).catch(function(){
        console.log("ISBN not found");
    });
});
  
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const data = await promiseCb((resolve) => {
            const author = (req.params.author + "").toLocaleLowerCase();
            const booksList = Object.values(books);
            const newBooks = booksList.filter((book) => {
                book.author.toLocaleLowerCase().match(author)
            });
            resolve(newBooks);
        }, 3000);
        if (Array.isArray(data) && data.length) {
            return res.status(200).json(data);
        }
        return res.status(404).json({ message: "Invalid author" });
    }catch (error) {
        return res.status(500).json({ message: "Internal server error." })
    }
});

// TASK 12 - Get book details based on author
public_users.get('/books/author/:author', function (req, res) {
    const get_books_author = new Promise((resolve, reject) => {
        let booksbyauthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["author"] === req.params.author) {
                booksbyauthor.push({
                    "isbn":isbn,
                    "title":books[isbn]["title"],
                    "reviews":books[isbn]["reviews"]
                });
                resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
            }
        });
        reject(res.send("the mentioned author does not exist"));
    });
    get_books_author.then(function(){
        console.log("Promise is resolved");
    }).catch(function () {
        console.log("The mentioned author does not exist");
    });
});
  

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const data = await promiseCb((resolve) => {
            const title = (req.params.title + "").toLocaleLowerCase();
            const booksList = Object.values(books);
            const newBooks = booksList.filter((book) => {
                book.title.toLocaleLowerCase().match(title)
            });
        resolve(newBooks);
      }, 3000);
      if (Array.isArray(data) && data.length) {
        return res.status(200).json(data);
      }
      return res.status(404).json({message: "Invalid title"});
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
});

// TASK 13 - Get all books based on title
public_users.get('/books/title/:title', function (req, res) {
    const get_books_title = new Promise((resolve, reject) => {
        let booksbytitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["title"] === req.params.title) {
                booksbytitle.push({
                    "isbn": isbn,
                    "author": books[isbn]["author"],
                    "reviews":books[isbn]["reviews"]
                });
                resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
            }
        });
        reject(res.send("The mentioned title does not exist"));
    });
    get_books_title.then(function(){
        console.log("Promise is resolved");
    }).catch(function () {
        console.log("The mentioned book doesnt exist");
    });
});
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
