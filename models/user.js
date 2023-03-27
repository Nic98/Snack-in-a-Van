const mongoose = require("mongoose")

//set up userSchema
const userSchema = new mongoose.Schema({
  last_name: String,
  first_name: String,
  email: String,
  password: String,
  userID: String,
  latestOrder: String,
})

const User = mongoose.model("User", userSchema)

module.exports = User