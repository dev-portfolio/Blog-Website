var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema
({
    photo: {type:String},
    title:{type: String, required: true},
    description:{type: String, required: true},
    date: {type: Date, Default:Date.now()},
    tag:{type:String , required:true},
});

var blog = module.exports=mongoose.model('GOBI', blogSchema);