var mongoose = require("mongoose");
var Campground = require("./models/campground");
var comment   = require("./models/comment");
var data =[
	{
		name: "Cloud's Rest",
		image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum fringilla arcu, vel dictum nulla tincidunt a. Curabitur sit amet aliquam dui. Quisque eu porttitor dolor, eu lacinia ipsum. Sed eget vulputate orci. Integer semper leo leo, a finibus erat sagittis eget. Morbi viverra egestas convallis. Phasellus quis scelerisque nibh, eu dictum nisl. Duis sed tristique diam, vel commodo sem. Mauris laoreet sit amet nulla non sodales. Quisque non finibus diam. Donec in fringilla velit. Sed consectetur tortor in posuere sodales. Vestibulum varius tempus posuere."
	},
	{
		name: "K2",
		image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum fringilla arcu, vel dictum nulla tincidunt a. Curabitur sit amet aliquam dui. Quisque eu porttitor dolor, eu lacinia ipsum. Sed eget vulputate orci. Integer semper leo leo, a finibus erat sagittis eget. Morbi viverra egestas convallis. Phasellus quis scelerisque nibh, eu dictum nisl. Duis sed tristique diam, vel commodo sem. Mauris laoreet sit amet nulla non sodales. Quisque non finibus diam. Donec in fringilla velit. Sed consectetur tortor in posuere sodales. Vestibulum varius tempus posuere."
	},
	{
		name: "himalaya",
		image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum fringilla arcu, vel dictum nulla tincidunt a. Curabitur sit amet aliquam dui. Quisque eu porttitor dolor, eu lacinia ipsum. Sed eget vulputate orci. Integer semper leo leo, a finibus erat sagittis eget. Morbi viverra egestas convallis. Phasellus quis scelerisque nibh, eu dictum nisl. Duis sed tristique diam, vel commodo sem. Mauris laoreet sit amet nulla non sodales. Quisque non finibus diam. Donec in fringilla velit. Sed consectetur tortor in posuere sodales. Vestibulum varius tempus posuere."
	}
]

function seedDB(){
	// Remove allcampgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds!");
	// added a campground
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
				if(err){
					console.log(err)
				}else{
					console.log("added a campground");
					//create a comment
					Comment.create(
					{
						text: "kya hi mast jagah hai ye!!!",
						author: "Anand"
					}, function(err, comment){
						if(err){
							console.log(err);
						}else{
							campground.comments.push(comment);
							campground.save();
							console.log("created a new comment");
						}
					});
				}
			});
		});
	});
}

module.exports = seedDB;