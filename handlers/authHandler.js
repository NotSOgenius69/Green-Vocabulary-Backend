const User = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRY = '7d';

const signup = async(req,res) => {
    try
    {
        //Creating new user
        const {email,password} = req.body;
        const user = new User({email,password, learned:0 , tested:0});
        await user.save();

        //jwt token signing
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET , { expiresIn: TOKEN_EXPIRY });

        //response
        res.status(200).json({
            success:true,
            message:'SignUp successful',
            user:{
                isAdmin:user.isAdmin
            },
            token
        });
    }catch(error){
        res.status(400).json({
            success:false,
            message:'SignUp Failed',
            error: error.message || error
        });
    }
};

const login = async(req,res) => {
    try
    {
        //finding user
        const {email,password} = req.body;
        const user = await User.findOne({email});

        //user not found
        if(!user){
            return res.status(400).json({
                success:false,
                message:'User Not Found'
            });
        }

        //verifying password
        const isValidPassword = await bcrypt.compare(password,user.password);
        if(!isValidPassword){
            return res.status(400).json({
                success:false,
                message:'Invalid Password'
            });
        }

        //jwt token signing
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET , { expiresIn: TOKEN_EXPIRY });

        //response
        res.status(200).json({
            success:true,
            message:'Login Successful',
            user:{
                isAdmin:user.isAdmin
            },
            token
        })
    }catch(error){
        res.status(500).json({
            message:'Something went wrong in server side',
            error : error.message || error
        });
    }
};

module.exports = { signup , login }