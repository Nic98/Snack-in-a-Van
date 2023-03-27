const mongoose = require("mongoose")

//set up vendorSchema
const vendorSchema = new mongoose.Schema({
  vendor_id: String,
  van_name: String,
  password: String,
  location: String,
  Latitude: Number,
  Longitude: Number,
  isOpen: Boolean,
})

const Vendor = mongoose.model("Vendor", vendorSchema)

module.exports = Vendor