//register
const Mongoose = require('mongoose')
const {Schema, model} = Mongoose

//class for User
class User {
    //constructor creates the schema for the database collection and a model of the users schema
   constructor() { 
        this.userSchema=new Schema({
            id: String,
            email: String,
            username: String,
            name: String,
            dateOfBirth: String,
            age: Number,
            password: String, 
            profilePicture: String, 
            about: String,
            genres: Array, 
            artists: Array,
            interestedGigs: Array, 
            postHistory: Array,
            friendslist: Array
        })
        this.user = model('users', this.userSchema)
    }
    
    //adds a new user to the database
    async addNewUser(userData) {
        const newUser = {
            email: userData.email,
            username: userData.username,
            dateOfBirth: userData.dateOfBirth,
            age: userData.age,
            password: userData.password,
            name: '', 
            profilePicture: 'default.png', 
            about: '',
            genres: [], 
            interestedGigs: [], 
            postHistory: [],
            friendslist: [],
            artists: []
        }
        
        //checks if the username and email is already in database as all usernames and email should be unique
        const doesUserExist= {
            email: await this.checkDataIsInDatabase({email: newUser.email}),
            username: await this.checkDataIsInDatabase({username: newUser.username})
        }

        //if neither email or username exists in database a new user is created and added to database
        if(!doesUserExist.email && !doesUserExist.username) {
            this.user.create(newUser)
            .catch(err=>{
                console.log("Error: "+err)
            })
        }
        return doesUserExist; //returns object indicating if user and email exist in database or not
    }
    

    //function to check if data is already in database
    async checkDataIsInDatabase(data){
        //looks for anything in user collection containing data passed in if it is it stores it in variable isInDatabase
        const isInDatabase = await this.user.findOne(data) 
        //if isInDatabase has anything in it then the data passed in must already be in db
        if(isInDatabase) {
            //so return true indicating data is in database
            return true
        } else {
            //otherwise return false indicating data ins't in database
            return false
        }
    }

    //function to check if the login details match login details in database
    async checkLoginDetails(data) {
         //checks if email is in database and stores object containing email in userdata
        const userData = await this.user.findOne({email: data.email})
        console.log(userData)
        if(userData) {
            console.log('DATA', data)
            //checks if the userData's password matches password of data passed in
            if(userData.password === data.password) {
                //if it does then it returns object with users user name and field indicating that the login has been accepted
                return {accepted: true, username: userData.username}
            }
        }
        //otherwise it will return false and an empty string
        return {accepted: false, username: ''}
    }

    //function to find user by username and update the users info in database with the new data passed in
    async updateProfile(data) {
        if(data.profilePicture) {
            const userData = await this.user.findOneAndUpdate({username: data.username}, {$set:{
                name: data.name,
                profilePicture: data.profilePicture,
                about: data.about,
                genres: data.genres,
                interestedGigs: data.interestedGigs,
                artists: data.artists 
            }}, {new: true})
        } else {
            const userData = await this.user.findOneAndUpdate({username: data.username}, {$set:{
                name: data.name,
                about: data.about,
                genres: data.genres,
                interestedGigs: data.interestedGigs,
                artists: data.artists 
            }}, {new: true})
        }
    }

    //function to get a users profile data by finding them in databse by username
    async getProfileData(username, response) {
        const userData = await this.user.findOne({username: username})
        if(userData) {
            if(!userData.profilePicture) {
                userData.profilePicture = 'default.png'
            }
            userData.password = null
            response.send(userData)
        }
    }

    //function to get a users profile picture from database by finding them by username and send it back to client
    async getProfilePicture(username, response) {
        const userData = await this.user.findOne({username: username})
        console.log(userData)
        if(userData) {
            response.send({picture: userData.profilePicture})
        } else {
            response.send({picture: 'default.png'})
        }
    }

    //function to find user in database by username and update their password
    async updatePassword(username, password) {
        const user = await this.user.findOneAndUpdate({name: username}, {$set:{password: password}}, {new: true})
    }

    //function to get a users profile picture from database by finding them by their username and return the result
    async returnProfilePicture(username) {
        const userData = await this.user.findOne({username: username})
        if(userData) {
            return userData.profilePicture
        } else {
            return 'default.png'
        }
    }
}

module.exports = {
    User
}