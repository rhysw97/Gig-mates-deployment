import React, { useState, useRef, useEffect, useContext } from 'react'
import Post from './post'
import {postRequest, getRequest} from '../../utils/server-queries.ts';
import {useLocation} from 'react-router-dom';
import { USERNAME } from '../../data/contexts.js';
import Navbar from '../../components/UI/navbar/navbar.js';
import { FaClock, FaCalendar } from 'react-icons/fa';

//component to allow user to create a post
export default function CreateEventPost() {
    const {usernameContext, setUsernameContext} = useContext(USERNAME)
    const [posts, setPosts] = useState([]); //recent posts state
    const postInputRef = useRef() //reference to post input
    const {state} = useLocation()
    const {id, artist, time, date, location} = state

    //function to send new post to backend
    async function newEventPost() {
        if(postInputRef.current.value) {
            const data = {id: id, message: postInputRef.current.value}
            addTempPost(data)
            await postRequest('posts/createEventPost', data)
            postInputRef.current.value = ''
            await getEventPosts()
        }
    }

    const addTempPost = async (data) => {
        
        const profile = await getRequest('profile/profile-pic')
        const tempPost = {
            username: usernameContext,
            message: data.message,
            profilePicture: profile.profilePicture,
            likedBy: [],
            comments: []
        }
        
        const tempPosts = posts
        tempPosts.unshift(tempPost)
        setPosts(currentPosts => [...tempPosts])
    }

    //run once when first rendered
    useEffect( () => {  
        getEventPosts()
    },[])
     //function to get recent posts from server
    async function getEventPosts(){
    
        const serverPosts = await postRequest('posts/eventPosts', {id: id})
        
        setPosts(serverPosts.map(post =>  {
            return  {
                id:post._id, 
                username: post.postedBy, 
                message: post.message,
                likes: post.likes, 
                likedBy: post.likedBy, 
                comments: post.comments,
                date: post.date,
                profilePicture: post.profilePicture
            }
        }));
    }

    return(
        <div className='gothic'  >
            <Navbar />
            <header className='flex flex-col justify-center bg-green-500 text-white'>
                <h1 className='text-5xl ml-16 text-center font-extrabold py-4'>{artist}</h1>
                <div className='flex flex-col items-center ml-16'>
                    <p className="text-center text-2xl font-semibold">{`(${location})`}</p>
                    <div className="w-[100%] flex flex-row justify-evenly items-center my-4 text-xl">
                        <div className="flex flex-col items-center gap-2"><FaCalendar></FaCalendar><p>{date}</p></div>
                        <div className="flex flex-col items-center "><FaClock></FaClock><p>{time}</p></div>
                    </div>
                </div>
            </header>
            <div className='ml-16 mt-6 '>
                <div className=" flex flex-col w-[95%]  mx-auto gap-6 ">
                    {posts.map((post, index) => <Post key={post.id} post={post} setPostList={setPosts}/>)}
                    <div className='h-[75px]'></div>
                </div>
                <div className ="flex pb-[20px] flex-col items-center mt-10 mx-auto fixed bottom-0 w-[100%] placeholder:text-black bg-green-500">
                    <textarea className="border-black border-2 w-[70%] text-lg rounded-lg mr-16 px-2 my-3 placeholder:text-gray-700"id="postBox" type="text" placeholder="What is on your mind..." ref={postInputRef}/>
                    <p className="button-green w-[50%] border-black border-2 mr-16" onClick={newEventPost}>Post</p>
                </div>
            </div>
        </div>
    )
}