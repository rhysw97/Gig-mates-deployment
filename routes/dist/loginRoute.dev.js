"use strict";

var express = require("express");

var router = express.Router(); //app.use('/login', loginRoute )

router.post('/', function (request, response) {
  var body = request.body;
  waitForLoginDetails(body, response, request);
}); //waits for login details and checks they have been accepted. Sends True or false back to user

function waitForLoginDetails(data, response, request) {
  var currentUser, loginData, _data;

  return regeneratorRuntime.async(function waitForLoginDetails$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //
          currentUser = request.app.locals.user;
          _context.next = 3;
          return regeneratorRuntime.awrap(currentUser.checkLoginDetails(data));

        case 3:
          loginData = _context.sent;
          console.log(loginData);

          if (loginData.accepted) {
            request.session.username = loginData.username;
            _data = {
              username: loginData.username,
              loggedin: true
            };
            console.log('data', _data);
            response.send(_data);
          } else {
            response.send({
              loggedin: false
            });
          }

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
} //destroys session which also removes it from database


router.post('/logout', function (request, response) {
  request.session.destroy();
}); //checks for user login details

router.get('/checkLoggedIn', function (request, response) {
  if (request.session.username) {
    console.log(request.session);
    response.send({
      username: request.session.username
    });
  } else {
    response.send({
      username: false
    });
  }
});
module.exports = router;