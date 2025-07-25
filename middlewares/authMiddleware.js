const jwt = require('jsonwebtoken');

const auth = (req,res,next)=>{
    try
    {
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }catch(error){
        res.status(400).json({
            success:false,
            message:'Please authenticate',
            error: error.message || error
        });
    }
};

module.exports = auth;