const jwt = require("jwt-simple");
const moment = require("moment");

const key = "KEY_EMAPLE_69876876";

const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days"),
    };
    return jwt.encode(payload, key);
};

module.exports = { key, createToken };