const jwt = require("jwt-simple");
const moment = require("moment");
const { key } = require("../jwt/jwt");

exports.auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "No auth header"
        });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>
    try {
        const payload = jwt.decode(token, key);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: "error",
                message: "Expired token"
            });
        }
        req.user = payload;
    } catch (error) {
        return res.status(401).send({
            status: "error",
            message: "Invalid token"
        });
    }
    next();
};