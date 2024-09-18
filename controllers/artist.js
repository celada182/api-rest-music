const test = (req, res) => {
    return res.status(200).send({
        message: "Send from artist controller"
    });
};

module.exports = {
    test
}