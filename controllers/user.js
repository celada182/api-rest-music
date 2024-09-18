const test = (req, res) => {
    return res.status(200).send({
        message: "Send from user controller"
    });
};

// Sign up
const signup = (req, res) => {
    // Get data
    let params = req.body;
    console.log(params);
    // Required data
    if (!params.name || !params.nick || !params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Missing required fields"
        })
    }
    // Validate data
    
    // User duplicate
    // Password encryption
    // Create user model
    // Save user
    // Clean response
    return res.status(200).send({ status: "success", message: "User registered" });
};

module.exports = {
    test,
    signup
}