const validator = require("validator");
const validate = (params) => {
    let name = !validator.isEmpty(params.name)
        && validator.isLength(params.name, { min: 3, max: 20 })
        && validator.isAlpha(params.name, "es-ES");
    let nick = !validator.isEmpty(params.nick)
        && validator.isLength(params.nick, { min: 3, max: 20 })
        && validator.isAlpha(params.nick, "es-ES");
}