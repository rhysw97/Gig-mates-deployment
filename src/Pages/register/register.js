import React, {useState, useRef} from "react";
import { postRequest } from "../../utils/server-queries.ts";
import Password from "./password.js";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {USERNAME, LOGGEDIN} from "../../data/contexts.js";
//import UserProfile from "../../data/userProfile.js";
//check that the username hasn't been taken by sending to backend and checking against db

//check that the email is valid
//probably look into terms and conditions as can store data

export default function Register() {
    //context
    const {value, setValue} = useContext(USERNAME);
    //const {loggedIn, setLoggedIn} = useContext(LOGGEDIN);

    const usernameRef = useRef();
    const [email, setEmail] = useState();
    const [dateOfBirth, setDateOfBirth] = useState();
    const [userPassword, setUserPassword] = useState();
    const [currentIsValid, setCurrentIsValid] = useState();
    const [ageMessage, setAgeMessage]  = useState();
    const [emailMessage, setEmailMessage] = useState()
    const [usernameUsed, setUsernameUsed] = useState()
    const [emailUsed, setEmailUsed] = useState()
    const [validAge, setValidAge] = useState();
    const [emailValid, setEmailValid] = useState();

    //regex to check for valid email. checks there in this format wordsordigits@wordsordigits.co(.uk)
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    const navigate = useNavigate();
  

    //gets age from data of birth by checking against current date. Then checks if age is over 18
    function findAge(dob) {
        const currentDate = new Date()
        const birthDate = new Date(dob)
        let age = currentDate.getFullYear() - birthDate.getFullYear(); //checks users birth year against current year
        const month = currentDate.getMonth() - birthDate.getDate(); //stores difference between users birth month and current month
        //if the 
        //checks if the month is less than zeros or if the month difference is 0 and the current date is greater than the users birth date
        if(month < 0 || (month === 0 && currentDate.getDate() >= birthDate.getDate)) {
            age-- //if so take 1 from age
        }
        return age;
    }
    
    //handles email
    const handleEmail = event => {
        //checks email input is valid against regex and stores result in state
        setEmailValid(currentEmailValid => currentEmailValid = emailRegex.test(event.target.value))
        //if its valid then stores email in email state
        if(emailValid) {
            setEmail(event.target.value)
            setEmailMessage(null)
            //if not display error message
        } else {
            setEmailMessage(<p className="text-white">Not a valid email</p>)
        }
    }

    const handleDateOfBirth = (event) => {
        setDateOfBirth(event.target.value)
        const userAge = findAge(event.target.value);
        //if user is greated or equal to 18 then tore true in validAge state and no error message
        if(userAge >= 18) {
            setValidAge(currentValidAge => currentValidAge = true);
            setAgeMessage(null)
        } else { //otherwise show user message that they need to be 18 or over
            setValidAge(currentValidAge => currentValidAge = false);
            setAgeMessage(<p className="text-white bg-black rounded-full">You must be 18 or over to register</p>)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if(currentIsValid && validAge && emailValid) {
            const data = { 
                username: usernameRef.current.value, 
                email: email,
                dateOfBirth: dateOfBirth,
                password: userPassword
            };

            createUser(data)
        }
    };

    async function createUser(data) {
        const response = await postRequest('register', data)
        
        if(response.email) {
            setEmailUsed(<p className="text-white">Email already in use</p>) 
        } else {
            setEmailUsed(null) 
        }

        if(response.username) {
            setUsernameUsed(<p className="text-white ">Username already in use</p>) 
        }  else {
            setUsernameUsed(null) 
        }

        if(!response.username && !response.email) {
            navigate('/edit-profile')
        }
    }

    return(
       <div>
            <header className='flex justify-center'>
                <h1 className='text-5xl text-white text-center bg-green-500 w-[100%] py-8 mb-16'>Register</h1>
            </header>
            <form onSubmit={handleSubmit} className="flex w-full gap-4 flex-col items-center">  
            <input
                placeholder="Username"
                id="username"
                type="text"
                ref={usernameRef}
                className="input-field "
            />
            {usernameUsed}
                
            <input
                placeholder="email"
                id="email"
                type="text"
                onChange={handleEmail}
                className="input-field my-3"
            />
            {emailUsed}
            {emailMessage}
              
            <div className="flex flex-col items-center w-[100%]">
                <label for="dob" className="text-center text-white text-2xl">Date Of Birth</label>
                <input
                    id="dob"
                    type="date"
                    onChange={handleDateOfBirth}
                    className="input-field mb-3"
                />
                {ageMessage}
            </div>
                <Password setPasswordState={setUserPassword} setIsPasswordValid={setCurrentIsValid}/>
                <button className="button-green" type="submit">Submit</button>
            </form>
       </div>
    )
}