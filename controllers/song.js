const test = (req, res) => {
    return res.status(200).send({
        message: "Send from song controller"
    });
};

module.exports = {
    test
}