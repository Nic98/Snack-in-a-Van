const express = require('express');
const router = express.Router();

const customer_controller = require('./controllers/customerController.js')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('homepage', {user:req.user});
});

router.get('/customer', customer_controller.customer_get)



module.exports = router;
