var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Create Schema
var UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    facebook:
        {
        id: String,
        token: String,
        email: String,
        name: String
}
});
var usermodel = module.exports = mongoose.model('GOBIUSER', UserSchema);
