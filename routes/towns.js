
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
    towns = require('../models/towns'),
    citys = require('../models/citys');
    
router.get('/', function(req, res, next) {
      log.debug(req.token);
         towns.aggregate([
                     { $lookup:  {
       from: "villages",
       localField: "_id",
       foreignField: "town",
       as: "villages"
     }}
             ]).exec(function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
     
});
router.post('/',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
  var arvind = new towns(info);
   arvind.save(function (err, data) {
   if (err) return next(err);
           var query={"_id":data.city};
           var update={ $addToSet: {towns: data._id } };
            citys.findOneAndUpdate(query,update,{},function (err, data2) {
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
towns.findOneAndUpdate(query,info,options,function (err, data) {
          if (err) return next(err);
            var query={"_id":info.city};
            var update={ $addToSet: {towns: data._id } };
          if(info.city != data.city){
               citys.findOneAndUpdate(query,update,{},function (err, data2) {
                  if (err) return next(err);
                        query={"_id":data.city};
                        update={ $pull: {towns: data._id } };
                        citys.findOneAndUpdate(query,update,{},function (err, data2) {
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
     towns.findByIdAndRemove(req.params.id,function (err, data) {
        if (err) return next(err);
            var query={"_id":data.city};
            var update={ $pull: {towns: data._id } };
            citys.findOneAndUpdate(query,update,{},function (err, data2) {
                  if (err) return next(err);
                    res.json(data);
            });
        });
});
module.exports = router;