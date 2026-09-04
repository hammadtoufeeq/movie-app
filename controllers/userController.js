import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../model/userModel.js';

export async function register(req,res,next){
    try{
        const { email , password } = req.body;
        if(!email || !password){
            const error = new Error("Email and password are required");
            error.statusCode = 400;
            return next(error);
        }
        const existingUser = await userModel.findOne({
            email : email
        })
        if(existingUser){
            const error = new Error("User already exists");
            error.statusCode = 400;
            return next(error);
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await userModel.create({
            email : email,
            password : hashedPassword
        })
        res.status(201).json({message : "User registered successfully", userId : newUser._id})
    }catch(error){
        next(error)
    }
}
export async function login(req,res,next){
    try{
        const { email , password } = req.body;
        if(!email || !password){
            const error = new Error("Email and password are required");
            error.statusCode = 400;
            return next(error);
        }
        const user = await userModel.findOne({email : email});
        if(!user){
            const error = new Error("Invalid Credentials");
            error.statusCode = 400;
            return next(error);
        }
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            const error = new Error("Invalid Credentials");
            error.statusCode = 401;
            return next(error);
        }
        const accessToken = jwt.sign(
            {userId : user._id , role : user.role},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : '1m'}
        );
        const refreshToken = jwt.sign(
            {userId : user._id , role : user.role},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn : '7d'}
        );
        res.cookie('accesstoken',accessToken, {
            httpOnly : true,
            secure : false,
            sameSite : 'strict',
            maxAge : 1*60*1000
        });
        res.cookie('refreshtoken',refreshToken, {
            httpOnly : true,
            secure : false,
            sameSite : 'strict',
            maxAge : 7*24*60*60*1000
        });
        return res.status(200).json({message : "Login Successful"})
    }catch(error){
        next(error)
    }
}
export async function refreshAccessToken(req,res,next){
    try{
       const refreshtoken = req.cookies.refreshtoken;
       if(!refreshtoken){
        const error = new Error("Unauthorized - No refresh token")
        error.statusCode = 401;
        return next(error);
       } 
       const decoded = jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET)
       const newAccessToken = jwt.sign(
        {userId : decoded.userId , role : decoded.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : '1m'}
       )
       res.cookie('accesstoken',newAccessToken,{
        httpOnly : true,
        secure : false,
        sameSite : 'strict',
        maxAge : 1*60*1000
       });
       return res.status(200).json({message : "Access token refreshed"})

    }catch(error){
        error.statusCode = 401;
        error.message = "Unauthorized - Invalid or expired refresh token";
        next(error);
    }
}
export async function getMe(req, res, next) {
    try {
        return res.status(200).json({ userId: req.user.userId, role: req.user.role });
    } catch (error) {
        next(error)
    }
}
export async function logout(req,res,next){
    try{
        res.clearCookie('accesstoken');
        res.clearCookie('refreshtoken');
        return res.status(200).json({message : "logged out successfully"})
    }
    catch(error){
        next(error);
    }
}