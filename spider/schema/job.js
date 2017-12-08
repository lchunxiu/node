let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let JobSchema = new Schema({
    url:String,
    company:String,
    position:String,
    tag:Array,
    salary:String,
    experience:String,
    education:String,
    worktime:String,
    location:{
        city:String,
        region:String,
        extra:String
    },
    des:String,
    publishtime:Date,
    publisher:String,
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = JobSchema;

