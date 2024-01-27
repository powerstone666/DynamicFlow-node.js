import  express  from "express";
import cors from "cors";
import {getUser,getEmail,createUser,getadmin,edit,deleteUser,getid,noteadd,editnote,getnotes,deletenote,getnote,setnote} from "./database.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendCookie from "./cook.js";
import cookieParser from "cookie-parser";
import isAuthen from "./auth.js";
// app.js (main entry file)
import dotenv from 'dotenv';
import isAdmin from "./admin.js";
dotenv.config();

// Rest of your application setup...

const server=express(); 
server.use(express.json())
server.use(cookieParser())
const corsOptions = {
    origin:process.env.FRONTEND_URL, // Update this with your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 204, // Set the response to preflight requests to 204
};


server.use(cors(corsOptions));

server.get("/view",async (req,res)=>{
      
    try{
     await isAdmin(req,res);
   const show=await getUser();
    res.json(show);
    }
    catch(err)
    {
       
    }
})

server.post("/register", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        let user = await getEmail(email);
        if (user) {
            return res.status(400).json({
                message: "UserAlreadyExist",
                success: false
            });
        }
  
        const hashpass = await bycrypt.hash(password, 10);
        user = await createUser(firstname, lastname, email, hashpass);

          sendCookie(user, res,"Registered Succesfully",200);

    } catch (err) {
      
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

server.post("/login",async (req,res)=>{
try{

     const {email,password}=req.body;
    let user=await getEmail(email);
    if(!user)
    {
           return res.status(400).json({
                message:"UserDoesNotExist",
                success:false

            })
    }
    const ismatch=await bycrypt.compare(password,user.password);
    if(!ismatch)
    {
      res.status(400).json({
            message:"IncorrectPassword or Email",
            success:false
        })
    }
    sendCookie(user,res,`Logged In Successfully ${user.firstname}`,200);
}
catch(e){
        console.log(e)
    }
})

server.get("/profile",async (req,res)=>{
    try{
             const user= await isAuthen(req,res);
             
          res.status(200).json({
                success:true,
                user:req.user
            })
    }
    catch(e)
    {
      
            }
})

server.post("/logout",async (req,res)=>{
    await isAuthen(req,res);
  res.status(200).cookie("token"," ",{
        maxAge:1,
        httpOnly:true,
        sameSite:"none",
        secure:"false"
    }).json({
        success:true,
        message:"Logged out Successfully"
    })
})
server.post("/noteedit" ,async (req,res)=>{
   const a= await isAuthen(req,res);
    try{

        const {title,note,id}=req.body;
        await editnote (title,note,a,id);
        return res.status(200).json({
            success:true,
            message:"Updated Successfully"
        })
    }
    catch(e)
    {
       
        }
})
server.post("/noteadd" ,async (req,res)=>{
    const a= await isAuthen(req,res);
try{
        const {title,note}=req.body;
  
   
      await noteadd (title,note,a);
        return res.status(200).json({
        success:true,
        message:"Added Successfully"
      })
    }
    catch(e)
    {
  
      }
})
server.get("/noteview",async (req,res)=>{
    const a= await isAuthen(req,res);
    try{
        const show=await getnotes(a);
      res.status(200).json({
            success:true,
            show
        })

    }
    catch(err)
    {
       
            }
})

server.post("/adminlogin", async (req,res)=>{
    try{
      const {email,password}=req.body;
       let user=await getadmin(email);
       if(!user)
       {
               res.status(400).json({
                   message:"UserDoesNotExist",
                   success:false

               })
       }
       const ismatch=await bycrypt.compare(password,user.password);
       if(!ismatch)
       {
           res.status(400).json({
               message:"IncorrectPassword or Email",
               success:false
           })
           return;
       }
       sendCookie(user,res,`Logged In Successfully ${user.firstname}`,200);
   }
   catch(e){
     
          }
})

server.get("/adminview",async (req,res)=>{

    try{
        await isAdmin(req,res);
    const {token}=req.cookies;

    if(!token)
    {
        return res.status(401).json({
            message:"Not Authorized",
            success:false
        })
    }
       const use= await getUser();
       return res.status(200).json({
           success:true,
           use
       })
    }
    catch{
      
            }
})
server.delete("/delete/:id",async (req,res)=>{
    try{
        await isAdmin(req,res);
        const {token}=req.cookies;

        if(!token)
        {
            return res.status(401).json({
                message:"Not Authorized",
                success:false
            })
        }
        const {id}=req.params;
        await deleteUser(id);
        return res.status(200).json({
            success:true,
            message:"Deleted Successfully"
        })
    }
    catch(err)
    {
       
            }
})
server.delete("/notedel/:id",async (req,res)=>{
    await isAuthen(req,res);
    try{
        const {id}=req.params;
        await deletenote(id);
        return res.status(200).json({
            success:true,
            message:"Deleted Successfully"
        })
    }
    catch(err)
    {
        
            }
})
server.put("/edit/:id",async (req,res)=>{
    try{
        await isAdmin(req,res);
    const {token}=req.cookies;

    if(!token)
    {
        return res.status(401).json({
            message:"Not Authorized",
            success:false
        })
    }
        const {id}=req.params;
        const {firstname,lastname,email}=req.body;
        await edit(id,firstname,lastname,email);
        return res.status(200).json({
            success:true,
            message:"Updated Successfully"
        })
    }
    catch(err)
    {
      
            }
})
server.get("/viewid/:id",async (req,res)=>{
    try{
        await isAdmin(req,res);
    const {token}=req.cookies;

    if(!token)
    {
        return res.status(401).json({
            message:"Not Authorized",
            success:false
        })
    }
        const {id}=req.params;

        const use=await getid(id);
        return res.status(200).json({
            success:true,
            use
        })
    }
    catch(err)
    {
      
            }

})
server.get("/noteid/:id",async (req,res)=>{
   const a= await isAuthen(req,res);
    try{

        const {id}=req.params;

        const use=await getnote(id,a);
     
        return res.status(200).json({
            success:true,
            use
        })
    }
    catch(err)
    {
        
            }
})
server.post("/noteedit/:id",async (req,res)=>{
    const a= await isAuthen(req,res);
     try{

         const {id}=req.params;
        const {title,note}=req.body;
        
         const use=await setnote(id,a);
         return res.status(200).json({
             success:true,
             use
         })
     }
     catch(err)
     {
         
              }

 })
server.listen(5000,()=>{
    console.log("Server is running on port:5000")
})