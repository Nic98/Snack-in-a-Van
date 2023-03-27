const mongoose = require("mongoose")

//set up orderSchema
const orderSchema = new mongoose.Schema({
  OrderID: String,
  OrderStatus: String,
  CustomerInfo: String,
  CustomerID: String,
  OrderedProduct: Array,
  OrderedTime: String,
  totalPrice: Number,
  rating_score: String,
  review: String,
  isRated: Boolean,
  ExpireTime: String,
  DiscountOrder: Boolean,
})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order