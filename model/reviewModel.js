import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    movieId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Movie',
        required : true
    },
    user:{
        type : String,
        required : true
    },
    comment:{
        type: String,
        required : true
    },
    stars:{
        type : Number,
        required : true,
        min : 1,
        max : 10
    }
})

export default mongoose.model("Review",reviewSchema);