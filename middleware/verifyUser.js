const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    
    const token = req.cookies.jwtToken;
    console.log("Verify token")
    if(!token) 
        return res.render("login.ejs", { error:"" })
    
    const validUser = jwt.verify(token, process.env.SECRET_KEY)
    
    if(validUser) {
        req.user = validUser;
    }
    next();
}

module.exports = verifyToken;