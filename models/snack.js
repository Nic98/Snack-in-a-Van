const mongoose = require("mongoose")

//set up snackSchema
const snackSchema = new mongoose.Schema({
  snack_name: String,
  price: Number,
  details: String,
  type: String,
  add_on: String,
  size: String,
  mass: String,
  calories: String,
  id:String,
})

const Snack = mongoose.model("Snack", snackSchema)

module.exports = Snack