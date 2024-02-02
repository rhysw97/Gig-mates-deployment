const express = require("express")
const router = express.Router()
const {addNewPost, getPosts, likePost, unlikePost, commentOnPost, viewComments, editPost, deletePost, addNewEventPost, getEventPosts} = require('../components/post')
const { get } = require("mongoose")

//post route to add new post to database
router.post('/', (request, response) => {
    const data = request.body

    const newPost  = {
        username: request.session.username,
        post: data.message
    };
    //calls function to add post to database
    addNewPost(newPost)
    //sends object to client to signal post has been added has been accepted
    response.send({accepted: true})
})

//route to get route from database
router.get('/recentPosts', (request, response) => {
    getRecentPosts(5, response, request.app.locals.user)
    
})

//post route to get an events posts //sending data as a url param didn't work so I used a post route for ease
router.post('/eventPosts', (request, response) => {
    console.log(request.body.id)
    //calls function to get the last five posts with from the event with the id sent from client
   getRecentEventPosts(5 , request.body.id, response, request.app.locals.user)
})

//post route to create an event post
router.post('/createEventPost', (request, response) => {
    const data = request.body

    const newPost  = {
        username: request.session.username,
        message: data.message,
        eventId: data.id
    };

    //adds new event post to database
    addNewEventPost(newPost)
    response.send({accepted: true})
})

//post route to add a like to a post
router.post('/likePost', (request, response) => {
    //adds like from current user to database of the post with id matching the post id recieved from client
    likePost(request.body.postId, request.session.username)
})

//post route to unlike a post and remove like from post with id matching id sent by the client
//also removes name from posts likedby array
router.post('/unlikePost', (request, response) => {
    unlikePost(request.body.postId, request.session.username)
})

//post route to update the posts content if the post id matches the id sent by client
router.post('/updatePost', (request, response) => {
    console.log(request.body)
    editPost(request.body.postId, request.body.message, request.session.username, response)
})

//delete route to delete post 
router.delete('/deletePost', (request, response) => {
    const postID = request.headers.postid
    deletePost(postID, request.session.username, response)
})

router.post('/comment', (request, response) => {
    console.log('NEW Comment',request.body)
    console.log('name', request.session.username)
    commentOnPost(request.body.postId, request.session.username, request.body.message, request)
    response.send({accepted: true})
})

router.post('/viewComments', async (request, response) => {
    const comments = await viewComments(request.body.postId)
    comments.comments = await getCurrentProfilePictures(comments.comments, 'user', request.app.locals.user)
    response.send(comments)
})

async function getRecentPosts(numberOfPosts, response, user) {
    let recentPosts = await getPosts(numberOfPosts)

    recentPosts = await getCurrentProfilePictures(recentPosts, 'postedBy', user)
    response.send(recentPosts)
}

async function getRecentEventPosts(numberOfPosts, eventId, response, user) {
    let recentEventPosts = await getEventPosts(numberOfPosts, eventId)
    recentEventPosts = await getCurrentProfilePictures(recentEventPosts, 'postedBy', user)
    response.send(recentEventPosts)
}

async function getCurrentProfilePictures(arrayToChange, fieldName, user) {
    const uniqueNamesSet = new Set(arrayToChange.map(item => item[fieldName]))
    const profilePictures = {}
    for (const name of uniqueNamesSet) {
       const userPicture = await user.returnProfilePicture(name)
       profilePictures[name] = userPicture
    }
    console.log('Unchanged', arrayToChange)
    arrayToChange.forEach(item => {
        item.profilePicture = profilePictures[item[fieldName]]
    })

    console.log('ToChange', arrayToChange)
    return arrayToChange
}

module.exports = router