var localStrategy = require('passport-local').Strategy;

var FacebookStrategy = require('passport-facebook').Strategy;


var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var usermodel = require('../model/userdata');


module.exports = function(passport)
{

    passport.use(new localStrategy({usernameField: 'email'}, function (email, password, done) {
        console.log(password);
        // Match user
        usermodel.findOne({email: email}).then(function (user) {
            if (!user) {
                return done(null, false, {message: 'No User Found'});
            }

// Match password
            bcrypt.compare(password, user.password,function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Password Incorrect'});
                }
            })
        })
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        usermodel.findById(id, function (err, user) {
            done(err, user);
        });
    });


    //Strategy for facebook
    passport.use(new FacebookStrategy({
            clientID: '683544985318133',
            clientSecret: '30e9918a4a4e2ee7a06f0ae235ba48d5',
            callbackURL: "https://localhost:5000/callback",

        },
        function(accessToken, refreshToken, profile, done) {
            usermodel.findOne({'facebook.id': profile.id}, function(err, user) {
                if (err) {

                    return done(err); }
                if (user){

                    return done(null,user);}

                else {
                    var newUser = new usermodel();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = accessToken;
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;

                    newUser.save(function(err){

                        if(err)
                            throw err;
                        return done(null, newUser);
                    });
                    console.log(profile);

                }
           });
        }
    ));

}














