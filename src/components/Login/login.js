import React,{useState, useContext} from "react";
import { postRequest } from "../../utils/server-queries.ts";
import {BrowserRouter, useNavigate} from 'react-router-dom';
import {USERNAME, LOGGEDIN} from '../../data/contexts.js'
import image from './../../assets/images/Live-gig.jpg'
import Navbar from "../UI/navbar/navbar.js";



export default function Login() {
    const {usernameContext, setUsernameContext} = useContext(USERNAME);
    const {loggedInContext, setLoggedInContext} = useContext(LOGGEDIN)
    //variables store state of login data 
    //this means it wont be deleted when the login component reloads itself
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState()

    //stores navigation hook to allow moving to other pages
    const navigate = useNavigate()

    //function to run when user inputs into email field to update the components the 
    const handleEmail = (event) => {
        setEmail(event.target.value);
    };
      
    //click event function to be used to set the Password state to the value of the password input
    const handlePassword = (event) => {
        setPassword(event.target.value);
    };
    
    //function to be used to handle submit event
    const handleSubmit = (event) => {
        event.preventDefault(); //prevents from reloading
        handleLoginResponse() //function defined line 33
    };

    //function async function to handle whether the login is successful of not
    async function handleLoginResponse() {
        //send login data to serve and wait to see whether the server logs the user in
        const response = await postRequest('login', { email, password });
        //if yes
        console.log(response.loggedin)
        if(response.loggedin === true) {
            //don't need login message element showing login failed
            setLoginMessage(null)
            //set username context (react global variable) to the to responses username attribute
            setUsernameContext(() => response.username)
            setLoggedInContext(() => true)

            navigate('/post') //navigate to post page (probably should have named this feed)
    
        //if not show element detailing login failure
        } else {
            setLoginMessage(() => <p className="text-white">Email or password could not be verfied.<br/> Please check they have are correct or click below to create an account</p>)
        }
    }


    //elements to be rendered go within jsx
    return(
        <div style={{
            backgroundImage: './../../assets/images/gig-picture.jpg',
        }} className="  flex flex-col w-[100%] gap-30">
            <header className=" flex flex-col w-[100%] items-center mx-auto my-0">
                <h1 className="heading z-10 mx-auto my-0">Gig Mates</h1>
            </header>

            <div className="flex lg:flex-row items-center w-[100%] h-screen flex-col gap-10 lg:gap-0 pt-8 lg:pt-0 lg:justify-evenly text-white ">
                <section className="lg:h-[100%] flex items-center lg:w-[30%] w-[100%]">
                    <p className="text-2xl font-semibold lg:align-middle w-[70%] mx-auto md:w-[100%] md:pb-16 lg:w-[80%] lg:pb-0 text-center lg:mx-auto">Bringing people together through live music </p>
                </section> 

                <form  className="flex flex-col items-center justify-evenly h-100 w-[40%] lg:w-[40%] gap-8 text-black"  onSubmit={handleSubmit}>
                    <h2 className="text-4xl gothic mb-4 text-white">Login</h2>
                    <input
                        className="input-field w-[100%] lg:w-[100%]"
                        placeholder="email"
                        id="email"
                        type="text"
                        value={email}
                        onChange={handleEmail}
                    />
            
                    <input
                        className="input-field w-[100%]"
                        placeholder="password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePassword}
                    />
                    {loginMessage}
                    <button type="submit" className="button-green">Submit</button>
                    <p className="gothic text-center text-white">Not Registered? </p>
                    <a className="gothic button-green px-2 py-1" onClick={()=> {navigate('/register')}}>Sign Up</a>
                    
                </form>

                
            </div>
            

       </div>
    )
}