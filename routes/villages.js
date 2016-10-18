
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
    towns = require('../models/towns'),
    countrys = require('../models/countrys'),
    villages = require('../models/villages');
    
router.get('/menus', function(req, res, next) {
      



      /*log.debug(req.token);
         towns.aggregate([
                     { $lookup:  {
       from: "villages",
       localField: "_id",
       foreignField: "village",
       as: "villages"
     }}
             ]).exec(function (err, data) {
        if (err) return next(err);
          res.json(data);
      });*/
     
});
router.post('/',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
  var arvind = new villages(info);
   arvind.save(function (err, data) {
   if (err) return next(err);
           var query={"_id":data.town};
           var update={ $addToSet: {villages: data._id } };
            towns.findOneAndUpdate(query,update,{},function (err, data2) {
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
villages.findOneAndUpdate(query,info,options,function (err, data) {
          if (err) return next(err);
            var query={"_id":info.town};
            var update={ $addToSet: {villages: data._id } };
          if(info.towns != data.towns){
               towns.findOneAndUpdate(query,update,{},function (err, data2) {
                  if (err) return next(err);
                        query={"_id":data.town};
                        update={ $pull: {villages: data._id } };
                        townss.findOneAndUpdate(query,update,{},function (err, data2) {
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
     villages.findByIdAndRemove(req.params.id,function (err, data) {
        if (err) return next(err);
            var query={"_id":data.towns};
            var update={ $pull: {villages: data._id } };
            towns.findOneAndUpdate(query,update,{},function (err, data2) {
                  if (err) return next(err);
                    res.json(data);
            });
        });
});
module.exports = router;