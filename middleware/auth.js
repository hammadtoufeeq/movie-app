import jwt from 'jsonwebtoken'

export async function authMiddleware(req,res,next){
    try{
        const token = req.cookies.accesstoken;
        if(!token){
            const error = new Error("Unauthorized");
            error.statusCode = 401;
            return next(error);
        }
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET) // assign the payload in the variable , payload includes expire time toooo !!!!!!!!!
        req.user = decoded;
        next();
    }catch(error){
        error.statusCode = 401;
    error.message = "Unauthorized - Invalid or expired token";
    next(error);
    }
}
export function restrictTo(...allowedRoles){
    return(req,res,next)=>{
        if(!allowedRoles.includes(req.user.role)){
            const error = new Error("Forbidden - You don't have permission for this action");
            error.statusCode=403;
            return next(error);
        }
        next();
    }
}