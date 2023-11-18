const User= require('../model/User');

const handleLogout= async (req,res)=>{
// On client, also delete the accessToken

    const cookies=req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken= cookies.jwt;

    //Is refreshToken in db?
    const foundUser=await User.findOneAndUpdate({"refreshToken": refreshToken},{
        refreshToken: foundUser.refreshToken.filter(rt=> rt !== refreshToken)
    });


    res.clearCookie('jwt',{httpOnly:true ,sameSite:'None', secure:false}); // secure:true - only serves on http
    res.sendStatus(204);
    }
    

module.exports= {handleLogout}
