const validator = require("validator");
const validate = (params) => {
    let name = !validator.isEmpty(params.name)
        && validator.isLength(params.name, { min: 3, max: 20 })
        && validator.isAlpha(params.name, "es-ES");
    let nick = !validator.isEmpty(params.nick)
        && validator.isLength(params.nick, { min: 3, max: 60 })
        && validator.isAlpha(params.nick, "es-ES");
    let email = !validator.isEmpty(params.email)
        && validator.isEmail(params.email);
    let password = !validator.isEmpty(params.password);
    if (params.surname) {
        let surname = !validator.isEmpty(params.surname)
            && validator.isLength(params.surname, { min: 3, max: 20 })
            && validator.isAlpha(params.surname, "es-ES");
        if (!surname) throw new Error("Error validating surname");
    }

    if (!name || !nick || !email || !password) throw new Error("Error validating required fields");
}

module.exports = validate;