const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
{
    category: 
    {
        type: String,
    },

    title: 
    {
        type: String,
        required: true,
    },

    author: 
    {
        type: String,
    },

    date:
    {
        type: Date,
    },

    img: 
    {
        type: String,
    },

   text: 
    {
        type: String,
    }  
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
