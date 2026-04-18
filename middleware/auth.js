const jwt = require('jsonwebtoken');
const User = require("../models/user");

const authenticate = async(req,res,next)=>{

    try{
        const token = req.header('authorization');
        const userInfo = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findByPk(Number(userInfo.userId));
        if(user){
            req.user = user;
            return next();
        }
        return res.status(404).json({message:"User not found"});
    }catch(err){
        return res.status(401).json({message:"Unauthorized user."})
    }
};
module.exports = authenticate;