const User = require('../models/User')
const jwt = require('jsonwebtoken')
//Handle errors
const handleErrors = (err) => {
    const errors = {email: '', password: ''};

    console.log(err.message);
    // Incorrect email 
    if(err.message === "Incorrect Password"){
        errors.password = "Incorrect Password";
    }

    if(err.message === "Email not exist"){
        errors.email = "Email not exist";
    }
    // Duplicate error 
    if(err.code == 11000){
        errors.email = "That email is already registered"
    }

    // Validation errors
    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors

}
const maxAge = 1000 * 60 * 60 * 24 * 30;
// Token creator 
const createToken = (id) => {
    return jwt.sign({id}, 'mysecret', {
        expiresIn : maxAge
    })
}
module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.signup_post = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.create({email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge})
        res.status(200).json({user: user._id })
    }catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password);
    try{
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, {maxAge})
        res.json({user: user._id})
    }catch(err) {
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}