module.exports = {
    verifyToken: function (req, res, next) {
        const token = req.headers['x-access-token'];
        if (typeof token !== undefined) {
            next();
        } else {
            res.status(403).send({ auth: false, message: 'No token provided' })
        }
    }
}