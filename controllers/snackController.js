const mongoose = require("mongoose")
let menu_length = 0
let menu_data = {}
const Cart = require('../models/cart')
// import snack model
const Snack = mongoose.model("Snack")

// get all authors
const getAllSnack = async (req, res) => {
  try {
    const snacks = await Snack.find()
    return res.send(snacks)
  } catch (err) {
    res.status(400)
    return res.send("Database query failed")
  }
}

//render all snacks in the menu 
const menu_get = function(req, res){
  Snack.find()
    .lean()
    .then(function (doc) {
      menu_length = doc.length
      //render the cart item number when there are items in the cart, otherwise just render the menu page
      if(!req.session.cart){
        res.render('menu', {menu_length: menu_length, menu: doc, user:req.user})
      }else{
        var cart = new Cart(req.session.cart);
        res.render('menu', {menu_length: menu_length, menu: doc, user:req.user, totalQty:cart.totalQty})
      }
    })
}

//export all function
module.exports = {
  getAllSnack, menu_get //, updateAuthor, addAuthor
}