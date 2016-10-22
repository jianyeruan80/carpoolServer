
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
    
    contents = require('../models/contents');
    
    
router.get('/:month',function(req, res, next) {

    var month=req.params.month;
     
var currentDate = new Date(month+"-01");
var minMonth=new Date(currentDate.setMonth(currentDate.getMonth() -1));
var maxMonth=new Date(currentDate.setMonth(currentDate.getMonth() +3));

/*minMonth=minMonth.getFullYear()+"-"+minMonth.getMonth();
maxMonth=maxMonth.getFullYear()+"-"+maxMonth.getMonth();*/

console.log(minMonth);
console.log(maxMonth);



    contents.aggregate(
   [
     {
      $match:
      {
              $and:[{departureTime:{"$gte":minMonth}},{departureTime:{"$lt":maxMonth}}]
     }
   },
     {
       $project: {
           country:"$country",state:"$state",type:"$type",picture:"$picture",fee:"$fee",type:"$fee",description:"$description",contact:"$contact",
           phone:"$phone",email:"$email",destination:"$destination",destinationAddress:"$destinationAddress",arrivalTime:"$arrivalTime",departure:"$departure",
           departureAddress:"$departureAddress",departureTime:"$departureTime",tripSite:"$tripSite",customer:"$customer",status:"$status",
           yearMonth: { $dateToString: { format: "%Y-%m-%d", date: "$departureTime" } },
           time: { $dateToString: { format: "%H:%M", date: "$departureTime" } },
          
       }
     },
     {
      $group : {
             _id:"$yearMonth",
              info: { $push: "$$ROOT" } 
              }
     }
   ]
).exec(function(err, data) {    
                 console.log("================");
              //console.log(data.join(","), false, null))

                 console.log("================");
                  res.json(data);

            })
 /*  var info=req.body;
   info.customer=req.token.id;
   info.updatedAt=new Date();
   var arvind = new contents(info);
   console.log("================================");
   console.log(info);
   console.log("================================");
   arvind.save(function (err, data) {
   if (err) return next(err);
          
                   res.json(data);
            
      });*/
})
router.post('/',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
   info.customer=req.token.id;
   info.updatedAt=new Date();
   var arvind = new contents(info);
   console.log("================================");
   console.log(info);
   console.log("================================");
   arvind.save(function (err, data) {
   if (err) return next(err);
          
                   res.json(data);
            
      });
})
router.put('/:id',  security.ensureAuthorized,function(req, res, next) {
var info=req.body;
var id=req.params.id;
info.updatedAt=new Date();
var query = {"_id": id};
var options = {new: true};
contents.findOneAndUpdate(query,info,options,function (err, data) {
          if (err) return next(err);
             res.json(data);
    }); 
})

/*router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
     villages.findByIdAndRemove(req.params.id,function (err, data) {
        if (err) return next(err);
            var query={"_id":data.towns};
            var update={ $pull: {villages: data._id } };
            towns.findOneAndUpdate(query,update,{},function (err, data2) {
                  if (err) return next(err);
                    res.json(data);
            });
        });
});*/
module.exports = router;