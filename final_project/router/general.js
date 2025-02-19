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
public_users.get('/', async function (req, res) {
    try {
      const response = await Promise.resolve(books);
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching the book list." });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const response = await Promise.resolve(books[isbn]); 
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching the book details." });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      let author = req.params.author;
      const response = await Promise.resolve(
        Object.values(books).filter(book => book.author === author)
      );
      
      if (response.length > 0) {
        return res.status(200).json(response);
      }
      return res.status(404).json({ message: "Not found" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching books by author." });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      let title = req.params.title;
      const response = await Promise.resolve(
        Object.values(books).filter(book => book.title === title)
      );
      
      if (response.length > 0) {
        return res.status(200).json(response);
      }
      return res.status(404).json({ message: "Not found" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching books by title." });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let book = books[req.params.isbn];
    return res.status(200).json({"Review" : book.reviews});
});

module.exports.general = public_users;
