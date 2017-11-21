//==================
//CAMPGROUND ROUTES
//==================


var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware/index.js");
var geocoder = require("geocoder");



//INDEX - show all campgrounds
router.get("/", function(req, res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        Campground.find({name: regex}, function(err, foundCampgroundz){
            if (err) {
                console.log(err)
            } else {
                if(foundCampgroundz.length < 1){
                    req.flash("error", "We didn't find any campgrounds matching your search");
                    return res.redirect("back");
                }
                res.render("campgrounds/index", {campgrounds: foundCampgroundz});
            }
        });
    } else {
        Campground.find({}, function(err, allCampgrounds){
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds});
            }
        });
    }
});



//CREATE - add new campground to database
//RESTful convention is that <add a new thing> should be a post request to the same url as the overview of all 'things'
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form (by accessing body from the POST request) and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author =    {
                    id: req.user._id,
                    username: req.user.username
                    }
    
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCampground = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
            //might also want to redirect user back to the form and display an error message
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});


//NEW - form to enter a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")    
});


//SHOW - more info about a campground (product detail page)
router.get("/:id", function(req, res){
    //find the campground with the provided ID
    //Use the mongoose method findById(Id, callback)
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "404 campground not found");
            res.redirect("back")
        } else {
            //render the show template for the provided campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
                        if(err){
                            req.flash("error", "Campground not found")
                        } else {
                             res.render("campgrounds/edit", {campground: foundCampground});
                        }
                    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find correct campground & update its contents
    geocoder.geocode(req.body.campground.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    // var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    var newData = {name: req.body.campground.name, image: req.body.campground.image, description: req.body.campground.description, price: req.body.campground.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});
    
    
    
    
    
    
    
    
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//         if (err) {
//             console.log(err);
//             res.redirect("/campgrounds")
//         } else {
//             res.redirect("/campgrounds/" + req.params.id)
//         }
//     });
// });

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})


function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;