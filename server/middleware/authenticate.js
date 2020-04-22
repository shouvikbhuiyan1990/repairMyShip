const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const auth = async function (req, res, next) {
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, 'mysecretkey');
        const user = await Users.findOne({ _id: decoded._id, 'tokens.token': token});

        if( !user ) {
            res.status(401).send({error: 'No Such User'});
        }

        req.token = token;
        req.user = user;
        next();
    }
    catch(e) {
        res.status(401).send({error: 'Athorization failed'});
    } 
}

const authLogin = async function (req, res, next) {
    try{
        const token = req.headers.authorization;
        if( !req.headers.authorization ) {
            next();
        }
        else {
            const decoded = jwt.verify(token, 'mysecretkey');
            const user = await Users.findOne({ _id: decoded._id, 'tokens.token': token});
    
            if( !user ) {
                res.status(401).send({error: 'No Such User'});
            }
    
            req.token = token;
            req.user = user;
            next();
        }
    }
    catch(e) {
        res.status(401).send({error: 'Athorization failed'});
    } 
}

module.exports = { auth, authLogin };