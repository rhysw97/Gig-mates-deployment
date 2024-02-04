import React from "react";
import {useNavigate} from "react-router-dom"
import { FaClock, FaCalendar } from "react-icons/fa";

export default function Event(props) {

    const navigate = useNavigate()
     
    const handleClick = () => {
        navigate('/event-feed', { state: {
            id: props.event._id, 
            artist: props.event.artist, 
            date: props.event.date,
            time: props.event.time,
            location: props.event.location,
            
        }})
    }

    return(
        <div className="
            hover:cursor-pointer justify-around bg-green-500 p-4 rounded-lg mx-auto my-2 shadow-black 
            shadow-xl md:basis-[45%] lg:basis-[30%] basis-[90%] hover:shadow-none
        " onClick={handleClick}>
            <div className="flex flex-col">
                <img className="w-[100%] h-[250px] object-cover" src={props.event.eventPicture } alt=""></img>
                <h2 className="text-center text-shadow-lg py-5 font-extrabold text-4xl">{props.event.artist}</h2>
            </div>
            <p className="text-center text-xl font-semibold">{props.event.location}</p>
            <div className="w-[100%] flex flex-row my-4">
                <div className="flex flex-col items-center basis-1/2"><FaCalendar></FaCalendar><p>{props.event.date}</p></div>
                <div className="flex flex-col items-center basis-1/2"><FaClock></FaClock><p>{props.event.time}</p></div>
            </div>
        </div>
    )
}