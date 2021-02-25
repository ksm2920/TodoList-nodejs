const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const loginRender = (req, res) => {
    console.info("loginRender");
    const jwtTokenCookie = req.cookies.jwtToken;
            
    if(jwtTokenCookie) {
        console.info("redirect to /");
        return res.redirect('/');
    }
    res.render('login.ejs', {error:""})
}

const loginSubmit = async(req, res) => {
    console.info("loginSubmit");
    const {username, password} = req.body;
    
    if(!username || !password) 
        return res.render('login.ejs', {error:"Please put your username and password."})

    try {
        const user = await User.findOne({username:username});
        
        if(!user) 
            return res.render('register.ejs', {error:"You don't have an account. Please sign up."});
        
        const validUser = await bcrypt.compare(password, user.password);
        
        if(!validUser) 
            return res.render('login.ejs', {error:"Wrong password"})
           
        const jwtToken = await jwt.sign({user:user}, process.env.SECRET_KEY)
        
        if(jwtToken) {
            res.cookie("jwtToken", jwtToken, {maxAge: 3600000, httpOnly: true});
            return res.redirect('/');
        }
        return res.redirect('/login');
    } catch(err) {
        return res.render('login.ejs', {error:"System error " + err})
    }
}

module.exports = {
    loginRender,
    loginSubmit
}