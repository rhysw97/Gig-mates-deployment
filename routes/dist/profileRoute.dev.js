"use strict";

var express = require("express");

var router = express.Router();

var path = require('path');

var multer = require('multer');

var _require = require("http"),
    request = _require.request; //sets up multer storage and specifies where it will be stored //from Daves app in class


var storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function filename(req, file, cb) {
    var ext = path.extname(file.originalname);
    cb(null, "".concat(Date.now()).concat(ext));
  }
}); //route for edit if user doesn't send back image file

router.post('/edit', multer({
  storage: storage
}).single('file'), function (request, response) {
  console.log('request', request.body);
  var data = {
    username: request.session.username,
    name: request.body.name,
    about: request.body.bio,
    genres: request.body.genres.split(','),
    artists: request.body.artists.split(',')
  };
  console.log('data', data);
  request.app.locals.user.updateProfile(data); //calls update profile function in user class to update the user profile
}); //route for edit profile if user doesn't send back a image file 

router.post('/editWithFile', multer({
  storage: storage
}).single('file'), function (request, response) {
  console.log(request.body);
  var data = {
    username: request.session.username,
    name: request.body.name,
    about: request.body.bio,
    profilePicture: request.file.filename,
    genres: request.body.genres.split(','),
    artists: request.body.artists.split(',')
  };
  console.log('data', data);
  request.app.locals.user.updateProfile(data);
}); //post route to remove a genre

router.post('/remove-genre', function (request, response) {
  removeGenre();
}); //unfinished function was never used

function removeGenre() {
  var data;
  return regeneratorRuntime.async(function removeGenre$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(request.app.locals.user.findOne({
            usename: request.session.username
          }));

        case 2:
          data = _context.sent;
          console.log(data);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
} // Start the server.
//route for getting current users profile data 


router.get('/get-profile', function (request, response) {
  if (request.query.username) {
    request.app.locals.user.getProfileData(request.query.username, response);
  } else {
    request.app.locals.user.getProfileData(request.session.username, response);
  }
}); //route to update password with new password 

router.post('/update-password', function (request, response) {
  console.log(request.body.password);
  request.app.locals.user.updatePassword(request.session.username, request.body.password);
}); //route for getting a users profile picture (contains url param for name)

router.get('/profile-pic', function _callee(request, response) {
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(request.app.locals.user.getProfilePicture(request.session.username, response));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}), router.post('/user-pic', function _callee2(request, response) {
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(request.app.locals.user.getProfilePicture(request.body.username, response));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
});
module.exports = router;