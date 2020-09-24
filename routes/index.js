var dotenv      = require('dotenv').config();
var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
var session       = require('cookie-session');
var User 		= require("../models/user");
var Blog 		= require("../models/blog");
var async 		= require('async');
var nodemailer  = require('nodemailer');
var crypto 		= require('crypto');

//requirung routes
router.get("/", function(req, res){
	res.render("landing");
});
//Show register form
router.get("/register", function(req, res){
	res.render("register");
});
//handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({
  username: req.body.username,
  email:req.body.email,
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  avatar: req.body.avatar
  });
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/blogs");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login");
});

//handling login logic
//app.post("/login", middleware, callback);
router.post("/login",passport.authenticate("local",
	{
		successRedirect: "/blogs",
		failedRedirect: "/login"
	}), function(req, res){
	
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You out!!!")
	res.redirect("/blogs");
});

//User profile
router.get("/users/:id", function (req, res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      req.flash("error", "Something went wrong.");
      return res.redirect('/');
    }
    Blog.find().where('author.id').equals(foundUser._id).exec(function(err, blogs) {
      if(err){
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
      res.render("users/show", {user: foundUser, blogs: blogs});
    })
  })
})

//forget password
router.get('/forgot', function(req, res){
	res.render('forgot');
})

router.post('/forgot', function(req, res, next) {
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
        user.resetPasswordExpires = Date.now() + 36000000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: 'Gmail', 
        auth: {
          user: 'dasabhishek294@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'dasabhishek294@gmail.com',
        subject: 'Blog Post password reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + 'obscure-springs-49161.herokuapp.com' + '/reset/' + token + '\n\n' +
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

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'dasabhishek294@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'dasabhishek294@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/blogs');
  });
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;