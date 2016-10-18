
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
    countrys = require('../models/countrys');
    
router.get('/', function(req, res, next) {
       log.debug(req.token);
         countrys.aggregate([
                     { $lookup:  {
       from: "states",
       localField: "_id",
       foreignField: "country",
       as: "states"
     }}
             ]).exec(function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
     
});
router.post('/',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
    
  var arvind = new countrys(info);
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
countrys.findOneAndUpdate(query,info,options,function (err, data) {
          if (err) return next(err);
          res.json(data);
    });
})

router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
     countrys.remove({"_id":req.params.id}, function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
});

module.exports = router;
