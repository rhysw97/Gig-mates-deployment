const Mongoose = require('mongoose')
const {Schema, model} = Mongoose

//creates new scheme for mongoose outlining the data and data types I want to store in events
const eventSchema=new Schema({
    artist: String,
    genre: String,
    location: String,
    date: String,
    time: String,
    dateTime: Number,
    eventPicture: String
})

//creates a new model called events to store the event data
const Event = model('Events', eventSchema)


//function to create an event passing in the event data
function createEvent(eventData) {
    let event = {
        artist: eventData.artist,
        genre: eventData.genre,
        location: eventData.location,
        date: eventData.date,
        time: eventData.time,
        dateTime: Date.parse(eventData.date),
        eventPicture: eventData.eventPicture,
    }
    //if collection doesn't already exist creates a new event collection in database otherwise it adds the new event to it
    Event.create(event)
        .catch(err=>{
            console.log("Error: "+err)
        })
}

//async function to get events
async function getEvents() {
    let data = []
    //gets all events in database (await used to make sure this has finished before carrying on to next piece of code)
    await Event.find({})
        .sort({'DateTime': -1}) //sorts events into date via datetime
        .exec()
        .then(mongoData=>{
            data=mongoData; //updates the data variable with data returned by find function
        })
        .catch(err => {
            console.log('Error:' + err)
        })
    return data;
}

//exports functions so they can be imported into other files
module.exports = {
    createEvent,
    getEvents
}