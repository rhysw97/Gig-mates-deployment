import {useEffect, useState, useContext} from "react";
import UserProfile from "../../data/userProfile";
import Likes from "../../components/Likes/likes"
import PostComment from "../../components/comments/postComment";
import Modal from "./../..//components//UI/modal/modal"
import { USERNAME } from "../../data/contexts";
import DeletePost from "../../components/DeletePost/DeletePost";
import EditPost from "../../components/EditPost/EditPost"

export default function Post(props) {
    const [commentsModalActive, setCommentsModalActive] = useState(false);
    const [editModalActive, setEditModalActive] = useState(false);
    const [deleteModalActive, setDeleteModalActive] = useState(false);
    const {usernameContext, setUsernameContext} = useContext(USERNAME)
    console.log(props.post.message)
    const [message, setMessage] = useState(props.post.message)
    console.log(message)
    const postData = props.post
    let posterButtons = null;
    const username = usernameContext

    function updateMessage(msg) {
        setMessage(msg)
    }

    if(postData.username === username && postData.id) {
        posterButtons =
            <div className="flex justify-center flex-row align-center sm:justify-end gap-2">
                <p className="button-green self-start sm:w-32 w-full" onClick={()=> setEditModalActive(true)}>Edit</p>
                <p className="button-green self-start sm:w-32 w-full" onClick={()=> setDeleteModalActive(true)}>Delete</p>
            </div>
    } else {
        posterButtons = null
    }

    return(
        <div className="flex-col px-5 sm:px-8 bg-slate-300 rounded-md shadow-xl shadow-slate-600 gap-6" >
            <div className="flex flex-col sm:flex-col-reverse justify-between mt-2">
                <div className="flex flex-col items-center px-2 py-4 sm:p-0 sm:justify-start xs:justify-center  sm:flex-row gap-2 mt-2">
                    <img className="w-[100px] h-[100px] bg-black rounded-full" src={`https://gig-matesd.onrender.com/images/${postData.profilePicture}`}/>
                    <div className="flex w-[100%] justify-center sm:justify-start items-center sm:flex-row">
                        <p className="mx-2 text-center text-3xl font-semibold">{postData.username}</p>
                    </div>
                    
                </div>
              
                {posterButtons}
            </div>
            <div className=" py-8 flex align-middle">
                <p className="my-auto text-xl text-wrap">{message}</p>
            </div>
            {postData.id && // only shows if postData has id so it isn't a temp post
                <div className="flex flex-col gap-3">
                
                    <Likes className= "" likes ={postData.likes} post={postData}></Likes>
                    <div className="sm:px-16">
                        <p className=" w-[100%] button-green mb-5" onClick={()=> {setCommentsModalActive(true)}}>comments</p>
                    </div>
                    <Modal show={commentsModalActive} close={()=> setCommentsModalActive(false)} content={<PostComment id={postData.id}/>} title={"Comments"}/>
                    <Modal show={deleteModalActive} close={()=> setDeleteModalActive(false)} content={<DeletePost id={postData.id} setModalActive={setDeleteModalActive} setPostList={props.setPostList} />} title={"Delete"}/> 
                    <Modal show={editModalActive} close={()=> setEditModalActive(false)} content={<EditPost id={postData.id} message={message} setMessage={updateMessage} setModalActive={setEditModalActive}/>} title={"Edit"}/>  
                </div>
            }
        </div>
    )
}