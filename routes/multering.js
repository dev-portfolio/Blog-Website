var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require ('path');
var methodoverride = require('method-override');
var crypto  = require('crypto');
var multer = require('multer');
var multergridfs = require('multer-gridfs-storage');
var gridfsstream = require('gridfs-stream');



var gfs;
var conn = mongoose.connection;
conn.once('open', function () {
    //Initialize Stream
    gfs = gridfsstream(conn.db,mongoose.mongo);
    gfs.collection('bloguploads');
});

//check for db errors
conn.on('error',function (err) {
    console.log(err);
});

var blog = require('../model/blogmodel');

var imagename;
    var storage = multer.diskStorage({

        destination: './public/uploads/',
        filename: function (req, file, cb) {
            cb(null,  file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

var upload = multer({storage});
var supload = upload.single('file');


router.post('/choosed',supload,function(req,res,next) {
    supload(req, res, function(err)  {

        if(req.file == undefined)
        {
            req.flash('error','File is not uploaded');

            res.render('chooseimagae')
        }
        if (err)
        {
            req.flash('error', 'Please enter valid image file ');
            res.render('chooseimage');
        }

        else {
            imagename=req.file.file;
            res.render('add', {file:req.file} );

        }
    });
});

// Set The Storage Engine using ONLY MULTER
// function middleware(req,res,next) {
//     var imagename;
//     var storage = multer.diskStorage({
//         destination: './public/uploads/',
//         filename: function (req, file, cb) {
//             imagename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
//             cb(null, imagename);
//         }
//     });
//
//     var upload = multer({storage});
//
//     var supload = upload.single('file');
//     supload(req, res, function (err) {
//         req.imagename = imagename;
//         next();
//     })
// }

router.post('/submit/:filename', function(req, res, next) {
    _name=req.params.filename;
   console.log(_name);
     var v = new blog;
    v.title = req.body.title;
    v.description = req.body.description;
    v.date = req.body.date;
    v.tag = req.body.tag;
v.photo=_name;
    v.save();
    req.flash('success_msg', 'Your Blog Has been Added !');
    res.redirect('/bloglists');
});
module.exports = router;