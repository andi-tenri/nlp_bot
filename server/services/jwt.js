const jwt = require('jsonwebtoken')

const signToken = (user) => {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email
    }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

const isTokenValid = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
    signToken,
    isTokenValid
}