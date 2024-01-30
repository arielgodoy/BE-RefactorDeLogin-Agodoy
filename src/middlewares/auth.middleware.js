function authentication(req, res, next) {    
    if (req.session.username !== 'ariel' || !req.session.admin) {
        res.status(401).send({ status: 'error', message: 'No autorizado' });
    } else {
        next();
    }
}
module.exports = authentication;
