const mongoose = require("mongoose")
const User = require("../models/user")
let order_length = 0

// import order model
const Order = mongoose.model("Order")

// get all orders
const order_get = function(req, res){
  Order.find()
    .lean()
    .then(function (doc) {
        res.render("customer_order", {orders: doc, user: req.user})
    })
}

// New Function
const order_status_get = function(req, res){
  var target_order = req.user.latestOrder;
  Order.find({OrderID: target_order})
    .lean()
    .then(function (order){
      if(order){
        var ExpireTime = order[0].ExpireTime;
        // var OrderStatus = order[0].OrderStatus;
        ExpireTime = Date.parse(ExpireTime)
        res.render('order_status', {order: order, ExpireTime: ExpireTime, user: req.user})
      }
    })
}

const cannot_modify_get = function(req, res){
  res.render('cannot_modify', {user: req.user})
}


const rating_get = function(req, res){
  res.render("rating", {user: req.user})
}

const rating_post = function(req, res){
  const {order_item} = req.body
  var obj = {}
  obj = JSON.parse(order_item)
  res.render("rating", {user:req.user, order_detail: obj})
}

const review_post = function(req, res){
  const {rating_score, review, OrderID, order_detail} = req.body
  let errors = []
  var obj = JSON.parse(order_detail)
  //validate fields
  if(!rating_score) {
      req.flash('ratingError', 'Please rate your order out of 5')
      errors.push({msg: 'Please rate your order out of 5'});
  }
  //check errors
  if(errors.length > 0){
      res.render("rating", {
          errorMessage: req.flash("ratingError"),
          errors,
          rating_score,
          review,
          order_detail: obj,
          user: req.user
      })
  } else{
    Order.findOne({OrderID: OrderID}).then((order) => {
      //change vendor status and location information
      Order.findByIdAndUpdate(
        order.id,
        {rating_score: rating_score, review: review, isRated: true},
        {new:true},
        function(err, updatedVendor){
          if(err){
            res.status(404).json({success:false,err})
          }else{
            res.redirect("/customer/customer_order")
          }
        }
      )
    })
  }

}

// get all orders
const vendor_order_get = function(req, res){
  Order.find()
    .lean()
    .then(function (doc) {
        res.render("order", {orders: doc, user: req.user})
    })
}


const complete_order = async function (req, res){
  //get the order id from the req body
  const {OrderID} = req.body
  let errors = []
  console.log(req.body)

  //push error when no id is specified 
  if(!OrderID) {
    req.flash('orderError', 'This order does not exsist')
    errors.push({msg: 'this order dose not exsist'})
  }
  
  //render error if there's anu
  if(errors.length > 0) {
    res.render("order", {
      errorMessage: req.flash("orderError"),
      errors,
      OrderID,
    })
  } else {
    //when there's no such order return error
    Order.findOne({OrderID: OrderID}).then((order) => {
      if (!order){
        req.flash('orderError', 'this order dose not exsist')
        res.render("order", {
          errorMessage: req.flash('orderError'),
          OrderID,
          errors,
          OrderID,
        })
      } else {
        //update error
        Order.findByIdAndUpdate(
          order.id,
          {OrderStatus: "Fulfilled"},
          {new:true},
          function(err, updatedOrder){
            if(err){
               res.status(404).json({success:false,err})
            }else{
              Order.find()
                .lean()
                .then(function (doc) {
                    res.status(200).json({success:true, updatedOrder: updatedOrder})
                  //req.flash('orderSuccess', 'One order has been fulfilled')
                  //res.render("order", {order_length: order_length, order:doc, successMessage:req.flash("orderSuccess")})
                })
            }
          })
      }
    })
  }
}

const cancel_order = async function (req, res){
  //get the order id from the req body
  const order_item = req.body
  let errors = []
  console.log(req.body)
  var order = JSON.parse(order_item.Order)
  const OrderID= order[0].OrderID


  var curr_time = new Date()
  curr_time = Date.parse(curr_time)
  if(Date.parse(order[0].ExpireTime) - curr_time >= 10*60*1000){
    res.redirect('/customer/order_status/cannot_modify')
  }
  
  //push error when no id is specified 
  if(!OrderID) {
    req.flash('orderError', 'This order does not exsist')
    errors.push({msg: 'this order dose not exsist'})
  }
  
  //render error if there's anu
  if(errors.length > 0) {
    res.render("order", {
      errorMessage: req.flash("orderError"),
      errors,
      OrderID,
    })
  } else {
    //when there's no such order return error
    Order.findOne({OrderID: OrderID}).then((order) => {
      if (!order){
        req.flash('orderError', 'this order dose not exsist')
        res.render("order", {
          errorMessage: req.flash('orderError'),
          OrderID,
          errors,
          OrderID,
        })
      } else {
        //update error
        Order.findByIdAndUpdate(
          order.id,
          {OrderStatus: "Cancelled"},
          {new:true},
          function(err, updatedOrder){
            if(err){
               res.status(404).json({success:false,err})
            }else{
              Order.find()
                .lean()
                .then(function (doc) {
                    res.status(200).json({success:true, updatedOrder: updatedOrder})
                    
                  //req.flash('orderSuccess', 'One order has been fulfilled')
                  //res.render("order", {order_length: order_length, order:doc, successMessage:req.flash("orderSuccess")})
                })
            }
          })
          res.redirect("/customer/customer_order")
      }
    })
  }
}

module.exports = {
  order_get, complete_order, vendor_order_get, rating_get, rating_post, review_post, cancel_order, order_status_get, cannot_modify_get
}