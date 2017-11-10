var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");


var data = [
        {
            name: "Cloud's rest", 
            image: "https://farm5.staticflickr.com/4424/37433523451_182d529034.jpg",
            description: "Where clouds find refuge. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta, orci in finibus lobortis, nisi urna dictum felis, id consectetur odio mi non ante. Vestibulum vestibulum urna ultrices mauris luctus, auctor pretium leo hendrerit. Aliquam ornare, elit sit amet bibendum lacinia, dui sapien tempor orci, et accumsan lacus augue a ex. Cras sagittis dui ex, a vulputate lorem venenatis et. Aliquam lorem urna, auctor ut semper quis, dapibus ut risus. Pellentesque in condimentum nunc. Nunc malesuada mauris vitae erat porta pellentesque. Integer tincidunt pellentesque sodales."
        },
        {
            name: "The dark night descends", 
            image: "https://farm9.staticflickr.com/8596/16607370361_d1fa699a16.jpg",
            description: "But nobody bats an eye. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta, orci in finibus lobortis, nisi urna dictum felis, id consectetur odio mi non ante. Vestibulum vestibulum urna ultrices mauris luctus, auctor pretium leo hendrerit. Aliquam ornare, elit sit amet bibendum lacinia, dui sapien tempor orci, et accumsan lacus augue a ex. Cras sagittis dui ex, a vulputate lorem venenatis et. Aliquam lorem urna, auctor ut semper quis, dapibus ut risus. Pellentesque in condimentum nunc. Nunc malesuada mauris vitae erat porta pellentesque. Integer tincidunt pellentesque sodales."
        },
        {
            name: "Moonlight shadow", 
            image: "https://farm8.staticflickr.com/7383/9438432971_8edc43e468.jpg",
            description: "Carry me away. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porta, orci in finibus lobortis, nisi urna dictum felis, id consectetur odio mi non ante. Vestibulum vestibulum urna ultrices mauris luctus, auctor pretium leo hendrerit. Aliquam ornare, elit sit amet bibendum lacinia, dui sapien tempor orci, et accumsan lacus augue a ex. Cras sagittis dui ex, a vulputate lorem venenatis et. Aliquam lorem urna, auctor ut semper quis, dapibus ut risus. Pellentesque in condimentum nunc. Nunc malesuada mauris vitae erat porta pellentesque. Integer tincidunt pellentesque sodales."
        }
    ]


function seedDB(){
    //remove all existing data from campgrounds MongoDB collection
    Campground.remove({}, function(err){
        if (err) {
            console.log(err);
        } else {
                console.log("removed all campgrounds");
                //add a few campgrounds
                data.forEach(function(seed){
                    Campground.create(seed, function(err, campground){
                        if (err){
                            console.log(err);
                        } else {
                            console.log("added a campground");
                            //add a comment
                            Comment.create(
                                {
                                    text: "This place is great, except I wish there was internet.",
                                    author: "Homer"
                                }, function(err, comment){
                                    if(err) {
                                        console.log(err);
                                    } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                    }
                                });
                        }
                    });
                    });
                }
         });
}

module.exports = seedDB;