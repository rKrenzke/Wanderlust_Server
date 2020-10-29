let router = require('express').Router();
let sequelize = require('../db');
let User = require('../models/user')(sequelize, require("sequelize"));
let Trip = require('../models/trip')(sequelize, require("sequelize"));
let validateSession = require('../middlewares/validate-session');

//Trip CRUD endpoints

//Create
//POST new trip
router.post('/new', validateSession, function(request, response){
    let user_id = request.user.id;
    let location = request.body;
    let description = request.body;
    let sites = request.body;
    let rating = request.body;

    Trip
    .create({
        user_id,
        location,
        description,
        sites,
        rating
    })
    .then(
        function createSuccess(data){
            response.json(data);
        },
        function createError(err){
            response.send(500, err.message);
        }
    );
});

//Read
//GET all trips for user
router.get('/all', validateSession, function(request, response){
    let userid = request.user.id;

    Trip
    .findAll({
        where: {user_id: userid}
    })
    .then(
        function findAllSuccess(data){
            response.json(data);
        },
        function findAllError(err){
            response.send(500, err.message);
        }
    );
});
//Update
//PUT new rating for existing trip
router.put('/:id', function(request, response){
    let data = request.params.id;;
    let rating = request.body;

    Trip
    .update({
        rating: rating
    },
    {where: {id: data}}
    ).then(
        function updateSuccess(updatedLog){
            response.send(`Trip ${data} updated!`);
        },
        function updateError(err){
            response.send(500, err.message);
        }
    )
});


//Delete
//DELETE a trip from Trip List
router.delete('/:id', validateSession, function(request, response){
    let data = request.params.id;
    let user_id = request.user.id;

    Trip
        .destroy({
            where: {id: data, user_id: user_id}
        }).then(
            function deleteTripSuccess(data){
                response.send("Trip Deleted");
            },
            function deleteTripError(err){
                response.send(500, err.message);
            }
        );
});



module.exports = router;