const express = require('express');
const app = express();
const PORT = 3000;
require('dotenv').config();

const userController = require('../controllers/userController');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/home', userController.createAddress, (req, res, next)=>{
  res.status(200).json(res.locals.id);
})


app.use((req, res, next)=>{
  res.status(404).json('Sorry, the page you are looking for does not exist.')
});
app.listen(PORT, ()=>console.log(`Server is listening on PORT ${PORT}...`));