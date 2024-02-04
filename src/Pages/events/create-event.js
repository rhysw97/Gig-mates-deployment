import React, { useRef, useState } from "react";
import { getRequest, postRequest } from "../../utils/server-queries.ts";
import Navbar from "../../components/UI/navbar/navbar.js";

export default function CreateEvent(props) {
    const artistInputRef = useRef(null)
    const genreInputRef = useRef(null)
    const locationInputRef = useRef(null)
    const imageInputRef = useRef(null)
    const dateInputRef = useRef(null)
    const timeInputRef = useRef(null)
    const [invalidDateMessage, setInvalidDateMessage] = useState(null)
    
    const handleSubmit = () => {
        const data = {
            artist: artistInputRef.current.value,
            genre: genreInputRef.current.value,
            location: locationInputRef.current.value,
            date: dateInputRef.current.value,
            eventPicture: imageInputRef.current.value,
            time: timeInputRef.current.value
        }

        artistInputRef.current.value = null
        genreInputRef.current.value = null
        locationInputRef.current.value = null
        dateInputRef.current.value = null
        timeInputRef.current.value = null
        
        createEvent(data)
        
    }

    const createEvent = async(data) => {
        if( new Date(data.date) > Date.now()) {
            await postRequest('events', data)
            const response = await getRequest('events/getEvents')
            console.log(response)
            props.setEventList(response)
            props.modalActive(false)

        } else {
            setInvalidDateMessage(<p className="text-lg">Please enter a date in the future</p>)
        }

    }

    return(
        <div className="h-full pb-20">
            <form className="flex flex-col items-center text-black h-[100%] pb-5 justify-evenly bg-gray-400">
                <input className="input-field w-[90%]" placeholder="Artist Name" ref={artistInputRef} required/>
                <input className="input-field w-[90%]" placeholder="Genre" ref={genreInputRef} required/>
                <input className="input-field w-[90%]" placeholder="Location" ref={locationInputRef} required/>
                <input className="input-field w-[90%]" placeholder="Event Image Link" ref={imageInputRef} required/>
                <div className="flex flex-col w-[100%] items-center">
                    <label className=" w-[100%] text-center text-xl" >Date of gig</label>
                    <input className="input-field w-[90%]" type="date" ref={dateInputRef} required/>
                    {invalidDateMessage}
                </div>
                <div className="flex flex-col w-[100%] items-center">
                    <label className="w-[90%] text-center text-xl" >Time of gig</label>
                    <input className="input-field text-center w-[90%]" type="time" ref={timeInputRef} required/>
                </div>
                <button className="button-green" type="submit" onClick={handleSubmit}>Create Event</button>
            </form>
        </div>
    )
}