var mongoose = require("mongoose");




//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: {type: Date, default: Date.now},
    author: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                    },
                username: String
            },
    //the comments property doesn't hold the actual comments, only a reference to them
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        
    ]
});
var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = mongoose.model("Campground", campgroundSchema);