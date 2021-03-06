var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash       = require("connect-flash"),
    Article  = require("./models/article"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seed");
    
var indexRoutes = require("./routes/index"),
    commentsRoutes = require("./routes/comments"),
    articlesRoutes = require("./routes/articles");

//mongoose.connect("mongodb://localhost/articlecamp");
mongoose.connect(process.env.DATABASEURL);//environment variable for the database url
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Max is the best", //here use anything
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this code is using a middleware where it passes
// to all routes the local variable currentUser 
// so we can see if the user is logged in
// we do that so as not to do it manually to every route
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.errorMessage = req.flash("error");
   res.locals.successMessage = req.flash("success");
   next();// this will run the next method
});

//requiring routes
app.use(indexRoutes);
app.use("/articles",articlesRoutes); // so every route in articleRoutes will start with /articles
app.use("/articles/:id/comments",commentsRoutes);

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("The ArticleCamp Server has started!");
});