const bcrypt = require("bcryptjs")
const passport = require("passport")

const User = require("../models/user")

//GET function to render the login page
const login_get = function(req, res){
    res.render("login", { message: req.flash('error'), user:req.user });
}

//GET function to render the user dashboard
const dashboard_get = function(req, res){
    res.render("dashboard", {user: req.user})
}

//POST function to validate user's login information and redirect to corresponding pages
const login_post = function(req, res, next){
    passport.authenticate("local", {
        successRedirect: "/customer/menu",
        failureRedirect: "/customer/menu/login",
        failureFlash: true,
        successFlash: true,
    })(req, res, next)
}

//GET function to log out from current user 
const logout_get = function (req, res) {
    req.logout();
    res.redirect("/customer/menu")
}

//GET function to render the forget password page
const password_forget_get = function(req,res){
    res.render("forgot_password")
}

//GET function to render the register page
const register_get = function(req,res){
    res.render("register")
}

//POST function to register new users
const register_post = function(req,res){
    //get all user credentials from req body
    const {last_name, first_name, email, password, confirm_password} = req.body
    let errors = []

    //validate all fields
    if (!last_name || !first_name || !email || !password || !confirm_password) {
        req.flash('registerError', 'Please enter all fields');
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password !== confirm_password) {
        req.flash('registerError', 'Passwords do not match');
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        req.flash('registerError', 'Password must be at least 6 characters');
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    //return error when there's any
    if (errors.length > 0) {
        res.render("register", {
            errorMessage: req.flash("registerError"),
            errors,
            last_name,
            first_name,
            email,
            password,
            confirm_password,
        })
    } else {
        //avoid duplicate registration of users
        User.findOne({ email: email }).then((user) => {
            if (user) {
                req.flash('registerError', 'Email already exists');
                res.render("register", {
                    errorMessage: req.flash("registerError"),
                    errors,
                    last_name,
                    first_name,
                    email,
                    password,
                    confirm_password,
                });
            } else {
                //create user
                const userID = makeid(10)
                const newUser = new User({
                    last_name,
                    first_name,
                    email,
                    password,
                    userID,
                });
                //encrypt password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then((user) => {
                                req.flash('registerSuccess', 'You are now registered and can log in');
                                res.render("register", { successMessage: req.flash("registerSuccess") });
                            })
                            .catch((err) => console.log(err));
                    });
                });
            }
        });
    }
}

//generate random strings for new IDs
function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
}

//exports all functions
module.exports = {
    login_get, password_forget_get, register_get, register_post, login_post, dashboard_get, logout_get //, updateAuthor, addAuthor
}