
const jwt = require('jsonwebtoken');
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req, res, next){
    try {
        const token = req.headers.token;
        
        if (!token) {
            return res.status(403).json({
                message: "No token provided"
            });
        }
        
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
        req.userId = decoded.id;
        next();
    } catch(e) {
        res.status(403).json({
            message: "Invalid token"
        });
    }
}

module.exports = {
    adminMiddleware: adminMiddleware
}

