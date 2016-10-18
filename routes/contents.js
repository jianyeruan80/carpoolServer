
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
    
    centents = require('../models/centents');
    
    

router.post('/',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
   var arvind = new centents(info);
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
centents.findOneAndUpdate(query,info,options,function (err, data) {
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