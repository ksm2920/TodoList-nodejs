const User = require('../model/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

require('dotenv').config;


const transport = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
        user: process.env.TRANSPORT_MAIL,
        pass: process.env.MAIL_PASS
    },
    tls:{
        rejectUnauthorized:false
    }
    
})

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
        
        const newUser = new User ({
            username: username,
            email: email,
            password: hashedPassword
        });
        
        newUser.save();
        
        await transport.sendMail({
            from: process.env.TRANSPORT_MAIL,
            to: newUser.email,
            subject: "Welcome to TODOS",
            html: `<h2>Hello ${newUser.username}!</h2>
            <p>I am delighted that you're taking the first step to try my app "TODOS".</p>
            <p>You can create your own todo list to track things you need to do.</p>
            <p>Hope you enjoy TODOS.</p>`
        })
        res.redirect('/login');
    }
    catch (err) {
        return res.render('register.ejs', {error:"System error " + err})
    }
}

module.exports = {
    registerRender,
    registerSubmit
}