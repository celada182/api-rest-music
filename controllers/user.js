const test = (req, res) => {
    return res.status(200).send({
        message: "Send from user controller"
    });
};

module.exports = {
    test
}