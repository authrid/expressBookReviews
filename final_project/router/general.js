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
      const getBooks = () => {
        return new Promise((resolve, reject) => {
          resolve(books);
        });
      };
      const result = await getBooks();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: "Unable to fetch books" });
    }
});
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject("Book not found");
          }
        });
      };
  
      const book = await getBookByISBN(isbn);
      return res.status(200).json(book);
    } catch (error) {
      return res.status(404).json({ message: error });
    }
});
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const booksByAuthor = Object.values(books).filter(
          (book) => book.author.toLowerCase() === author.toLowerCase()
        );
        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
        } else {
          reject("No books found by that author");
        }
      });
    };
  
    getBooksByAuthor(author)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(404).json({ message: error }));
});
  

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
      const getBooksByTitle = (title) => {
        return new Promise((resolve, reject) => {
          const results = Object.values(books).filter(
            (book) => book.title.toLowerCase() === title.toLowerCase()
          );
          if (results.length > 0) {
            resolve(results);
          } else {
            reject("No book found with that title");
          }
        });
      };
  
      const booksByTitle = await getBooksByTitle(title);
      return res.status(200).json(booksByTitle);
    } catch (error) {
      return res.status(404).json({ message: error });
    }
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
