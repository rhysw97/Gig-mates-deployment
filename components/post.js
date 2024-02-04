//view recent posts
const Mongoose = require('mongoose')
const {Schema, model} = Mongoose

//creates new schema for posts indicating the data fields and data types a post should contain
const postSchema=new Schema({
    postedBy: String,
    profilePicture: String,
    message: String,
    eventId: String,
    likes: Number,
    time: Date,
    likedBy: [String],
    tags: [String],
    comments: [
        {
            user: String,
            commentBy: String,
            message: String,
            time: Date,
            likes: Number,
            profilePicture: String,
            likedBy: [String],
        }
    ]
})

const Post = model('Posts', postSchema) //creates a model of the schema called posts

//function to add a new post with 1 parameter allowing passing in of post data //Code edited from daves app
function addNewPost(postData) {
    //stores data passed into myPost and sets up other fields that may be used 
    let myPost = {
        postedBy: postData.username,
        message: postData.post,
        likes: 0,
        time: Date.now(),
        likedBy: [],
        comments: [],
        eventId: ''
    }

    //creates a a new post collection called Posts containing myPost.
    //if collection already exists then it adds the new post into that collection
    Post.create(myPost) 
        .catch(err=>{
            console.log("Error: "+err)
        })
}

//function to get posts from with a parameter indicating the amount of posts wanted //Code used from Daves app
async function getPosts(n=3) {
    let data = []
    await Post.find({eventId: ''})
        .sort({'time': -1}) //sorts the posts in time added order
        .limit(n)
        .exec()
        .then(mongoData=>{
            data=mongoData;
        })
        .catch(err => {
            console.log('Error:' + err)
        })
    return data;
}

//function to get a single post by its id and return the post data //code used from Daves app
async function getPost(postid){
    let data=null;
    await Post.findById(postid)
        .exec()
        .then(mongoData=>{
            data=mongoData;
        })
        .catch(err=>{
            console.log('Error:'+err)
        });
    return data;
}

//function to find a post by id and increment the likes by one and add the user who liked it to liked by array
async function likePost(likedPostID, likedByUser){
    await Post.findByIdAndUpdate(likedPostID, {
        $inc:{likes: 1},
        $push:{likedBy: likedByUser}
    }).exec()
        .then(foundData=>{
            found=foundData
            console.log(found)
        })
}

//function to get post by id and remove 1 from likes and then remove the user who unliked it from array
async function unlikePost(likedPostID, likedByUser){
    await Post.findByIdAndUpdate(likedPostID, {
        $inc:{likes: -1},
        $pull:{likedBy: likedByUser}
    }).exec()
        .then(foundData=>{
            
            found=foundData
            console.log(found)
        })
}

//function for user to comment on a post by finding the post by it's id and adding the comment to it's comment array
async function commentOnPost(commentedPostID, commentByUser, comment, request){
    let found;
    let newComment={
        user: commentByUser,
        message: comment,
        likes: 0,
        time: Date.now(),
    }
    //updates post in database with new comment
    await Post.findByIdAndUpdate(commentedPostID,{$push: {comments: newComment}}).exec()
        .then(foundData=>found=foundData)
}

//function to get the comments of a post by finding it by it's Id and returning the posts data (same as getPost really so could be deleted)
async function viewComments(postId){
    let data=null;
    await Post.findById(postId)
        .exec()
        .then(mongoData=>{
            data=mongoData;
        })
        .catch(err=>{
            console.log('Error:'+err)
        });
    return data;
}

//function to edit post in the database
async function editPost(postId, message, currentUser, response) { 
    //checks the user logged in was the one who posted the post
    if(await checkUserIsPoster(postId, currentUser)) {
        let found
        //if user did post find the post by it's Id and then update the message with the new message
        await Post.findByIdAndUpdate(postId, {message: message}).exec()
        .then(foundData=>found=foundData)
    } else {
        //if user didn't post send not authorized error code
        response.sendStatus(403)
    }   
}

//function to check that a user is the poster takes the post id and the current users name
async function checkUserIsPoster(postId, currentUser) {
    let result 
    let data
    //finds post in database by id passed in
    await Post.findById(postId)
        .exec()
        .then(mongoData=>{
            data=mongoData
            //turnery statement to check if the current user matches the postedBy field in database and stores in result whether this is true or false
            result = data.postedBy === currentUser? true : false
            
        })
        .catch(err=>{
            console.log('Error:'+err)
            result = 400
        });

    //returns true or false based on whether user was one who posted the post
    return result 
}

//function to delete a post
async function deletePost(postId, currentUser, response) {
    const isUserPoster = await checkUserIsPoster(postId, currentUser) //checks if user created the post
    if(isUserPoster === true) {
        await Post.findByIdAndDelete(postId)
        console.log('Deleted')
    } else if (isUserPoster === false) {
        //if they didn't send not authorized code
        response.sendStatus(403)
    } else {
        //send that the user is the poster
        response.send(isUserPoster)
    }
}

//function to add a new event post to the post collection. similar to add new post
async function addNewEventPost(postData) {

    let myPost = {
        postedBy: postData.username,
        message: postData.message,
        likes: 0,
        time: Date.now(),
        likedBy: [],
        comments: [],
        eventId: postData.eventId //only difference is it adds the events id to eventId field
    }

    console.log(myPost)
    Post.create(myPost)
        .catch(err=>{
            console.log("Error: "+err)
        })

}

//gets only posts with eventId field matching event id //code used from Daves version
async function getEventPosts(n=3, eventId) {
    let data = []
    await Post.find({})
        .sort({'time': -1})
        .limit(n)
        .exec()
        .then(mongoData=>{
            data=mongoData;
        })
        .catch(err => {
            console.log('Error:' + err)
        })
    
    const eventPosts = []
    data.forEach(post => {
        if(post.eventId === eventId) {
            eventPosts.push(post)
        }
    })
    
    return eventPosts;
}

//exports functions in this file so they can be imported into other files
module.exports = {
    addNewPost,
    getPosts,
    getPost,
    likePost,
    unlikePost,
    commentOnPost,
    viewComments,
    editPost,
    deletePost,
    addNewEventPost,
    getEventPosts
}