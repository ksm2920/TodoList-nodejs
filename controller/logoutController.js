const logout = (req, res) => {
    res.clearCookie('jwtToken').redirect('/login');
}

module.exports = {logout};