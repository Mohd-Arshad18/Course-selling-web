const jwt = require('jsonwebtoken');
const { JWT_USER_PASSWORD } = require("../config");

function userMiddleware(req, res, next){
    try {
        const token = req.headers.token;
        
        if (!token) {
            return res.status(403).json({
                message: "No token provided"
            });
        }
        
        const decoded = jwt.verify(token, JWT_USER_PASSWORD);
        req.userId = decoded.id;
        next();
    } catch(e) {
        res.status(403).json({
            message: "Invalid token"
        });
    }
}

module.exports = {
    userMiddleware: userMiddleware
}
