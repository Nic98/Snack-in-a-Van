const mongoose = require("mongoose")
let menu_length = 0

const Vendor = mongoose.model("Vendor")

const customer_get = function(req, res){
    Vendor.find()
    .lean()
    .then(function (vendors) {
        res.render("customer", {vendors: vendors, user: req.user})
    })
}

//export all function
module.exports = {
  customer_get //, updateAuthor, addAuthor
}