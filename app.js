//DEPENDENCIES
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds.js");

//requiring ROUTES
var commentRoutes       = require("./routes/comments"), 
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index")

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"

mongoose.connect(url, {useMongoClient: true})
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//Tell our app to serve the public directory 
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();


//PASSPORT Config
app.use(require("express-session")({
    secret: "I love Katie and Calvin",
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//adding own little middleware
app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server for YelpCamp has started! \n[press ctrl+c to quit]");
});