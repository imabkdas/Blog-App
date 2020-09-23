var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");


//INDEX-show all blogs
router.get("/", function(req, res){
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
//CREATE = add new blog to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to blogs array
	var title = req.body.title;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newBlog = {title: title, image: image, description: desc, author: author}
	//create a new blog and save to DB
	Blog.create(newBlog, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/blogs");
		}
	});
});
	
//NEW-show form to create new blog
router.get("/new",middleware.isLoggedIn, function(req, res){
	res.render("blogs/new");
});

//show more info about one blog
router.get("/:id", function (req, res){
	//find  the blog with provided ID
	Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
		if(err){
			console.log(error)
		}else{
			//render show template with that blog
			res.render("blogs/show", {blog: foundBlog});
		}
	});
});
//EDIT blog ROUTE
router.get("/:id/edit", middleware.checkBlogOwnership, function(req,res){
		Blog.findById(req.params.id, function(err, foundBlog){
			res.render("blogs/edit", {blog: foundBlog});
	});
});


//UPDATE blog ROUTE
router.put("/:id", middleware.checkBlogOwnership, function(req, res){
	//find and update the orrect blog
	Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			//redirect somewhere(show page)
			res.redirect("/blogs/" + req.params.id);
		}
	});
	
});

//DESTROY blog ROUTE
router.delete("/:id", middleware.checkBlogOwnership, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	});
});

module.exports = router;
