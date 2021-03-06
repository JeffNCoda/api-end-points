
const containsOps = require("./contains-operations");
const task = require("../controllers/task");
const empty = require("is-empty");
const generalQuickSearch = async (ctx) => {
    console.log(ctx.query.filters)

    const location =  ctx.query.location;
    let limit = ctx.query.limit; 
    let radius = ctx.query.radius;
    let userLocation;
    if(limit == undefined){
        limit = 10000000000;
    }
   userLocation = await task.toLocationObject(location);

    contains = ctx.query.contains;
   

    
    try {
        if(ctx.query.filters !== undefined){
            let filterRe;
            filterRe = JSON.parse(ctx.query.filters);
        }
    } catch (error) {
        console.log("failed")
        const res = {res: 422 , message: "Unprocessable Entity, "+error,
        data: []}
        ctx.status = res.res;
        ctx.message = res.message;
        ctx.body = {};
        return;
    }



    try {
        if(ctx.query.filters !== undefined){

            let filter = JSON.parse(ctx.query.filters);
            
            const salon = filter.salon;
            console.log("salon: "+salon)
            const services = filter.services;
            const stylist = filter.stylist;
            if(!empty(salon)&& !empty(services) & !empty(stylist)){
                
                let salonJson =  containsOps.containsInSalons(contains, userLocation, radius, limit, salon);
                let stylistJson =  containsOps.containsInStylist(contains, userLocation, radius, limit, stylist);
                let serviceJson = containsOps.containsInServices(contains, userLocation, radius, limit, services);
                
                const res = {res: 200, message: "successfully performed operation",
                data: [await salonJson, await stylistJson,  await serviceJson]}
                ctx.status = 200;
                ctx.body = res.data
            }else if(!empty(salon) && !empty(services) && empty(stylist)){
                console.log("Salons and services")
                let salonJson =  containsOps.containsInSalons(contains, userLocation, radius, limit, salon);
                let serviceJson =  containsOps.containsInServices(contains, userLocation, radius, limit, services);
                const res = {res: 200, message: "successfully performed operation",
                data: [await salonJson, [{stylist:null}],  await serviceJson]}
                ctx.status = 200;
                ctx.body = res.data
            }else if(!empty(salon) && !empty(stylist) && empty(services)){
                let salonJson = containsOps.containsInSalons(contains, userLocation, radius, limit, salon);
                let stylistJson = containsOps.containsInStylist(contains, userLocation, radius, limit, stylist);
                const res = {res: 200, message: "successfully performed operation",
                data: [await  salonJson, await stylistJson, [{services:null}]]}
                ctx.status = 200;
                ctx.body = res.data
            }else if(!empty(services) && !empty(stylist) && empty(salon)){
                let serviceJson = containsOps.containsInServices(contains, userLocation, radius, limit, services);
                let stylistJson =  containsOps.containsInStylist(contains, userLocation, radius, limit, stylist);
                const res = {res: 200, message: "successfully performed operation",
                data: [[{salon:null}], await stylistJson, await serviceJson]}
                ctx.status = 200;
                ctx.body = res.data
            }else if(!empty(services) && empty(stylist) && empty(salon)){
                let serviceJson = containsOps.containsInServices(contains, userLocation, radius, limit, services);
                const res = {res: 200, message: "successfully performed operation",
                data: [[{salon:null}], [{stylist:null}],await  serviceJson]}
                ctx.status = 200;
                ctx.body = res.data
            }else if(!empty(stylist) && empty(services) && empty(salon)){
                let stylistJson = containsOps.containsInStylist(contains, userLocation, radius, limit, stylist);
                const res = {res: 200, message: "successfully performed operation",
                data: [[{salon:null}], await  stylistJson, [{services:null}]]}
                ctx.status = 200;
                ctx.body = res.data
            }else if(!empty(salon) && empty(services) && empty(stylist)){
                let salonJson = containsOps.containsInSalons(contains, userLocation, radius, limit, salon);
                const res = {res: 200, message: "successfully performed operation",
                data: [await salonJson, [{stylist:null}], [{services:null}]]}
                ctx.status = 200;
                ctx.body = res.data
            }
        }else{
            let salon = {rating:[0,5]}, stylist={rating:[0,5], gender:"male|female"}, services = {service:"", price:[0,10000]}
            let salonJson = containsOps.containsInSalons(contains, userLocation, radius, limit, salon);
            let stylistJson =  containsOps.containsInStylist(contains, userLocation, radius, limit, stylist);
            let serviceJson =  containsOps.containsInServices(contains, userLocation, radius, limit, services);

            const res2 = {res: 200, message: "successfully performed operation, no filter",
            data: [await salonJson, await stylistJson, await serviceJson]}
            ctx.status = 200;
            ctx.body = res2.data
        }
    } catch (error) {
        console.log("failed at quickSearch")
       throw new Error(error) 
    }



}



module.exports = {
    generalQuickSearch,
}