const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const isUser = users.find((user) => user.username === username);

  return isUser !== undefined;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  if (!isValid(username)) {
    return false;
  }

  const isUser = users.find((user) => user.username === username && user.password === password);

  return isUser !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in."});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).json({ message: "User successfully logged in." });
  } else {
    return res.status(404).json({ message: "Invalid login. Check username and password."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const bookNum = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  const keys = Object.keys(books);
  const length = keys.length;

  if (books[bookNum]) {
    books[bookNum].reviews[username] = review;
    return res.json(books[bookNum].reviews);
  }

  return res.json({ message: "Couldn't add review."});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const bookNum = req.params.isbn;
  const user = req.session.authorization.username;

  if (books[bookNum]) {
    if (books[bookNum].reviews[user]) {
      delete books[bookNum].reviews[user];
      return res.status(200).json({
        message: "Review deleted.",
        reviews: books[bookNum].reviews
      });
    } else {
      return res.status(404).json({ message: "Review not found."});
    }
  } else {
    return res.status(404).json({ message: "Book not found."});
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
