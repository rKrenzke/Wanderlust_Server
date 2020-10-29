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

app.use(express.json());
app.use(require('./middlewares/cors'));

app.use('/user', user);
app.use('/trips', trip);

app.listen(4000, function(){
    console.log('App is listening on 4000')
});