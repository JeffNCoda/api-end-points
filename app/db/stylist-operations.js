const generic = require("./generic");
const schema = require("./schema/schema");
const ObjectId = require('mongodb').ObjectID;
const METERS_TO_KM = 1000;
const empty = require("is-empty");






const getSalonByStylistNameRatingGenderAndSalonId = async(userlocation, radius, name,limit, rating, gender, salonId) => {
  console.log("getSalonByStylistNameRatingGenderAndSalonId server "+salonId)
  
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    const stylistCursor = await db.db.collection("salons").aggregate([
      {
        $match:{salonId: parseInt(salonId)}
  
      },
      {
        $project: { stylists: 
    
      
          {
            $filter: {
              input: "$stylists", 
              as: "this", 
              cond: {$or: [ {"$$this.rating":{"$gte":rating[0], "$lte":rating[1]}}, {"$$this.gender": gender},{"$$this.name":  { '$regex' : name, '$options' : 'i' }}] }
            }
          }
  
        }
      }
    ]);
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist));
  
  }
  const stylistCursor = await db.db.collection("salons").aggregate([
    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: parseInt(radius)*METERS_TO_KM,
        num: parseInt(limit),
        query: {salonId: parseInt(salonId)},
        spherical: true
      }

    },
    {
      $project: { stylists: 
  
    
        {
          $filter: {
            input: "$stylists", 
            as: "this", 
            cond: {$or: [ {"$$this.rating":{"$gte":rating[0], "$lte":rating[1]}}, {"$$this.gender": gender},{"$$this.name":  { '$regex' : name, '$options' : 'i' }}] }
          }
        }
      }
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));

};














const getSalonByStylistNameRatingGender = async(userlocation, radius, name,limit, rating, gender) => {
  console.log("getSalonByStylistNameRatingGenderAndSalonId server "+salonId)
  
  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
    console.log("NO location, radius, limit null")
    const stylistCursor = await db.db.collection("salons").aggregate([
      {
        $project: { stylists: 
    
      
          {
            $filter: {
              input: "$stylists", 
              as: "this", 
              cond: {$or: [ {"$$this.rating":{"$gte":rating[0], "$lte":rating[1]}}, {"$$this.gender": gender},{"$$this.name":  { '$regex' : name, '$options' : 'i' }}] }
            }
          }
  
        }
      }
    ]);
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist));
  
  }
  const stylistCursor = await db.db.collection("salons").aggregate([
    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: parseInt(radius)*METERS_TO_KM,
        num: parseInt(limit),
        spherical: true
      }

    },
    {
      $project: { stylists: 
  
    
        {
          $filter: {
            input: "$stylists", 
            as: "this", 
            cond: {$or: [ {"$$this.rating":{"$gte":rating[0], "$lte":rating[1]}}, {"$$this.gender": gender},{"$$this.name":  { '$regex' : name, '$options' : 'i' }}] }
          }
        }
      }
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));

};















//return salon_id and list of stylist with the input rating
const getSalonStylistBySalonId = async(userlocation, radius,salonId) => {

  const db = await getDatabaseByName("afroturf");
  await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
  if(empty(userlocation)){
    console.log("userLocation is null,radius is null")
    const stylistCursor = await db.db.collection("salons").aggregate([
      {
        $match: {salonId: parseInt(salonId)}
  
      },
  
      {
        $project: { stylists: 1, salonId: 1}
      }
    ]);
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist));
  }
  const stylistCursor = await db.db.collection("salons").aggregate([



    {
      $geoNear:{
        near: {coordinates: userlocation},
        distanceField: "distance.calculated",
        maxDistance: parseInt(radius)*METERS_TO_KM,
        query: {salonId: parseInt(salonId)},
        spherical: true
      }

    },

    {
      $project: { stylists: 1, salonId: 1}
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));

};





//return salon_id and list of stylist with the input rating
const getAllStylist = async(userlocation, radius) => {

const db = await getDatabaseByName("afroturf");
await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
if(empty(userlocation)){
  console.log("userLocation is null,radius is null")
  const stylistCursor = await db.db.collection("salons").aggregate([
    {
      $project: { stylists: 1, salonId: 1}
    }
  ]);
  const stylist = await stylistCursor.toArray();
  db.connection.close();
  return JSON.parse(JSON.stringify(stylist));
}
const stylistCursor = await db.db.collection("salons").aggregate([



  {
    $geoNear:{
      near: {coordinates: userlocation},
      distanceField: "distance.calculated",
      maxDistance: parseInt(radius)*METERS_TO_KM,
      spherical: true
    }

  },

  {
    $project: { stylists: 1, salonId: 1}
  }
]);
const stylist = await stylistCursor.toArray();
db.connection.close();
return JSON.parse(JSON.stringify(stylist));

};






const applyAsStylist = async (ctx) => {
  //get currect user
  const userId = ctx.request.body.userId, salonObjId = ctx.request.body.salonObjId;
  console.log("--applyAsStylist--");
  const data = schema.getApplicationJson(userId,salonObjId);
  console.log(data);
  try{
      const db = await generic.getDatabaseByName("afroturf");
      const result = await db.db.collection("users").update({
          $and:[{"salons.salonObjId": salonObjId}, {"salons.role": "salonOwner"}, { "salons.hiring": 1 }, {"stylistRequests.salonObjId": {$ne: salonObjId}}]},
          {$addToSet: {stylistRequests:data}}, 
      );
      console.log("ok: "+result.result.ok, "modified: "+ result.result.nModified);
      const res = result.result.ok && result.result.nModified === 1 ? {res:200, message: "successfully performed operation"} : {res:401, message: "failed to perform operation"};
      if(res === 200){
  
          console.log("--applyAsStylist updating my profile--");
          const result2 = await db.db.collection("users").update({
              $and:[{"_id": ObjectId(userId)}, {"EmploymentStatus.salonObjId": {$ne: salonObjId}}]},
              {$addToSet: {EmploymentStatus:data}}, 
          );
          console.log("ok: "+result2.result.ok, "modified: "+ result2.result.nModified);
      }
      
      db.connection.close();
      ctx.body =  res;
  }catch(err){
      throw new Error(err);
  }
}

const getStylistByIdSalonId = async(salonId, stylistId, userlocation, radius) => {

  console.log("getStylistById server: ")
  console.log(userlocation)
    const db = await getDatabaseByName("afroturf");
    await db.db.collection("salons").ensureIndex({"location.coordinates" : "2dsphere"});
    if(empty(userlocation)){
      console.log("NO location, radius, limit null")
      const stylistCursor = await db.db.collection("salons").aggregate([
        {
          $match:{salonId: parseInt(salonId)}
    
        },
        {
          $project: { stylists: 
      
        
            {
              $filter: {
                input: "$stylists", 
                as: "this", 
                cond: {$eq : [ "$$this.stylistId", parseInt(stylistId)]}, 
              }
            }
    
          }
        }
      ]);
      
      const stylist = await stylistCursor.toArray();
      db.connection.close();
      return JSON.parse(JSON.stringify(stylist));
    }
    const stylistCursor = await db.db.collection("salons").aggregate([
      {
        $geoNear:{
          near: { coordinates: userlocation},
          distanceField: "distance.calculated",
          maxDistance: parseInt(radius)*METERS_TO_KM,
          query: {salonId: parseInt(salonId)},
          spherical: true
        }
  
      },
      {
        $project: { stylists: 
    
      
          {
            $filter: {
              input: "$stylists", 
              as: "this", 
              cond: {$eq : [ "$$this.stylistId", parseInt(stylistId)]}, 
            }
          }
  
        }
      }
    ]);
    
    const stylist = await stylistCursor.toArray();
    db.connection.close();
    return JSON.parse(JSON.stringify(stylist));
  
};


//applyAsStylist("5b7e9b1495e2e31ef888b64d", "5b8f7f7b0e22dc20a4588e27");
module.exports = {
    applyAsStylist,
    getStylistById,
    getSalonStylistBySalonId,
    getSalonByStylistRatingGenderAndSalonId,//2
    getSalonByStylistRatingAndSalonId,
    getSalonAllStylist,
    getSalonByStylistNameRatingGenderAndSalonId,//1
    getSalonByStylistGenderAndSalonId,
    getSalonByStylistGenderAndSalonId2,
    getSalonByStylistRating, 
    getSalonByStylistRatingGender, 
    getSalonByStylistNameRatingGender, //3,
}

let query = {
  salonId,
  name:name,
  gender:gender,
  rating:rating

}

let query2 = {
  salonId,
  gender:gender,
  rating:rating

}

let query3 = {
  salonId,
  name:name,
  gender:gender,

}

/*
COPY STYLIST FILTER AND PASTE IT HERE EDIT TO INCLUDE SALONID 

*/

// /afroturf/filter/stylist?query={"rating":[0, 5]} //returns all services