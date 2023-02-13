import { useState } from "react";
import { usePost } from "../context/PostContext";
import { useAsyncFn, useAsync } from "../hooks/useAsync";
import { createComment, makeUpvote } from "../services/comment";
import { getUpvotes } from "../services/posts";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

export function Post() {
    const {post, rootComments, createLocalComment} = usePost()
    const { loading, error, execute: createCommentFn} = useAsyncFn(createComment)
    const [like, setLikes] =useState(null);

    function onCommentCreate(message){
      return createCommentFn({postId: post.id, message}).then(
        createLocalComment
      )
    }
    console.log(post)
    // what to do -->
    // can use makeUpvote function to add delete upvote it return numbers of upvote on that post
    // use local storage to find userid and enable or disable upvotes button
    return (
        <>
          <h1>{post.upvotescount}</h1>
          <h1>{post.title}</h1>
          <h2>{post.topic}</h2>
          <article>{post.body}</article>
          <h3 className="comments-title">Comments</h3>
          <section>
            <CommentForm loading={loading} error={error} onSubmit={onCommentCreate}/>
            {rootComments != null && rootComments.length > 0 && (
              <div className="mt-4">
                <CommentList comments={rootComments} />
              </div>
            )}
          </section>
        </>
      )
}