const jwt = require('jsonwebtoken');
const config = require('../config');

async function verifyTokenGrupoActivo(req, res, next) {
    const token = req.headers['x-access-token-grupoactivo'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided' });
    }
    // Decode the Tokenreq.userId = decoded.id;
    const decoded = await jwt.verify(token, config.secret);
    req.grupoActivo = decoded.id;
    console.log(decoded);
    next();
}

module.exports = verifyTokenGrupoActivo;