import { makereq } from "./makereq";

export function getPost() {
    return makereq("/posts")
}

export function getOnePost(id) {
    return makereq(`/posts/${id}`)
}

export function getUpvotes(postID) {
    return makereq(`/getupvotes/${postID}`)
}

export function PostWithUser(userID){
    console.log("inside postwithuser with user id : "+ userID)
    return makereq(`/${userID}/main`)
 }

 export function getInvesters(userID){
    console.log("inside postwithuser with user id : "+ userID)
    return makereq(`/investers/${userID}`)
 } 

 export function getPostTopic(topic){
    return makereq(`/posts/search/${topic}`)
 }
