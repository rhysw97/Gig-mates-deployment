"use strict";

//view recent posts
var Mongoose = require('mongoose');

var Schema = Mongoose.Schema,
    model = Mongoose.model; //creates new schema for posts indicating the data fields and data types a post should contain

var postSchema = new Schema({
  postedBy: String,
  profilePicture: String,
  message: String,
  eventId: String,
  likes: Number,
  time: Date,
  likedBy: [String],
  tags: [String],
  comments: [{
    user: String,
    commentBy: String,
    message: String,
    time: Date,
    likes: Number,
    profilePicture: String,
    likedBy: [String]
  }]
});
var Post = model('Posts', postSchema); //creates a model of the schema called posts
//function to add a new post with 1 parameter allowing passing in of post data

function addNewPost(postData) {
  //stores data passed into myPost and sets up other fields that may be used 
  var myPost = {
    postedBy: postData.username,
    message: postData.post,
    likes: 0,
    time: Date.now(),
    likedBy: [],
    comments: [],
    eventId: ''
  }; //creates a a new post collection called Posts containing myPost.
  //if collection already exists then it adds the new post into that collection

  Post.create(myPost)["catch"](function (err) {
    console.log("Error: " + err);
  });
} //function to get posts from with a parameter indicating the amount of posts wanted


function getPosts() {
  var n,
      data,
      _args = arguments;
  return regeneratorRuntime.async(function getPosts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          n = _args.length > 0 && _args[0] !== undefined ? _args[0] : 3;
          data = [];
          _context.next = 4;
          return regeneratorRuntime.awrap(Post.find({}).sort({
            'time': -1
          }) //sorts the posts in time added order
          .limit(n).exec().then(function (mongoData) {
            data = mongoData;
          })["catch"](function (err) {
            console.log('Error:' + err);
          }));

        case 4:
          return _context.abrupt("return", data);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
} //function to get a single post by its id and return the post data


function getPost(postid) {
  var data;
  return regeneratorRuntime.async(function getPost$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          data = null;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Post.findById(postid).exec().then(function (mongoData) {
            data = mongoData;
          })["catch"](function (err) {
            console.log('Error:' + err);
          }));

        case 3:
          return _context2.abrupt("return", data);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
} //function to find a post by id and increment the likes by one and add the user who liked it to liked by array


function likePost(likedPostID, likedByUser) {
  return regeneratorRuntime.async(function likePost$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(likedPostID, {
            $inc: {
              likes: 1
            },
            $push: {
              likedBy: likedByUser
            }
          }).exec().then(function (foundData) {
            found = foundData;
            console.log(found);
          }));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
} //function to get post by id and remove 1 from likes and then remove the user who unliked it from array


function unlikePost(likedPostID, likedByUser) {
  return regeneratorRuntime.async(function unlikePost$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(likedPostID, {
            $inc: {
              likes: -1
            },
            $pull: {
              likedBy: likedByUser
            }
          }).exec().then(function (foundData) {
            found = foundData;
            console.log(found);
          }));

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
} //function for user to comment on a post by finding the post by it's id and adding the comment to it's comment array


function commentOnPost(commentedPostID, commentByUser, comment, request) {
  var found, newComment;
  return regeneratorRuntime.async(function commentOnPost$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          newComment = {
            user: commentByUser,
            message: comment,
            likes: 0,
            time: Date.now()
          }; //updates post in database with new comment

          _context5.next = 3;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(commentedPostID, {
            $push: {
              comments: newComment
            }
          }).exec().then(function (foundData) {
            return found = foundData;
          }));

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
} //function to get the comments of a post by finding it by it's Id and returning the posts data (same as getPost really so could be deleted)


function viewComments(postId) {
  var data;
  return regeneratorRuntime.async(function viewComments$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          data = null;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Post.findById(postId).exec().then(function (mongoData) {
            data = mongoData;
          })["catch"](function (err) {
            console.log('Error:' + err);
          }));

        case 3:
          return _context6.abrupt("return", data);

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
} //function to edit post in the database


function editPost(postId, message, currentUser, response) {
  var _found;

  return regeneratorRuntime.async(function editPost$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(checkUserIsPoster(postId, currentUser));

        case 2:
          if (!_context7.sent) {
            _context7.next = 7;
            break;
          }

          _context7.next = 5;
          return regeneratorRuntime.awrap(Post.findByIdAndUpdate(postId, {
            message: message
          }).exec().then(function (foundData) {
            return _found = foundData;
          }));

        case 5:
          _context7.next = 8;
          break;

        case 7:
          //if user didn't post send not authorized error code
          response.sendStatus(403);

        case 8:
        case "end":
          return _context7.stop();
      }
    }
  });
} //function to check that a user is the poster takes the post id and the current users name


function checkUserIsPoster(postId, currentUser) {
  var result, data;
  return regeneratorRuntime.async(function checkUserIsPoster$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(Post.findById(postId).exec().then(function (mongoData) {
            data = mongoData; //turnery statement to check if the current user matches the postedBy field in database and stores in result whether this is true or false

            result = data.postedBy === currentUser ? true : false;
          })["catch"](function (err) {
            console.log('Error:' + err);
            result = 400;
          }));

        case 2:
          return _context8.abrupt("return", result);

        case 3:
        case "end":
          return _context8.stop();
      }
    }
  });
} //function to delete a post


function deletePost(postId, currentUser, response) {
  var isUserPoster;
  return regeneratorRuntime.async(function deletePost$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(checkUserIsPoster(postId, currentUser));

        case 2:
          isUserPoster = _context9.sent;

          if (!(isUserPoster === true)) {
            _context9.next = 9;
            break;
          }

          _context9.next = 6;
          return regeneratorRuntime.awrap(Post.findByIdAndDelete(postId));

        case 6:
          console.log('Deleted');
          _context9.next = 10;
          break;

        case 9:
          if (isUserPoster === false) {
            //if they didn't send not authorized code
            response.sendStatus(403);
          } else {
            //send that the user is the poster
            response.send(isUserPoster);
          }

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  });
} //function to add a new event post to the post collection. similar to add new post


function addNewEventPost(postData) {
  var myPost;
  return regeneratorRuntime.async(function addNewEventPost$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          myPost = {
            postedBy: postData.username,
            message: postData.message,
            likes: 0,
            time: Date.now(),
            likedBy: [],
            comments: [],
            eventId: postData.eventId //only difference is it adds the events id to eventId field

          };
          console.log(myPost);
          Post.create(myPost)["catch"](function (err) {
            console.log("Error: " + err);
          });

        case 3:
        case "end":
          return _context10.stop();
      }
    }
  });
} //gets only posts with eventId field matching event id


function getEventPosts() {
  var n,
      eventId,
      data,
      eventPosts,
      _args11 = arguments;
  return regeneratorRuntime.async(function getEventPosts$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          n = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : 3;
          eventId = _args11.length > 1 ? _args11[1] : undefined;
          data = [];
          _context11.next = 5;
          return regeneratorRuntime.awrap(Post.find({}).sort({
            'time': -1
          }).limit(n).exec().then(function (mongoData) {
            data = mongoData;
          })["catch"](function (err) {
            console.log('Error:' + err);
          }));

        case 5:
          eventPosts = [];
          data.forEach(function (post) {
            if (post.eventId === eventId) {
              eventPosts.push(post);
            }
          });
          return _context11.abrupt("return", eventPosts);

        case 8:
        case "end":
          return _context11.stop();
      }
    }
  });
} //exports functions in this file so they can be imported into other files


module.exports = {
  addNewPost: addNewPost,
  getPosts: getPosts,
  getPost: getPost,
  likePost: likePost,
  unlikePost: unlikePost,
  commentOnPost: commentOnPost,
  viewComments: viewComments,
  editPost: editPost,
  deletePost: deletePost,
  addNewEventPost: addNewEventPost,
  getEventPosts: getEventPosts
};