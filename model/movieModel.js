import mongoose from "mongoose";
import reviewmodel from "./reviewModel.js";
const movieschema = new mongoose.Schema({
    title:{
        type: String,
        required : true,
        unique: true
    },
    genre:{
        type: String,
        required : true,
        index : true
    },
    rating:{
        type: Number,
        required : true
    },
    releaseyear:{
        type: Number,
        required : true,
    },
    poster : {
        type : String,
        required : false
    },
    reviews:[
        {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Review'
        }
    ]
})
movieschema.post('findOneAndDelete' , async function(doc){
    if(doc){
        await reviewmodel.deleteMany({ movieId : doc._id })
    }
})
export default mongoose.model("Movie",movieschema);
