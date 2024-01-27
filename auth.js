import jwt from "jsonwebtoken";
import {getid} from "./database.js";
export default async function  isAuthen(req,res)
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
          
    req.user=await getid(decoded._id);

    return decoded._id;
  }
catch(err)
        {
         
}

}