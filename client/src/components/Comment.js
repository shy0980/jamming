import { IconBtn } from "./IconBtn"
import { FaHeart , FaReply, FaEdit, FaTrash } from "react-icons/fa"
import { usePost } from "../context/PostContext"
import { CommentList } from "./CommentList"
import { useState } from "react"
import { CommentForm } from "./CommentForm"
import { useAsyncFn } from "../hooks/useAsync"
import { createComment, updateComment } from "../services/comment"
import { useUser } from "../hooks/useUser"
import { useCookies } from 'react-cookie';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle:"short",
})


export function Comment({id, message, user, createdat}) {
    const [cookies, setCookie] = useCookies(['user']);
    const { post, getReplies ,createLocalComment, updateLocalComment} = usePost()
    const [areChildrenHidden, setAreChildrenHidden] = useState(false)
    const [isReplying, setIsReplying] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const createCommentFn = useAsyncFn(createComment)
    const updateCommentFn = useAsyncFn(updateComment)
    const childComments = getReplies(id)

    function onCommentReply(message) {
        return createCommentFn
          .execute({ postId: post.id, message, parentId: id })
          .then(comment => {
            setIsReplying(false)
            createLocalComment(comment)
          })
    }

    function onCommentUpdate(message) {
        return updateCommentFn
          .execute({ postId: post.id, message, id })
          .then(comment => {
            setIsEditing(false)
            console.log(comment)
            updateLocalComment(id, comment.message)
          })
    }

    const curruser = cookies.User_id

    return <>
        <div className="comment">
            <div className="header">
                <span className="name">{user.name}</span>
                <span className="date">{dateFormatter.format(Date.parse(createdat))}</span>
            </div>
            {isEditing ? <CommentForm autoFocus initialValue={message} onSubmit={onCommentUpdate}
            loading={updateCommentFn.loading} error={updateCommentFn.error}/> : <div className="message">{message}</div>}
            <div className="footer">
                <IconBtn Icon={FaHeart} aria-label="Like">
                    2
                </IconBtn>
                <IconBtn
                    onClick={() => setIsReplying(prev => !prev)}
                    isActive={isReplying}
                    Icon={FaReply}
                    aria-label={isReplying ? "Cancel Reply" : "Reply"}
                />
                {user.id===curruser.id && <IconBtn 
                    onClick={() => setIsEditing(prev => !prev)}
                    isActive={isEditing}
                    Icon={FaEdit} aria-label={isEditing ? "Cancel Edit": "Edit"} >
                </IconBtn>}
                
                {user.id===curruser.id && <IconBtn
                Icon={FaTrash} aria-label="Delete" color="danger">
                </IconBtn>}
            </div>
        </div>
        {isReplying && (
            <div className="mt-1 ml-3">
            <CommentForm
                autoFocus
                onSubmit={onCommentReply}
                loading={createCommentFn.loading}
                error={createCommentFn.error}
            />
            </div>
        )}
        {childComments?.length > 0 && (
            <>
                <div className={`nested-comments-stack ${
                    areChildrenHidden ? "hide":""
                    }`}>
                    <button 
                        className="collapse-line" 
                        aria-label="Hide Replies" 
                        onClick={()=>setAreChildrenHidden(true)}
                    />
                    <div className="nested-comments">
                        <CommentList comments={childComments}/>
                    </div>
                </div>
                <button className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`} 
                onClick={()=>setAreChildrenHidden(false)}>
                    Show Replies
                </button>
            </>
        )}
    </>
}