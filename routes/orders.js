
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
    tools = require('../modules/tools'),
    seqs = require('../models/seqs'),
    orderDetailsDao=require('../models/orderdetails'),
    util = require('util'),
    orders = require('../models/orders'),
    bills = require('../models/bills'),
    stores = require('../models/stores');
    
router.get('/',  security.ensureAuthorized,function(req, res, next) {
        var info=req.query;
         var query={"merchantId":req.token.merchantId}
        if(info.status){query.status=info.status;}
          console.log(query)
        orders.find(query).sort({orderNo: 1, _id:1 }).exec(function(err,data){
           if (err) return next(err);
           console.log(data)
           res.json(data);
        })


})
router.get('/bills',  security.ensureAuthorized,function(req, res, next) {
        var info=req.query;
         var query={"merchantId":req.token.merchantId}
        if(info.status){query.status=info.status;}

        bills.find(query).sort({orderNo: 1, _id:1 }).exec(function(err,data){
           if (err) return next(err);
           res.json(data);
        })
})
router.put('/void/:id',  security.ensureAuthorized,function(req, res, next) {
        var query={"_id":req.params.id}
        var info={status:"void"}
        bills.findOneAndUpdate(query,info,{},function (err, data) {
               if (err) return next(err);
               query={"_id":data.order};
               info={"status":"unpaid"};
               orders.findOneAndUpdate(query,info,{},function (err, data) {
                if (err) return next(err);
                 res.json(data);
                })
        })
})

router.get('/:id',  security.ensureAuthorized,function(req, res, next) {
        var info=req.query;
         var query={"_id":req.params.id};
        

        orders.findOne(query).sort({orderNo: 1, _id:1 }).exec(function(err,data){
           if (err) return next(err);
           res.json(data);
        })


})

router.post('/',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
   var name="orderNo";
   info.merchantId=req.token.merchantId; 
   var query={"merchantId":info.merchantId,"name":name};
   info.operator={};
   info.operator.id=req.token.id;
   info.operator.user=req.token.user;
   info.createdBy=info.operator;
   info.createdAt=new Date();
   info.updatedAt=new Date();
   info.status="unpaid"; //paid ,void

   var p1=tools.getNextSequence(query);
   p1.then(function(n){
   info.orderNo=n.seqNo;
   var arvind = new orders(info);
   arvind.save(function (err, data) {
   if (err) return next(err);
      seqs.findOneAndUpdate(query,n.updateData,{},function (err, data2) {
                   if (err) return next(err);
                          if(info.sign=="saveOrder") return res.json(data);  
                          info.order=data._id;
                          var b=new bills(info);
                           b.save(function (err, data3) {
                              if (err) return next(err);
                               query={"_id":data3.order};
                               var update={"status":"paid"};
                               orders.findOneAndUpdate(query,update,{},function (err, data2) {
                                  if (err) return next(err);
                                  var initOrder={
                                    subTotal:0,
                                    tax:0,
                                     taxRate:0,
                                     tip:0,
                                     tipRate:0,
                                     discount:0,
                                     discountRate:0,
                                     grandTotal:0,
                                    receiveTotal:0,
                                    orderDetails:[]
                                  };
                                  res.json(initOrder);
                               })
                           })

                  }) 
 });
}, function(n) {
  res.json({"code":"90005"});
});
})

router.put('/:id',  security.ensureAuthorized,function(req, res, next) {
     var info=req.body;
     info.operator={};
    info.operator.id=req.token.id;
    info.operator.user=req.token.user;
    info.updatedAt=new Date();
    var query={"_id":req.params.id};
      var options = {new: true};  
      orders.findOneAndUpdate(query,info,options,function (err, data) {
                   if (err) return next(err);
                         if(info.sign=="saveOrder") return res.json(data);  
                          info.order=data._id;
                          var b=new bills(info);
                           b.save(function (err, data3) {
                              if (err) return next(err);
                               query={"_id":data3.order};
                               var update={"status":"paid"};
                               orders.findOneAndUpdate(query,update,{},function (err, data2) {
                                  if (err) return next(err);
                                  var initOrder={
                                    subTotal:0,
                                    tax:0,
                                     taxRate:0,
                                     tip:0,
                                     tipRate:0,
                                     discount:0,
                                     discountRate:0,
                                     grandTotal:0,
                                    receiveTotal:0,
                                    orderDetails:[]
                                  };
                                  res.json(initOrder);
                               })
                           })

                  }) 
    
});


module.exports = router;

