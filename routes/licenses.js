
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
    tools = require('../modules/tools'),
    licenses = require('../modules/licenses'),
    licensesHistorys = require('../models/licenseshistorys'),
    licensesDao = require('../models/licenses');


router.get('/', function(req, res, next) {
     log.debug(req.token);

     licensesDao.aggregate([
    {
      $lookup:
        {
          from: "licenseshistorys",
          localField: "_id",
          foreignField: "license",
          as: "licensesHistorys"
        }
   }
]).exec(function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
     
});

router.put('/active/:licensesKey', function(req, res, next) {
         var inof=req.body;
         var query={
              "licenseKey":req.params.licensesKey

         }
          try{
            var key=licenses.decryptLicense(req.params.licensesKey);  
             if(key.active){
                 return next({"code":"90008"})
             }
          }catch(ex){
            return next({"code":"90007"});
          }
          licensesDao.findOne(query, function (err, data) {
                  if (err) return next(err);
                  if(!data){
                      return next({"code":"90009"})
                  }else{
                       var currentDate=new Date();
                       data.startDate=new Date();
                       data.expires=currentDate.setMonth(currentDate.getMonth() + data.month);
                       query={};
                       query.month=data.month;
                       query.merchantId=data.merchantId;
                       query.expires=data.expires;
                       query.active=true;
                       data.licenseKey=licenses.createLicense(query);
                       data.active=true;
                       data.save(function (err, data2) {
                          if (err) return next(err);
                             var historyJson={};
                            historyJson.month=data2.month;
                            historyJson.startDate=data2.startDate,
                            historyJson.expires=data2.expires,
                            historyJson.license=data2._id;
                             var history=new licensesHistorys(historyJson);
                             history.save(function (err, data3) {
                                      if (err) return next(err);
                                          res.json(data2)
                                     })
                         })

                 } 
         })
})
router.put('/customerinfo/:id', function(req, res, next) {
         var info=req.body;
         var update={};
             update.email=info.email;
             update.phone=info.phone;
             update.contact=info.contact;
             update.addressInfo=info.addressInfo;

      
        var query={"_id":req.params.id};
         licensesDao.findOneAndUpdate(query,update,{"new":true},function (err, data) {
          if (err) return next(err);
           
            res.json(data);

        });
        
})
router.put('/merchant/:id', function(req, res, next) {
         var info=req.body;
         var merchantId=req.params.id;
         var licenseInfo={
              "merchantId":merchantId,
              "active":false,
              "date":new Date().getTime()
              
         }

         var update={
                "merchantId":merchantId,
                "active":false,
                "expires":null,
                "startDate":null,
                "month":info.month,
                "licenseKey":licenses.createLicense(licenseInfo)
               
         }

        var query={"merchantId":req.params.id};
         licensesDao.findOneAndUpdate(query,update,{"new":true},function (err, data) {
          if (err) return next(err);
           
            res.json(data);

        });
        
})
router.put('/:id',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
   var query={"_id":req.params.id};
    var update={};
             update.email=info.email;
             update.phone=info.phone;
             update.contact=info.contact;
             update.addressInfo=info.addressInfo;
  licensesDao.findOneAndUpdate(query,update,{"new":true},function (err, data) {
          if (err) return next(err);
           
            res.json(data);

        });
})
router.post('/',  security.ensureAuthorized,function(req, res, next) {
      var info=req.body;
      var createLicense=[];
      var licenseInfo={"date":new Date().getTime()};
      var total=info.total || 1;
      var count=0;
       licensesDao.find({}, function (err, data) {
         if (err) return next(err);
            var key="";
            var keys=[];
            for(var i=0;i<data.length;i++){
                keys.push(data[i].merchantId);
            }
            try{
              key=keys.join(",");
            }catch(ex){}
                for(var i=0;i<10000;i++){
                  var merchant=getMerchant();
                    
                   for(var j=1;j<merchant.length;j++){
                         licenseInfo.active=false;
                         var updateInfo={};
                         if(!key || key.indexOf(merchant[j])==-1){
                            count++;
                            licenseInfo.merchantId=merchant[j];
                            updateInfo.licenseKey=licenses.createLicense(licenseInfo);
          

                            updateInfo.merchantId=licenseInfo.merchantId;
                            updateInfo.month=info.month;
                            updateInfo.operator={};
                            updateInfo.operator.id=req.token.id;
                            updateInfo.operator.user=req.token.user;
                            createLicense.push(updateInfo);
                        }
                       
                        if(count >= total){
                              break;
                            }
                   }
                   if(count >= total){
                              break;
                   }

                }
                licensesDao.create(createLicense, function (err, data) {
                       if (err) return next(err);
                         console.log(data);
                         res.json(data);
                  })
                  


      });
     
});

function getMerchant(){
  var key=Math.random().toString(36).slice(2);
   for(var i=0;i<1;i++){
    key+=Math.random().toString(36).slice(2);
   }

   return tools.unique(toSplit(key,4).split(","));
}
function toSplit(num,len) {
    var len=len || 3;
    var num = num.toString(), result = '';
    while (num.length > len) {
        result = ',' + num.slice(-len) + result;
        num = num.slice(0, num.length - len);
    }
    if (num) { result = num + result; }
    return result;
}

module.exports = router;
