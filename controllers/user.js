const validate = require("../validation/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../jwt/jwt");

const test = (req, res) => {
    return res.status(200).send({
        message: "Send from user controller"
    });
};

// Sign up
const signup = (req, res) => {
    // Get data
    let params = req.body;
    // Required data
    if (!params.name || !params.nick || !params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Missing required fields"
        })
    }
    // Validate data
    try {
        validate(params);
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: "error",
            message: "Error validating fields"
        })
    }
    // User duplicate
    User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { email: params.nick.toLowerCase() }
        ]
    }).then(async users => {
        if (users && users.length > 1) {
            return res.status(400).send({
                status: "error",
                message: "Duplicated user"
            })
        }
        // Password encryption
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;
        // Create user model
        let userToSave = new User(params);
        // Save user
        userToSave.save().then(userStored => {
            if (!userStored) {
                return res.status(500).send({
                    status: "error",
                    message: "Error saving user"
                })
            }
            return res.status(200).send({ status: "success", message: "User registered", user: userStored.email });
        }).catch(error => {
            console.error(error);
            return res.status(500).send({
                status: "error",
                message: "Error saving user"
            })
        });
    }).catch(error => {
        console.error(error);
        return res.status(500).send({
            status: "error",
            message: "Error checking for duplicated user"
        })
    });
};

const login = (req, res) => {
    // Get parameters
    let params = req.body;
    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Missing required fields"
        })
    }
    // Find user
    User.findOne({ email: params.email })
        .then(userStored => {
            if (!userStored) {
                return res.status(404).send({
                    status: "error",
                    message: "User not found"
                });
            }

            // Check password
            const pwd = bcrypt.compareSync(params.password, userStored.password);
            if (!pwd) {
                return res.status(400).send({
                    status: "error",
                    message: "Invalid password"
                });
            }
            const identityUser = { ...userStored.toObject() };
            delete identityUser.password;
            delete identityUser.role;
            // JWT Token
            const token = jwt.createToken(userStored);
            return res.status(200).send({
                status: "success",
                message: "Login succesful",
                user: identityUser,
                token
            });
        })
        .catch(error => {
            console.error(error);
            return res.status(400).send({
                status: "error",
                message: "Error fiding user"
            });
        });
};

const profile = (req, res) => {
    const id = req.params.id;
    User.findById(id).then(user => {
        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "User not found"
            });
        }
        const identityUser = { ...user.toObject() };
        delete identityUser.password;
        delete identityUser.role;
        return res.status(200).send({
            status: "success",
            message: "User profile found",
            user: identityUser
        });
    }).catch(error => {
        console.error(error);
        return res.status(400).send({
            status: "error",
            message: "Error fiding user"
        });
    });
};

module.exports = {
    test,
    signup,
    login,
    profile
}