const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let temp = users.filter((user) => user.username === username);
    if(temp.length > 0)
        return true;
    else
        return false;
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!doesExist(username)){
        users.push({"username" : username, "password" : password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    }else{
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let filtered_authors = Object.values(books).filter(book => book.author === author);
  if(filtered_authors.length > 0)
    return res.status(200).json(filtered_authors);
  return res.status(404).json({message : "not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
  let filtered_titles = Object.values(books).filter(book => book.title === title);
  if(filtered_titles.length > 0)
    return res.status(200).json(filtered_titles);
  return res.status(404).json({message : "not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let book = books[req.params.isbn];
    return res.status(200).json({"Review" : book.reviews});
});

module.exports.general = public_users;
