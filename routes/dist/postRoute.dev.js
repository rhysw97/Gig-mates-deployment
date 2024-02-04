"use strict";

var express = require("express");

var router = express.Router();

var _require = require('../components/post'),
    addNewPost = _require.addNewPost,
    getPosts = _require.getPosts,
    likePost = _require.likePost,
    unlikePost = _require.unlikePost,
    commentOnPost = _require.commentOnPost,
    viewComments = _require.viewComments,
    editPost = _require.editPost,
    deletePost = _require.deletePost,
    addNewEventPost = _require.addNewEventPost,
    getEventPosts = _require.getEventPosts;

var _require2 = require("mongoose"),
    get = _require2.get; //post route to add new post to database


router.post('/', function (request, response) {
  var data = request.body;
  var newPost = {
    username: request.session.username,
    post: data.message
  }; //calls function to add post to database

  addNewPost(newPost); //sends object to client to signal post has been added has been accepted

  response.send({
    accepted: true
  });
}); //route to get route from database

router.get('/recentPosts', function (request, response) {
  getRecentPosts(5, response, request.app.locals.user);
}); //post route to get an events posts //sending data as a url param didn't work so I used a post route for ease

router.post('/eventPosts', function (request, response) {
  console.log(request.body.id); //calls function to get the last five posts with from the event with the id sent from client

  getRecentEventPosts(5, request.body.id, response, request.app.locals.user);
}); //post route to create an event post

router.post('/createEventPost', function (request, response) {
  var data = request.body;
  var newPost = {
    username: request.session.username,
    message: data.message,
    eventId: data.id
  }; //adds new event post to database

  addNewEventPost(newPost);
  response.send({
    accepted: true
  });
}); //post route to add a like to a post

router.post('/likePost', function (request, response) {
  //adds like from current user to database of the post with id matching the post id recieved from client
  likePost(request.body.postId, request.session.username);
}); //post route to unlike a post and remove like from post with id matching id sent by the client
//also removes name from posts likedby array

router.post('/unlikePost', function (request, response) {
  unlikePost(request.body.postId, request.session.username);
}); //post route to update the posts content if the post id matches the id sent by client

router.post('/updatePost', function (request, response) {
  console.log(request.body);
  editPost(request.body.postId, request.body.message, request.session.username, response);
}); //delete route to delete post 

router["delete"]('/deletePost', function (request, response) {
  var postID = request.headers.postid;
  deletePost(postID, request.session.username, response);
});
router.post('/comment', function (request, response) {
  console.log('NEW Comment', request.body);
  console.log('name', request.session.username);
  commentOnPost(request.body.postId, request.session.username, request.body.message, request);
  response.send({
    accepted: true
  });
});
router.post('/viewComments', function _callee(request, response) {
  var comments;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(viewComments(request.body.postId));

        case 2:
          comments = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(getCurrentProfilePictures(comments.comments, 'user', request.app.locals.user));

        case 5:
          comments.comments = _context.sent;
          response.send(comments);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});

function getRecentPosts(numberOfPosts, response, user) {
  var recentPosts;
  return regeneratorRuntime.async(function getRecentPosts$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getPosts(numberOfPosts));

        case 2:
          recentPosts = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(getCurrentProfilePictures(recentPosts, 'postedBy', user));

        case 5:
          recentPosts = _context2.sent;
          response.send(recentPosts);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function getRecentEventPosts(numberOfPosts, eventId, response, user) {
  var recentEventPosts;
  return regeneratorRuntime.async(function getRecentEventPosts$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(getEventPosts(numberOfPosts, eventId));

        case 2:
          recentEventPosts = _context3.sent;
          _context3.next = 5;
          return regeneratorRuntime.awrap(getCurrentProfilePictures(recentEventPosts, 'postedBy', user));

        case 5:
          recentEventPosts = _context3.sent;
          response.send(recentEventPosts);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function getCurrentProfilePictures(arrayToChange, fieldName, user) {
  var uniqueNamesSet, profilePictures, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name, userPicture;

  return regeneratorRuntime.async(function getCurrentProfilePictures$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          uniqueNamesSet = new Set(arrayToChange.map(function (item) {
            return item[fieldName];
          }));
          profilePictures = {};
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 5;
          _iterator = uniqueNamesSet[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context4.next = 16;
            break;
          }

          name = _step.value;
          _context4.next = 11;
          return regeneratorRuntime.awrap(user.returnProfilePicture(name));

        case 11:
          userPicture = _context4.sent;
          profilePictures[name] = userPicture;

        case 13:
          _iteratorNormalCompletion = true;
          _context4.next = 7;
          break;

        case 16:
          _context4.next = 22;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 22:
          _context4.prev = 22;
          _context4.prev = 23;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 25:
          _context4.prev = 25;

          if (!_didIteratorError) {
            _context4.next = 28;
            break;
          }

          throw _iteratorError;

        case 28:
          return _context4.finish(25);

        case 29:
          return _context4.finish(22);

        case 30:
          console.log('Unchanged', arrayToChange);
          arrayToChange.forEach(function (item) {
            item.profilePicture = profilePictures[item[fieldName]];
          });
          console.log('ToChange', arrayToChange);
          return _context4.abrupt("return", arrayToChange);

        case 34:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[5, 18, 22, 30], [23,, 25, 29]]);
}

module.exports = router;