require('dotenv').config();
const express = require('express');
const app = express();

let sequelize = require('./db');
let user = require('./controllers/userController');
let trip = require('./controllers/tripController');

sequelize.authenticate().then(async () => {
    console.log('Database CONNECTED');
    sequelize.sync();
})
.catch((e) => {
    console.log(e);
    console.log('NO DATABASE CONNECTION')
})

// allows client to make calls to api server
const cors = require("cors");
app.use(cors())

app.use(express.json());
app.use(require('./middlewares/cors'));

app.use('/user', user);
app.use('/trips', trip);

app.listen(process.env.PORT, function(){
    console.log(`Server is listening on ${process.env.PORT}`)
});