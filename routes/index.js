var dotenv      = require("dotenv").config();
var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user.js");
var Campground  = require("../models/campground.js");
var async       = require("async");
var nodemailer  = require("nodemailer");
var crypto      = require("crypto");

//ROOT route
router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res){
   res.render("register"); 
});
//handle register/signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    // eval(require("locus"));
    if(req.body.adminCode === "PR4X!$"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message)
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelpcamp " + user.username)
            res.redirect("/campgrounds"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req, res){
    
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out")
    res.redirect("/campgrounds");
})

//forgot password
router.get("/forgot", function(req, res){
    res.render("forgot");
});

router.post("/forgot", function(req, res){
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          User.findOne({ email: req.body.email }, function(err, user) {
            if (!user) {
              req.flash('error', 'No account with that email address exists.');
              return res.redirect('/forgot');
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
              var smtpTransport = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                  user: 'vanstratenc@gmail.com',
                  pass: process.env.GMAILPW
                }
              });
              var mailOptions = {
                to: user.email,
                from: 'learntocodeinfo@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
              };
              smtpTransport.sendMail(mailOptions, function(err) {
                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
              });
            }
          ], function(err) {
            if (err) return next(err);
            res.redirect('/forgot');
          });
});



module.exports = router;