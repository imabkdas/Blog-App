var dotenv			= require('dotenv').config();
var express 		= require("express"),
		app 		= express(),
 bodyParser 		= require("body-parser"),
 mongoose   		= require("mongoose"),
 passport   		= require("passport"),
 session 			= require('express-session')
 flash				= require('connect-flash'),
 LocalStrategy 		= require("passport-local"),
 methodOverride 	= require("method-override"),
 Blog 				= require("./models/blog"),
 Comment    		= require("./models/comment"),
 User       		= require("./models/user");
 async 				= require('async'),
 nodemailer  		= require('nodemailer'),
 crypto 			= require('crypto');

var commentRoutes 	= require("./routes/comments"),
 	blogRoutes 		= require("./routes/blogs"),
 	indexRoutes     = require("./routes/index");

//mongoose.connect('mongodb://localhost:27017/edit', {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.URL, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed the database
//seedDB();

//passport cofiguration
app.use(require("express-session")({
	secret: "blah blah blah",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.get("/", function(req, res){
	//get all blogs from DB
	Blog.find({}, function(err, allblogs){
		if(err){
			console.log(err);
		}else{
			res.render("blogs/index", {blogs:allblogs});
		}
	});
	//res.render("blogs", {blogs:blogs});
});

app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, function(){
	console.log("server started");
});