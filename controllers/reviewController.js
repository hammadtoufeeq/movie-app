import moviemodel from "../model/movieModel.js";
import reviewmodel from "../model/reviewModel.js";

export async function createreview(req , res , next) {
    try{
     const movieId = req.params.movieId;
     const { user , comment , stars } = req.body;
     if(!user || !comment || !stars){
        const error = new Error("All fields are required");
        error.statusCode= 400;
        return next(error)
     }
     const movie = await moviemodel.findById(movieId)
     if(!movie){
        const error = new Error("Movie not found");
        error.statusCode = 404;
        return next(error);
     }
     const newreview = await reviewmodel.create({
        movieId : movieId,
        user : user,
        stars : stars ,
        comment : comment
     });
     movie.reviews.push(newreview._id);
     await movie.save();
     return res.status(201).json(newreview)
        

    }catch(error){
        next(error)
    }
}
export async function deletereview(req,res,next){
    try{
    const reviewId = req.params.reviewId;
    const movieId = req.params.movieId;
    
    const deletedreview = await reviewmodel.findByIdAndDelete(reviewId);
    if(!deletedreview){
        const error = new Error("Review not found");
        error.statusCode = 404;
        return next(error);
    }
    await moviemodel.findByIdAndUpdate(movieId,{
      $pull : {reviews : reviewId}
    })
    return res.status(200).json({ message: "Review deleted successfully" });

    }catch(error){
       next(error)
    }
}