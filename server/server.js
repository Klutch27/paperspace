const express = require('express');
const app = express();
const PORT = 3000;
require('dotenv').config();

const userController = require('../controllers/userController');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// different method used for POST then the other three, in order to demonstrate knowledge of various methods. Could use next() to chain middleware. But for the purposes of this application, there's only ever one thing happening at a time, so I don't really need to utilize res.locals for storage. Thus, in the other cases, I return a server response directly from the function, rather than invoking next() and returning from this level (server.js file).

app.post('/home', userController.createAddress, (req, res, next)=>{
  res.status(200).json(res.locals.id);
})

app.get('/home', userController.findAddress);

// note: update Address can be revisited and tweaked further. see notes written in code there.
// note 2: patch used instead of PUT, because PUT deletes and re-writes the entry. PATCH edits the entry. No need to delete and re-write when it's updating an existing record.
app.patch('/home', userController.updateAddress);

app.delete('/home', userController.deleteAddress);


app.use((req, res, next)=>{
  res.status(404).json('Sorry, the page you are looking for does not exist.')
});
app.listen(PORT, ()=>console.log(`Server is listening on PORT ${PORT}...`));