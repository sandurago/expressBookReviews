const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).send({ message: "User or password not provided."})
  }

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      return res.status(404).send({ message: "User already exists."});
    }
  }

  users.push({ "username": username, "password": password});

  return res.status(200).json({ message: "User successfully registered."});
});

// Get the book list available in the shop (10)
public_users.get('/',function (_req, res) {
  let promise = new Promise((resolve, _reject) => {
    resolve(books);
  })

  promise.then(
    (books) => res.status(200).send(JSON.stringify({books},null,4))
  )
});

// Get book details based on ISBN (11)
public_users.get('/isbn/:isbn',function (req, res) {
  let promise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error("Book not found."));
    }
  })

  promise.then(
    (book) => res.status(200).json(book),
    (err) => res.status(404).json({ message: "Book not found." })
  )
 });

// Get book details based on author (12)
public_users.get('/author/:author',function (req, res) {
  let promise = new Promise((resolve, reject) => {
    const authorParam = req.params.author;
    const keys = Object.keys(books);
    const length = keys.length;

    for (let i = 0; i < length; i++) {
      const book = books[i];
      let authorBook = book.author;
      const authorConcat = authorBook.replace(/\s/g, '').toLowerCase();
      if (authorParam === authorConcat) {
        resolve(book);
      } else {
        reject(err);
      }
    }
  })

  promise.then(
    (book) => res.status(200).json(book),
    (err) => res.status(404).json({ message: "Author not found." })
  )
});

// Get all books based on title (13)
public_users.get('/title/:title',function (req, res) {
  let promise = new Promise((resolve, reject) => {
    const title = req.params.title;
    const keys = Object.keys(books);
    const length = keys.length;

    for (let i = 0; i < length; i++) {
      const book = books[i];
      let titleBook = book.title;
      const bookConcat = titleBook.replace(/\s/g, '').toLowerCase();

      if (title === bookConcat) {
        resolve(book);
      } else {
        reject(err);
      }
   }
  })

  promise.then(
    (book) => res.status(200).json(book),
    (err) => res.status(404).json({ message: "Title not found."})
  )

  // const title = req.params.title;
  // const keys = Object.keys(books);
  // const length = keys.length;

  // for (let i = 1; i < length; i++) {
  //   const book = books[i];
  //   let titleBook = book.title;
  //   const bookConcat = titleBook.replace(/\s/g, '').toLowerCase();

  //   if (title === bookConcat) {
  //     return res.json(book);
  //   }
  // }
  // return res.send({ message: "Title not found."});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const bookISBN = req.params.isbn;
  const keys = Object.keys(books);
  const length = keys.length;

  for (let i = 0; i <= length; i++) {
    if (keys[i] === bookISBN) {
      return res.json(books[i].reviews);
    }
  }
  return res.send({ message: "Book by ISBN not found."});
});

module.exports.general = public_users;
