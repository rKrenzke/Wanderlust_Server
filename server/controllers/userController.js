require('dotenv').config();
let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let User = require('../models/user')(sequelize, require("sequelize"));
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

//User Endpoints

//Register
router.post('/register', function(request, response){
    let username = request.body.user.username;
    let email = request.body.user.email;
    let password = request.body.user.password;

    User.create({
        username,
        email,
        password: bcrypt.hashSync(password, 10)
    }).then(
        function createSuccess(user){
            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
            response.json({
                user,
                message: 'User successfully created',
                sessionToken: token
            });
        },
        function createError(err){
            response.send(500, err.message);
        }
    );
});

//Login
router.post('/login', function(request, response){
    User.findOne({where: {username: request.body.user.username}}).then(
        function(user){
            if(user){
                bcrypt.compare(request.body.user.password, user.password, function (err, matches){
                    if(matches){
                        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
                        response.json({
                            user,
                            message: "Authentication Successful",
                            sessionToken: token
                        })
                    } else{
                        response.send(502).send({error: "Bad Gateway"});
                    }
                });
            } else{
                response.status(500).send({error: "Internal Server Error"});
            }
        },
        function(err){
            response.status(501).send({error: "Not Implemented"});
        }
    );
});

module.exports = router;