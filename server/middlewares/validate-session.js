let jwt = require('jsonwebtoken');
let sequelize = require('../db');
let User = require('../models/user')(sequelize, require("sequelize"));

module.exports = function(request, response, next){
    if(request.method == 'OPTIONS'){
        next();
    }else{
        let sessionToken = request.headers.authorization;
        console.log(sessionToken)
        if(!sessionToken) return response.status(403).send({auth: false, message: 'No Token Provided.'});
        else{
            jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
                if(decoded){
                    User.findOne({where: { id: decoded.id }}).then(user => {
                        request.user = user;
                        next();
                    },
                    function(){
                        response.status(401).send({error: 'Not Authorized'});
                    });
                }else{
                    response.status(400).send({error: 'Not Authorized'});
                }
            });
        }
    }
}