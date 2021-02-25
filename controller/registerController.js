const User = require('../model/user');
const bcrypt = require('bcrypt');

const registerRender = (req, res) => {
    res.clearCookie('jwtToken');
    res.render('register.ejs', {error:""});
}

const registerSubmit = async(req, res) => {
    console.log("registerSubmit");
    const {username, email, password} = req.body;
    const existingUser = await User.findOne({username:username});
    const existingEmail = await User.findOne({email:email});
    
    console.log(existingUser);
    
    if(!username || !email || !password) 
    return res.render('register.ejs', {error:"Please fill out the form."})
    
    if(existingUser != null && username === existingUser.username)
    return res.render('register.ejs', {error:"The username is taken. Please use an another username."});
    
    if(existingEmail != null && email === existingEmail.email) 
    return res.render('login.ejs', {error:"You already have an account with this email, please sign in."});   
    
    try {        
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        new User ({
            username: username,
            email: email,
            password: hashedPassword
        }).save();
        
        return res.redirect('/login');
    }
    catch (err) {
        return res.render('register.ejs', {error:"System error " + err})
    }
}

module.exports = {
    registerRender,
    registerSubmit
}