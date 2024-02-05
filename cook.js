import jwt from "jsonwebtoken";

export default function sendCookie(user, res, message, statusCode = 200) {
    try {
        const token = jwt.sign({
            _id: user.id
        }, process.env.secret);

     

       res.status(statusCode).cookie("token", token, {
            httpOnly: true,
            maxAge:  5*60*60 * 60 * 1000,
            sameSite:"none",
            secure:"true"
        }).json({
            success: true,
            message: message
        });
    } catch (e) {
       
            }
}
