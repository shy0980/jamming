import { makereq } from "./makereq";

export function createComment( {postId, message, parentId}) { 
    return makereq(`posts/${postId}/comments`, {
        method: "POST",
        data: {message, parentId},
    })
 } 

 export function updateComment( {postId, message, id}) { 
    return makereq(`posts/${postId}/comments/${id}`, {
        method: "PUT",
        data: {message},
    })
 } 

 export function LoginVerification({password, email}) {
    return makereq(`login`, {
        method: "POST",
        data: {password, email},
    })
 }

 export function SignUp({password, email, name, intrest}) {
    return makereq(`/signup/user`, {
        method: "POST",
        data: {password, email, name, intrest},
    })
 }

 export function PostRegister({title, body, topic, year, email, password}) {
    return makereq(`/postRegister`, {
        method: "POST",
        data: {title, body, topic, year, email, password},
    })
 }

 export function SignUpInvester({password, email, name, intrest}) {
    return makereq(`/signup/invester`, {
        method: "POST",
        data: {password, email, name, intrest},
    })
 }

 export function LoginVerificationInvester({password, email}) {
    return makereq(`/login/invester`, {
        method: "POST",
        data: {password, email},
    })
 }

 export function LoginVerificationStartup({password, email}) {
    return makereq(`/login`, {
        method: "POST",
        data: {password, email},
    })
 }

 export function GetInvestersTopic({id}){
    return makereq(`/invester/${id}`,{
        method: "POST",
        data: {id},
    })
 }
