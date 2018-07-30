const mongodb = require('mongodb');
const assert = require('assert');


let mongoClient = mongodb.MongoClient;
let url = 'mongodb://admin:password123@ds153841.mlab.com:53841/afroturf';


// Use connect method to connect to the server
// mongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//   db.close();
// });


// mongoClient.connect(url, (err, db) => {
//     if (err) throw err;
//     let dbo = db.db("mydb");
//     let myobj = { name: "Company Inc", address: "Highway 37" };
//     dbo.collection("customers").insertOne(myobj, (err, res) => {
//       if (err) throw err;
//       console.log("1 document inserted");
//       db.close();
//     });
//   });

function getSalonByName(dbo, name, callback){
 // console.log("SALONS SEARCHING FOUNDING");
  dbo.collection("salons").find({name:name})
 .toArray(function (err, items) { 
   if (items.length > 0) {
      


     let salon = JSON.stringify(items[0]);
     //item = yield salon; 
     callback(salon);
      
     }
   });

};


mongoClient.connect(url, {useNewUrlParser : true}).then(db => {
  //yield db;
  //let myobj = { name: "Company Inc", address: "Highway 37" };
  console.log("DB CONNECTED");
  return db;

}).then(db => {
  console.log("SALONS SEARCHING > > >");


  module.exports.getSalonByName =  getSalonByName(db.db("afroturf"), "HeartBeauty", function(docs){
    console.log(docs);
    db.close();
    return docs;
    
  });


  
}).catch(err => {
  console.log(err);
});

