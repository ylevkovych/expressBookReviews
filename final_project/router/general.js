const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  return userswithsamename.length > 0 ? true : false;
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
 
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. Username and/or password missed."})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    return res.status(200).json(books[req.params.isbn]);
  } else {
    return res.status(404).send("Book with isbn "+req.params.isbn+" not found.");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let filteredByAuthor = [];
  Object.keys(books).forEach(key => {
    if (books[key].author == req.params.author) {
      filteredByAuthor.push(books[key]);
    }
  });
  
  return res.status(200).json(filteredByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let filteredByTitle = [];
  Object.keys(books).forEach(key => {
    if (books[key].title == req.params.title) {
      filteredByTitle.push(books[key]);
    }
  });
  
  return res.status(200).json(filteredByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).send("Book with isbn "+isbn+" not found.");
  }
});

module.exports.general = public_users;
