const jwt = require("jsonwebtoken");

authMiddleware = async  (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if(!token){
            return res.status(401).json({msg : "No auth token, access denied"});
        }
        const verified = jwt.verify(token, "drapcode");
        if(!verified){
            return res  
               .status(401)
               .json({msg : "Token verification failed, authorization denied"})
        }
        req.token = token;
        next();
    } catch(e) {
        return res.status(500).json({msg: e.message});
    }
};

module.exports = authMiddleware;
