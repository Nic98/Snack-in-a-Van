const mongoose = require("mongoose")

const Snack = require('../models/snack')
const Cart = require('../models/cart')
const Order = require('../models/order')

const User = require('../models/user')
//function to add items to the cart
const add_to_cart = function(req, res){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {})
    Snack.findById(productId, function(err, product){
        if(err){
            return res.redirect('/customer/menu')
        }
        //add the cart to the session
        cart.add(product, productId)
        req.session.cart = cart
        res.redirect('/customer/menu')
    })
}
const change_to_cart = function(req, res){
    //get the order id from the req body
    let order_item = req.body
    let errors = []
    var order = JSON.parse(order_item.Order)
    var obj= order[0].OrderedProduct
    //push error when no id is specified

    var curr_time = new Date()
    curr_time = Date.parse(curr_time)
    if(Date.parse(order_item.ExpireTime) - curr_time >= 10*60*1000){
        res.redirect('/customer/order_status/cannot_modify')
    }


    if(!obj) {
        req.flash('orderError', 'This order does not exsist')
        errors.push({msg: 'this order dose not exsist'})
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {})
    for (i = 0; i < obj.length; i++) {
        var productId = obj[i].id;
        //add the cart to the session
        cart.add(obj[i], productId)
        req.session.cart = cart
    }
    res.redirect('/customer/menu/cart')   
}
const delete_from_cart = function(req, res){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {})
    Snack.findById(productId, function(err, product){
        if(err){
            return res.redirect('/customer/menu')
        }
        //add the cart to the session
        cart.delete(product, productId)
        req.session.cart = cart
        res.redirect('/customer/menu/cart')
    })
}


//render the cart page
const cart_get = function(req, res){
    if(!req.session.cart){
      return res.render('cart', {products : null});
    }else{
      var cart = new Cart(req.session.cart);
      res.render('cart', {products : cart.generateArray(), totalPrice:cart.totalPrice, user:req.user});
    }
}

//after an order is confirmed, post function is used to send orders to the database
const cart_post = function(req, res){
    //get order details from the req body
    let {products,totalPrice, CustomerInfo, CustomerID} = req.body
    var OrderedProduct = []
    var obj = {}
    var user_obj = {}
    
    //transfer string to object 
    if(typeof(products) === 'string'){
        obj = JSON.parse(products)
    }else{
        obj = products
    }
    
    //handle the transferred string and push the key details of the snack to new array
    for(var i = 0; i < obj.length; i++){
        var temp_product = {}
        temp_product.snack_name = obj[i].item.snack_name
        temp_product.quantity = obj[i].qty
        temp_product.id = obj[i].item._id
        temp_product.price = obj[i].item.price
        OrderedProduct.push(temp_product)
    }

    //default customer is for testing, so we have a different condition for normal users
    if(CustomerInfo != "default_customer"){
        user_obj = JSON.parse(CustomerInfo)
        CustomerInfo = user_obj.first_name + " " + user_obj.last_name
    }


    // Edited part
    const OrderID = makeid(8)
    const DiscountOrder = false
    const OrderStatus = "Outstanding"
    var OrderedTime = new Date()
    var countdown_time = OrderedTime.getTime()
    // var ExpireTime = new Date(countdown_time + 15*60*1000)
    var ExpireTime = new Date(countdown_time + 10*1000)
    OrderedTime = OrderedTime.toString()
    ExpireTime = ExpireTime.toString()
    
    User.findByIdAndUpdate(
        req.user.id,
        {latestOrder: OrderID},
        {new: true},
        function(err){
            if(err){
                res.status(404).json({success:false,err})
            }
        }
    )
    //create a new order
    const newOrder = new Order({
        OrderID,
        OrderStatus,
        CustomerInfo,
        CustomerID,
        OrderedProduct,
        totalPrice,
        OrderedTime,
        ExpireTime,
        DiscountOrder
    })
    newOrder
        .save()
        .then((order) => {
            //after an order is confirmed, items are meant to be deleted from current cart
            req.session.cart = {}
            //after checkout, customers are redirected to the order history page
            //if we use render instead of redirect here, the order page will remain 
            //inside this post function and keep calling this checkout feature, which doesnt make sense
            //and possibly will cause error
            res.redirect('/customer/order_status')
        })
        .catch((err) => console.log(err))
}

//randomnize order id
function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
}
//export all functions
module.exports = {
    add_to_cart, cart_get, cart_post, delete_from_cart,change_to_cart
}

