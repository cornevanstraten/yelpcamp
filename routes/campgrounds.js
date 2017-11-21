//==================
//CAMPGROUND ROUTES
//==================


var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var middleware = require("../middleware/index.js");



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
        Campground.find({}, function(err, campgroundz){
            if (err) {
                console.log(err)
            } else {
                res.render("campgrounds/index", {campgrounds: campgroundz});
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
    var newCampground = {name: name, price: price, image: image, description: desc, author: author}
    //create new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
            //might also want to redirect user back to the form and display an error message
        } else {
            //redirect back to campgrounds page (default redirect is get request)
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
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
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

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