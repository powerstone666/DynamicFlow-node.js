import jwt from "jsonwebtoken";
import {getid,getad} from "./database.js";
export default async function  isAdmin(req,res)
{
  try{
    const id="hello";
          const {token}=req.cookies;

    if(!token)
          {
              return res.status(401).json({
        message:"Not Authorized",
        success:false
      })
          }
    const decoded=jwt.verify(token,process.env.secret);
          
    req.user=await getad(decoded._id);

    return decoded._id;
  }
catch(err)
        {
         
}

}