import fastify from "fastify"
import sensible from "@fastify/sensible"
import dotenv from "dotenv"
import cors from "@fastify/cors"
import { PrismaClient } from "@prisma/client";
import cookie from "@fastify/cookie"
dotenv.config()

const app = fastify();
app.register(sensible)
app.register(cookie, {secret: process.env.COOKIE_SECRET})
app.register(cors, {
    origin: process.env.CLIENT_URL,
    credentials: true
})
app.addHook("onRequest", (req, res, done) => {
    if (req.cookies.userId !== CURRENT_USER_ID) {
      req.cookies.userId = CURRENT_USER_ID
      res.clearCookie("userId")
      res.setCookie("userId", CURRENT_USER_ID)
    }
    done()
  })
const prisma = new PrismaClient()
const CURRENT_USER_ID = (
    await prisma.user.findFirst({ where: { name: "Kyle" } })
  ).id


  const COMMENT_SELECT_FIELDS = {
    id:true,
    message: true,
    createdat: true,
    parentId: true,
    user: {
        select: {
            id: true,
            name: true,
        }
    }
  } 
//list all investers
app.get("/allInvester", async(req,res)=>{
    return await commitToDB(prisma.invester.findMany({
        select: {
            id: true,
            name: true,
            password: true,
            emailId: true,
        }
    }))
})  
  
// post list
app.get("/posts", async (req,res) =>{
    return await commitToDB(
        prisma.post.findMany( {
            select:{
            id: true,
            title: true,
            body: true,
            }
        })
    )
})
//display all user
app.get("/allUsers", async (req,res) =>{
    return await commitToDB(
        prisma.user.findMany( {
            select:{
            id: true,
            name: true,
            intrest: true
            }
        })
    )
})
// user ka dashboard
app.get("/:userId/main", async(req, res)=>{
    const UserIntrest= await commitToDB(prisma.user.findFirst({
        where:{
            id:req.params.userId
        },
        select:{
            intrest: true,
        }
    }))
    console.log("it is called")
    console.log(UserIntrest.intrest)
    return await commitToDB(prisma.post.findMany({
        where:{
            topic: UserIntrest.intrest,
        },
        select:{
            title: true,
            body: true,
            topic: true,
            id: true,
        }
    }))
})
// isse ek post banegi
app.get("/posts/:id", async (req,res) =>{
    return await commitToDB(
        prisma.post.findUnique( {
            where: {
                id: req.params.id 
            },
            select: {
                body: true,
                title: true,
                topic: true,
                comments: {
                    orderBy: {
                        createdat: "desc"
                    },
                    select:{
                        id:true,
                        message: true,
                        createdat: true,
                        parentId: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
            }
        })
    )
})
//signup
app.post("/signup/user", async(req,res)=>{
    if(req.body.email === null || req.body.password=== null || req.body.name===null || req.body.intrest===null){
        return res.send(app.httpErrors.badRequest("Empty fields not allowed "))
    }
    
    if(req.body.email === "" || req.body.password=== "" || req.body.name==="" || req.body.intrest===""){
        return res.send(app.httpErrors.badRequest("Empty fields not allowed "))
    }

    await commitToDB(prisma.user.create({
        data: {
            name: req.body.name,
            password: req.body.password,
            emailId: req.body.email,
            intrest: req.body.intrest,
        }
    }))
    return await commitToDB(prisma.user.findFirst({
        where:{
            emailId: req.body.email,
            password: req.body.password,
        },
        select:{
            id: true,
        }
    }))
})
//comments
app.post("/posts/:id/comments", async(req,res)=>{
    if(req.body.message === "" || req.body.message === null) {
        return res.send(app.httpErrors.badRequest("msg required")
        )
    }

    return await commitToDB(
        prisma.comment.create({
            data: {
                message: req.body.message,
                userId: req.cookies.userId,
                parentId: req.body.parentId,
                postId: req.params.id
            },
            select: COMMENT_SELECT_FIELDS,
        })
    )
}) 
//adding comment
app.put("/posts/:postId/comments/:commentId", async (req, res) => {
    if (req.body.message === "" || req.body.message == null) {
      return res.send(app.httpErrors.badRequest("Message is required"))
    }
  
    const { userId } = await prisma.comment.findUnique({
      where: { id: req.params.commentId },
      select: { userId: true },
    })
  
    return await commitToDB(
      prisma.comment.update({
        where: { id: req.params.commentId },
        data: { message: req.body.message },
        select: { message: true },
      })
    )
})
// login
app.post("/login", async(req, res)=>{
    const uname = req.body.email
    const pword = req.body.password
    console.log(uname)
    return await commitToDB(prisma.user.findFirst({
        where:{
            emailId: uname,
            password: pword,
        },
        select:{
            id: true,
        }
    }))
})
// for regitering post
app.post("/postRegister", async(req, res)=>{
    await commitToDB(prisma.post.create({
        data:{
            email: req.body.email,
            password: req.body.password,
            title: req.body.title,
            body: req.body.body,
            topic: req.body.topic,
            year: req.body.year,
        }
    }))
    return await commitToDB(prisma.post.findFirst({
        where:{
            body: req.body.body,
        },
        select:{
            id: true,
        }
    }))
})

//addupvoteremoveupvote
app.get("/posts/:postID/:userID/upvote", async(req,res)=>{
    const isAvailabe = await commitToDB(prisma.upvotes.findFirst({
        where:{
            userID : req.params.userID,
            postID : req.params.postID,
        },
        select:{
            id: true,
        }
    }))
    console.log(isAvailabe)
    if(isAvailabe===null){
        console.log("creating comment")
         await commitToDB(prisma.upvotes.create({
            data:{
                userID: req.params.userID,
                postID: req.params.postID,
            }
         }))
    }
    // delete
    else{
        console.log("deleting comment")
        await commitToDB(prisma.upvotes.delete({
            where:{
                id: isAvailabe.id,
            }
        }))
        console.log("deleting comment acc to me")
    }
    //number of likes on post
    console.log("returning fucntiianowd")
    return await commitToDB(prisma.upvotes.aggregate({
        where:{
            postID: req.params.postID
        },
        _count:{
            id: true,
        }
    }))

})

//get upvoted for a post
app.get("/upvote/:postID", async(req,res)=>{
    return prisma.upvotes.aggregate({
        where:{
            postID: req.params.postID,
        },
        _count:{
            id: true,
        }
    })
})

//listupvotes
app.get("/allupvotes", async(req,res)=>{
    return await commitToDB(prisma.upvotes.findMany({
        select:{
            id: true,
            userID: true,
            postID: true,
        }
    }))
})

//searchforposts
app.get("/posts/search/:topic", async(req,res)=>{
    return await commitToDB(prisma.post.findMany({
        where:{
            topic: req.params.topic,
        },
        select:{
            title: true,
            body: true,
            topic: true,
            year: true,
        }
    }))
})

//investerRegistration
app.post("/signup/invester", async(req,res)=>{
    console.log(req.body)
    if(req.body.email === null || req.body.password=== null || req.body.name===null || req.body.intrest===null){
        return res.send(app.httpErrors.badRequest("Empty fields not allowed "))
    }
    
    if(req.body.email === "" || req.body.password=== "" || req.body.name==="" || req.body.intrest===""){
        return res.send(app.httpErrors.badRequest("Empty fields not allowed "))
    }

    await commitToDB(prisma.invester.create({
        data: {
            name: req.body.name,
            password: req.body.password,
            emailId: req.body.email,
            intrest: req.body.intrest,
        }
    }))
    return await commitToDB(prisma.invester.findFirst({
        where:{
            emailId: req.body.email,
            password: req.body.password,
        },
        select:{
            id: true,
        }
    }))
    
})

//investerlogin
app.post("/login/invester", async(req,res)=>{
    const uname = req.body.email
    const pword = req.body.password
    
    return await commitToDB(prisma.invester.findFirst({
        where:{
            emailId: uname,
            password: pword,
        },
        select:{
            id: true,
        }
    }))
})


// list upvoted of particular posst
app.get("/upvotes/:postID", async(req,res)=>{
    return await commitToDB(prisma.upvotes.aggregate({
        where:{
            postID: req.params.id,
        },
        _count:{
            id: true,
        }
    }))
})

//suggesting startup to invester
app.put("/suggest/:postID/:invID", async(req,res)=>{
    const isAllowed = await commitToDB(prisma.post.findFirst({
        where:{
            id:req.params.postID,
        },
        select:{
            tokens: true,
        }
    }))

    if(tokens===0){
        res.send(app.httpErrors.badRequest("NAH HO PAYE BHAI"))
    }

    await commitToDB(prisma.suggestion.create({
        data:{
            investerID: req.params.invID,
            postID: req.params.postID,
        }
    }))
    await commitToDB(prisma.post.update({
        where:{
            id:req.params.postID,
        },
        data:{
            tokens: {
                decrement: 1,
            }
        }
    }))
})

//get whole details of invester
app.post("/invester/:id", async(req, res)=>{
    return (await commitToDB(prisma.invester.findFirst({
        where:{
            id: req.params.id,
        },
        select:{
            name: true,
            emailId:true,
            intrest: true,
        }
    })))    
})

async function commitToDB(promise) {
    const [error, data] = await app.to(promise)
    if(error) return app.httpErrors.internalServerError(error.message)
    return data
}


app.listen({ port: process.env.PORT })


