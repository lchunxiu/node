const DB_URL = "mongodb://localhost:9400/spider";
let mongoose = require("mongoose");

// connect to a single node replica set
let db = mongoose.createConnection(DB_URL);

db.on("error",function(error){
    console.log("db error",error);
});

db.on('open', function() {
    console.log("db open");
});
 module.exports = db;
