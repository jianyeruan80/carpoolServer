
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
     states = require('../models/states');
    citys = require('../models/citys');
    
router.get('/', function(req, res, next) {
      log.debug(req.token);
         citys.aggregate([
                     { $lookup:  {
       from: "towns",
       localField: "_id",
       foreignField: "city",
       as: "towns"
     }}
             ]).exec(function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
     
});
router.post('/',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
  var arvind = new citys(info);
   arvind.save(function (err, data) {
   if (err) return next(err);
           var query={"_id":data.country};
           console.log(query);
            
            var update={ $addToSet: {city: data._id } };
            states.findOneAndUpdate(query,update,{},function (err, data2) {
                  if (err) return next(err);
                   res.json(data);
            });
      });
})
router.put('/:id',  security.ensureAuthorized,function(req, res, next) {
var info=req.body;
var id=req.params.id;
info.updatedAt=new Date();
var query = {"_id": id};
var options = {new: true};
citys.findOneAndUpdate(query,info,options,function (err, data) {
          if (err) return next(err);
            var query={"_id":info.state};
            var update={ $addToSet: {citys: data._id } };
          if(info.state != data.state){
               states.findOneAndUpdate(query,update,{},function (err, data2) {
                  if (err) return next(err);
                        query={"_id":data.state};
                        update={ $pull: {citys: data._id } };
                        states.findOneAndUpdate(query,update,{},function (err, data2) {
                            if (err) return next(err);
                              
                              res.json(data);
                        });
                  
              });
            

          }else{
            res.json(data);
          }
    });
})

router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
     citys.findByIdAndRemove(req.params.id,function (err, data) {
        if (err) return next(err);
            var query={"_id":data.state}
            var update={ $pull: {citys: data._id } };
            states.findOneAndUpdate(query,update,{},function (err, data2) {
                  if (err) return next(err);
                    res.json(data);
            });
        });
});


module.exports = router;

/*
var PersonSchema = new Schema({
      name:{
        first:String,
        last:String
      }
    });
  PersonSchema.virtual('name.full').get(function(){
      return this.name.first + ' ' + this.name.last;
    });

Post.find({}).sort('test').exec(function(err, docs) { ... });
Post.find({}).sort({test: 1}).exec(function(err, docs) { ... });
Post.find({}, null, {sort: {date: 1}}, function(err, docs) { ... });
Post.find({}, null, {sort: [['date', -1]]}, function(err, docs) { ... });

db.inventory.aggregate( [ { $unwind: "$sizes" } ] )
db.inventory.aggregate( [ { $unwind: { path: "$sizes", includeArrayIndex: "arrayIndex" } } ] )
https://docs.mongodb.com/manual/reference/operator/aggregation/group/
[
   /*{ $project : { title : 1 , author : 1 } } addToSet*/
/*    { $match: { status: "A" } },*
 { $group : {_id : "$permission_group", perms:{$push:{"subject":"$subject","action":"$action","perm":"$perm","status":"$status","value":"$_id","key":"$perm"} } } }
  // _id : { month: "$permission_group", day: { $dayOfMonth: "$date" }, year: { $year: "$date" } }

  /*    {
        $group : {
          _id:{permissionGroup:"$permission_group",subjects:{$push:"$subject"}}
         
    sort({"order" : 1})
        }
      }*/
/*users.update({"_id":key},{"$addToSet":{"permissions":{"$each":info.value}}},function(err,data){*/

