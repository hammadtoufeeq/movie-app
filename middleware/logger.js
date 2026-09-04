export async function logger(req,res,next){
    console.log(`[LOG] : ${req.method} request to ${req.url}`)
    next();
}
