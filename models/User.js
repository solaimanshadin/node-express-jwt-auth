const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt  = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [isEmail , "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be gether than or equal 6']
    }
}, {timestamps: true})

// Static login method
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email})
    if(user) {
        const auth = await bcrypt.compare(password, user.password)
        if(auth) {
            return user
        }
        throw Error("Incorrect Password")
    }
    throw  Error("Email not exist")
}

// Fire a function after doc saved to db
userSchema.post('save', (doc, next) => {
    console.log("new user was created");
    next()
})

// Fire a function before saving
userSchema.pre('save', async function (next)  {
    
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next()
})
const User = mongoose.model('User', userSchema);

module.exports = User;