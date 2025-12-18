const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(404).json({ message: "Username or password not provided" });
    }

    // Check if user exists and password matches
    const user = users.find(
        user => user.username === username && user.password === password
    );

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const accessToken = jwt.sign(
        {username: username},
        "access",
        {expiresIn:"1h"}
    )

    req.session.authorization = {
        accessToken,
        username
    }

    return res.status(200).json({ message: "Customer successfully logged in" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if(!review){
    return res.status(400).json({ message: "Review not provided" });
  }

  if(!books[isbn]){
    return res.status(404).json({ message: "Book not found" });
  }

  if(!books[isbn].reviews){
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review

  return res.status(200).json({
    message: "Review successfully added/updated",
    reviews: books[isbn].reviews
});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
