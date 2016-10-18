
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
    countrys = require('../models/countrys'),
    states = require('../models/states');
    


router.get('/', function(req, res, next) {
      log.debug(req.token);
         states.aggregate([
                     { $lookup:  {
       from: "citys",
       localField: "_id",
       foreignField: "state",
       as: "citys"
     }}
             ]).exec(function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
     
});
router.post('/',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
  var arvind = new states(info);
   arvind.save(function (err, data) {
   if (err) return next(err);
           var query={"_id":data.country};
           console.log(query);
            
            var update={ $addToSet: {states: data._id } };
            countrys.findOneAndUpdate(query,update,{},function (err, data2) {
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
states.findOneAndUpdate(query,info,options,function (err, data) {
          if (err) return next(err);
            var query={"_id":info.country};
            var update={ $addToSet: {states: data._id } };
          if(info.country != data.country){
               countrys.findOneAndUpdate(query,update,{},function (err, data2) {
                  if (err) return next(err);
                        query={"_id":data.country};
                        update={ $pull: {states: data._id } };
                        countrys.findOneAndUpdate(query,update,{},function (err, data2) {
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
     states.findByIdAndRemove(req.params.id,function (err, data) {
        if (err) return next(err);
            var query={"_id":data.country}
            var update={ $pull: {states: data._id } };
            countrys.findOneAndUpdate(query,update,{},function (err, data2) {
                  if (err) return next(err);
                    res.json(data);
            });
        });
});

module.exports = router;

