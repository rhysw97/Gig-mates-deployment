"use strict";

var express = require("express");

var router = express.Router();
router.post('/', function (request, response) {
  var body = request.body;
  createUser(response, request, body);
}); //function to create a user

function createUser(response, request, data) {
  var currentUser, isInDatabase;
  return regeneratorRuntime.async(function createUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          currentUser = request.app.locals.user; //stores user instance in current user

          _context.next = 3;
          return regeneratorRuntime.awrap(currentUser.addNewUser(data));

        case 3:
          isInDatabase = _context.sent;

          //calls User's add new users method to add user data into db
          if (!isInDatabase.email && !isInDatabase.username) {
            request.session.username = data.username;
          }

          response.send(JSON.stringify(checks));

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = router;