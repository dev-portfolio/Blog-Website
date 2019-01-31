var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');



var passporta = require('../config/passport')(passport);

// SCHEMA For Blog
var blog = require('../model/blogmodel');


//Schema For User
var usermodel = require('../model/userdata');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GobiesBlog' });
});

router.get('/add', function(req, res, next) {
    res.render('add');
});

router.get('/bloglists', function(req, res, next) {
    blog.find().then(function(blogs)
    {
        res.render('bloglists',{go:blogs});
    });

    router.get('/editblog', function(req, res, next) {
            res.render('editblog')});

    });

router.get('/aditblog/:id',function(req,res,next)
{
    var id = req.params.id;
        blog.findOne({_id:id}).then(function (doc,err)  {

            if(err)
            {
                console.log('We canT match id with database to edit');
                console.log(err);
                res.redirect('/');
            }
            else {
                // console.log(doc);
                res.render('aditblog',{s:doc});
            }
        })

});

router.post('/edited/:id',function(req,res,next)
{

    blog.findOne({_id: req.params.id}).then(function(doc ) {
        // new values
        doc.title = req.body.title;
    doc.description = req.body.description;
  doc.date=req.body.date;
  doc.tag=req.body.tag;
        doc.save().then(function(idea){
            req.flash('success_msg', 'YOUR BLOG HAS BEEN EDITED !');
            res.redirect('/bloglists');})
    });
});

router.get('/delete/:id',function(req,res,next)
{
    var id = req.params.id;
blog.findOneAndRemove({_id:id}).then(function(doc){
    if(doc){
        console.log('Congratulations this object is removed:   ' +doc);
        req.flash('success_msg', 'YOUR BLOG HAS BEEN DELETED !');
        res.redirect('/bloglists');
    }
})
});

router.get('/signup', function(req,res,next) {
    res.render('signup');
});

router.post('/signinup', function(req,res,next)
{
    var errors2 = [];

    if(req.body.password !== req.body.password2)
    {
        errors2.push({text:'Passwords do not match'});
    }

    if(req.body.password.length < 8 )
    {
        errors2.push({text:'Password must be at least 8 characters'});
    }
    // if(req.body.password !== Number && req.body.password === String ){
    //     errors2.push({text:'Password Must Contain Numbers'});
    //
    // }
//     if (!(req.body.password == Number)) {
//     errors2.push({text: 'Password Must be a NUMBER !'});
//
// }

    if(errors2.length > 0)
    {
        errors2.push({text:'Number of errors greater than 0 '});

        // req.flash('errors2','errors2');
        res.render('signup',
            { errors2:errors2, username: req.body.username, email:req.body.email,  phone:req.body.phone,password:req.body.password, password2:req.body.password2});
    }
    else {
        usermodel.findOne({email: req.body.email}).then(function(user)
        {
            if(user)
            {
                req.flash('error_msg', 'Email already regsitered ,Try with some other');
                res.redirect('/signup');
            }
            else
                {
                var newUser = new usermodel({name: req.body.username, email: req.body.email, password: req.body.password,phone:req.body.phone});

                bcrypt.genSalt(10, function(err, salt){
                    bcrypt.hash(newUser.password, salt, function(err, hash)  {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save().then(function(user) {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/login');
                        })
                            .catch(function(err) {
                                console.log(err);
                                return;
                            });
                    });
                });
            }
        });
    }
});

router.get('/login',function(req,res,next)
{
    res.render('login');
});
router.post('/loggedin',function(req,res,next)
{
    passport.authenticate('local', {
        successRedirect:'/blogs',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);

});

router.get('/blogs',function(req,res,next) {
    blog.find().then(function (blogs) {
        res.render('blogs', {blog1: blogs});
    });
});
router.get('/chooseimage',function(req,res,next)
{
    res.render('chooseimage');

});

router.get('/facebook1', passport.authenticate('facebook', {scope: ['email']}));

//callback from facebook is here below
router.get('/callback',passport.authenticate('facebook', {successRedirect: '/blogs', failureRedirect: '/login', failureFlash : true }));


module.exports = router;
