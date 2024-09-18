const test = (req, res) => {
    return res.status(200).send({
        message: "Send from album controller"
    });
};

module.exports = {
    test
}