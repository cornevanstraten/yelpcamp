//all the middleware goes here
var middlewareObj = {}
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");


middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err || !foundCampground) {
                req.flash("error", "404 campground not found");
                res.redirect("back");
            } else {
                    if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) { 
                        next();
                    } else {
                            req.flash("error", "You don't have permission to do that");
                            res.redirect("back") 
                        }
            }
            });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "404 comment not found");
                res.redirect("back");
            } else{
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){ next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "Please login first");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //!IMPORTANT: always put flash before the redirect
    req.flash("error", "Please login first");
    res.redirect("/login");
}








module.exports = middlewareObj