const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    learned:{
        type: Number
    },
    tested:{
        type: Number
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
});

//hashing password before save
userSchema.pre('save',async function(next) {

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
        const err = new Error('Invalid email format');
        return next(err);
    }
    
    //password encryption
    if(this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
});

const User = mongoose.model('User',userSchema);
module.exports = User;