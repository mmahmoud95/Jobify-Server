const notFoundMiddleware = (req, res) => {
    res.status(404).send("Not Found");
};
module.exports = { notFoundMiddleware };
