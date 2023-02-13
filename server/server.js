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

//list all investers FOR DEBUGGING
app.get("/allInvester", async(req,res)=>{
    return await commitToDB(prisma.invester.findMany({
        select: {
            id: true,
            name: true,
            emailId: true,
            intrest: true,
        }
    }))
})  
  
// GET ALL POSTs(STARTUPS)
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

//display all user FOR DEBUGGING ONLY
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

// RETURNS STARTUP RELATED TO USER with HIS/HER INTREST
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

// TO GET A POST WITH COMMENTS TOO IG DO NOT EDIT
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
                upvotescount: true,
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

//comments DO NOT CHANGE ANY COMMENT RELATED BACKEND 
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

//adding comment DO NOT CHANGE ANY COMMENT RELATED BACKEND 
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

//addupvoteremoveupvote AND Return count for now upadted likes on that post
app.post("/posts/:postID/:userID/upvote", async(req,res)=>{
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
        console.log("creating upvotes")
         await commitToDB(prisma.upvotes.create({
            data:{
                userID: req.params.userID,
                postID: req.params.postID,
            }
         }))
         await commitToDB(prisma.post.update({
            where:{
                id: isAvailabe.id,
            },
            data: {    
                upvotescount :{
                    increment: 1,
                }
            }
        }))

    }
    // delete
    else{
        console.log("deleting upvote")
        await commitToDB(prisma.upvotes.delete({
            where:{
                id: isAvailabe.id,
            }
        }))
        await commitToDB(prisma.post.update({
            where:{
                id: isAvailabe.id,
            },
            data: {    
                upvotescount :{
                    decrement: 1,
                }
            }
        }))
        console.log("deleting comment acc to me")
    }
    //number of ipvotes on post
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

//listupvotes FOR POSTMAN ONLY
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
            upvotecount: true,
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

//SCHEMA CONTAINS A SUGGESTION if A STARTUP WANT TO SUGGEST HIS STARTUP TO INVESTER WITH DEDUCTION OF A TOOKEN 
// AND RETURN HOLE POST DETAILS WITH NEW TOKENS COUNT
app.post("/:inv_id/suggest/:post_id", async(req,res)=>{
    await commitToDB(prisma.suggestion.create({
        data: {
            investerID: req.params.inv_id,
            postID: req.params.post_id,
        }
    }))

    await commitToDB(prisma.post.update({
        where:{
            id: req.params.post_id,
        },
        data: {
            tokens:{
                decrement: 1,
            }
        }
    }))

    return await commitToDB(prisma.post.findFirst({
        where:{
            id: req.params.post_id,
        },
        select:{
            email: true,
            title: true,
            body: true,
            topic: true,
            year: true,
            upvotescount: true,
            tokens:true,
        }
    }))
})

// get all auggestion on invester side
app.get("/suggestion/:inv_id", async(req,res)=>{
    const postids = await commitToDB(prisma.suggestion.findMany({
        where:{
            investerID: req.params.inv_id,
        },
        select:{
            postID: true,
        }
    }))

    return await commitToDB(prisma.post.findMany({
        where:{
            id: {
                in: postids.map(postid=>postids.postID)
            }
        },
        select:{
            id: true,
            email: true,
            title: true,
            body: true,
            topic: true,
            upvotescount: true,
        }
    }))
})

// REturns the invester details to whom a post(startup has) done given his suggestion
app.get("/suggestion/:post_id", async(req,res)=>{
    const investerids = await commitToDB(prisma.suggestion.findMany({
        where:{
            investerID: req.params.inv_id,
        },
        select:{
            investerID: true,
        }
    }))

    return await commitToDB(prisma.invester.findMany({
        where:{
            id: {
                in: investerids.map(investerid=>investerids.investerID)
            }
        },
        select:{
            id: true,
            name: true,
            intrest: true,
            emailId: true,
        }
    }))
})

async function commitToDB(promise) {
    const [error, data] = await app.to(promise)
    if(error) return app.httpErrors.internalServerError(error.message)
    return data
}


app.listen({ port: process.env.PORT })


