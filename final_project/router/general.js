const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


// Task 10: Get the book list available in the shop using async/await with Axios
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/async/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 12: Get book details based on Author using async/await with Axios
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;
  
    try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

// Task 13: Get book details based on Title using async/await with Axios
public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title;
  
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  


public_users.post("/register", (req,res) => {
  const {username, password} = req.body

  if(!username || !password){
    return res.status(400).json({
        message: "Username and password are required"
      });
  }

  const userExists = users.some(user => user.username === username);

  if(userExists){
    return res.status(409).json({
        message: "Username already exists"
      });
  }
  users.push({username, password});
  return res.status(201).json({
    message: "User successfully registered"
  });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]
  if(book){
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else{
    return res.status(404).json({message:"Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  let result = [];
  
  for(let key in books){
    if(books[key].author.toLowerCase() === author){
        result.push(books[key])
    }
  }
    if(result.length > 0){
        return res.status(200).json(result);
    } else{
        return res.status(404).json({message:"Book not found"});
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    let result = [];
  
    for (let key in books) {
      if (books[key].title.toLowerCase() === title) {
        result.push(books[key]);
      }
    }
  
    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

module.exports.general = public_users;
