import { useEffect, useRef, useState, useContext } from "react";
import {getRequest, postRequest} from '../../utils/server-queries.ts'
import { USERNAME } from "../../data/contexts.js";
//component to allow user to post a comment
export default function PostComment(props) {
    const {usernameContext} = useContext(USERNAME);
    //state of comment component
    const [comments, setComments] = useState([])
    const commentInputRef = useRef()
    //runs function getComments once ce on render
    useEffect( () => {
        getComments()
    
    }, [])

    //function to deal with comments returned from server
    async function getComments() { 
        
        
        //requests backends viewComments viw comments with the post and postId
        const response = await postRequest('posts/viewComments', {postId: props.id})
        setComments((currentComments) => [...response.comments]) //sets comments state back to empty array to avoid duplicates 
    }

    //function to add temporary comment after user submits comment so it shows up without the user having to refresh
    const addTempComment = async (data) => {
        //makes get request to profile/profile-pic endpoint and waits for the response
        const profile = await getRequest('profile/profile-pic')
        console.log(profile)
        //creates temporary comment object containing the comment data to show to the user
        const tempComment = { 
            user: usernameContext,
            message: data.message,
            postId: data.postId,
            profilePicture: profile.profilePicture
        }
        
        //sets the comments state to include the current comments in the comments state array and the new tempComment object 
        setComments(currentComments => [...currentComments, tempComment])
    }

    //function to run when user comments on post
    const commentOnPost = async (e) => {
        //checks there is data in comment input field
        if(commentInputRef.current.value) {

            const data = {
                message: commentInputRef.current.value,
                postId: props.id, //sets postId to the id passed in when this component is initalised witin jsx
            }
            //calls function to add temporary comment while passing in the data
            addTempComment(data)
            
            await postRequest('posts/comment', data)
            
            await getComments()
          
            commentInputRef.current.value = ''
        }
    }

   //returns what will be rendered by this component
   //maps reversed comment array so latest post will be at top 
    return (
        <div className="h-screen">
            <div className="comments bg-gray-400 flex flex-col gap-3">
                {comments.toReversed().map((comment, index) => {
                    return <div className="bg-white w-[90%] m-auto rounded-xl p-4" key={index}>
                        <div className="flex items-center flex-col md:gap-2 md:flex-row ">
                            <img className="w-20 h-20 rounded-full " src={`https://gig-matesd.onrender.com/images/${comment.profilePicture}`}/>
                            <h2 className="text-3xl font-semibold">{comment.user}</h2>
                        </div>
                            <p className="py-4 px-3 md:ml-20 md:py-6 text-xl">{comment.message}</p>
                    </div>
                })}
                <div className="h-[150px]"></div>
            </div>
            <div className="fixed flex items-center flex-col w-[100%] bottom-0 left-0 bg-green-500 py-4">
                <textarea className="border-black border-2 w-[70%] text-lg rounded-lg" placeholder="add comment" ref={commentInputRef}/>
                <button className="button-green w-[50%] border-black border-2" onClick={commentOnPost}>Send</button>
            </div>
        </div>
    ) 
}