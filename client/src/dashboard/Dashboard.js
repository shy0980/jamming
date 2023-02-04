import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAsync, useAsyncFn } from "../hooks/useAsync"
import { PostWithUser } from "../services/posts"
import { Link } from "react-router-dom"

export function Dashboard() {
    const {userID} = useParams()
    
    // boht sari posts with with some params to ye karenge
    const {loading, error, value : posts} = useAsync(()=> PostWithUser(userID)
    ,[userID])
    if(loading) return <h1>loading</h1>
    if(error) return <h1 className="msg-error">{error}</h1>
    

    return posts.map(post => {
        return (
            <h1 key={post.id}>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </h1>
        )
    })
    
}