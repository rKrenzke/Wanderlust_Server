require("dotenv").config();
let express = require("express");
let router = express.Router();
let sequelize = require("../db");
let User = require("../models/user")(sequelize, require("sequelize"));
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

//User Endpoints

//Register
router.post("/register", function (request, response) {
  // we wrap our code in a try/catch incase the request doesn't contain a user object
  try {
    const { username, email, password } = request.body.user;
    //user did not provide their username and password
    if (!username || !password) {
      response.status(400).send("Provide username and password");
      return;
    }

    //check if username already exists
    let userExists = false;
    User.findOne({
      where: {
        username,
      },
    }).then((user) => {
      // determine if the user exists for the given username
      userExists = !!user;

      // if username already exists, return an error
      if (userExists) {
        console.log("user already exists");
        response.status(400).send("Username already exists");
        return;
      }

      // if username doesn't exist create user
      User.create({
        username: username,
        password: bcrypt.hashSync(password, 10),
        email: email
      }).then((user) => {
        // generate a session token using the newly created user object
        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});

        // respond to the request with the following info
        response.status(200).send({
          user: user,
          message: "Account registered",
          sessionToken: token,
        });
        return;
      });
    });
  } catch (error) {
    console.log("create user error", error);
    response.send(500, "Error");
    return;
  }
});

//Login
router.post("/login", function (request, response) {
  User.findOne({ where: { username: request.body.user.username } }).then(
    function (user) {
      if (user) {
        bcrypt.compare(request.body.user.password, user.password, function (
          err,
          matches
        ) {
          if (matches) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              expiresIn: 60 * 60 * 24,
            });
            response.json({
              user,
              message: "Authentication Successful",
              sessionToken: token,
            });
          } else {
            response.status(400).send({ error: "User not found or invalid credentials" });
          }
        });
      } else {
        response.status(400).send({ error: "User not found or invalid credentials" });
      }
    },
    function (err) {
      response.status(501).send({ error: "Not Implemented" });
    }
  );
});

module.exports = router;
