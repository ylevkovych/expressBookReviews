const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send({message: "User successfully logged in"});
  } else {
    return res.status(401).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let book = books[req.params.isbn];
  if (book) {
    let action = "";
    if (book.reviews[req.session.authorization.username]) {
      action = "updated";
    } else {
      action = "added";
    }
    book.reviews[req.session.authorization.username] = req.body.review;
    return res.status(200).send({message: "Review has been "+action+"."});
  }
  
  return res.status(404).send({message: "Book with isbn "+req.params.isbn+" has not been found."});
  
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let book = books[req.params.isbn];
  if (book) {
    let sessionUsername = req.session.authorization.username;
    if (book.reviews[sessionUsername]) {
      delete book.reviews[sessionUsername];
      return res.status(200).send({message: "Review has been removed."});
    }
    return res.status(404).send({message: "Review by user "+sessionUsername+" has not been found."});
  }
  
  return res.status(404).send({message: "Book with isbn "+req.params.isbn+" has not been found."});
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
