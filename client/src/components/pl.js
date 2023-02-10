import { useEffect, useState} from "react"
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts"

export function PostList() {
    const { loading, error, value: posts} = useAsync(getPost)

    if(loading) return <h1>loading</h1>
    if(error) return <h1 className="msg-error">{error}</h1>
    // what to do -->
    // can use makeUpvote function to add delete upvote it return numbers of upvote on that post
    // use local storage to find userid and enable or disable upvotes button

    return posts.map(post => {
        console.log(post)
        return (
            <>
            <div className="row">
            <div className="col s12 m6">
                <div className="card blue-grey darken-1">
                <div className="card-content white-text">
                    <h1>{post.upvotesnumber}</h1>
                    <span className="card-title"><Link to={`/posts/${post.id}`}>{post.title}</Link></span>
                    <p>{post.body}</p>
                </div>
                <div className="card-action">
                    <a href="#"></a>
                    <a href="#"></a>
                </div>
                </div>
            </div>
            </div>
            </>
        )
    })
}