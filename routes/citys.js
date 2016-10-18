
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
     states = require('../models/states');
    citys = require('../models/citys');









router.get('/menus/:id', function(req, res, next) {
     
  var query={"state":req.params.id};
   citys.find(query).populate(
             {
              path: 'towns',
              populate: [{ path: 'villages',sort:{order:1}}],
              sort:{order:1},
           /*   match: {status:true}, 
              options: { sort: { order: 1 }}*/
              }
            ).sort({order:1}).exec(function(err, data) {    
                console.log(data);
                  res.json(data);

            })
     
});

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
           var query={"_id":data.state};
           var update={ $addToSet: {citys: data._id } };
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