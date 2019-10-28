const pool = require('../database/database');
const fetch = require('node-fetch');

const userController = {};

userController.createAddress = async (req, res, next)=>{

  const { firstname, lastname, street, city, state, country } = req.body;

  // check if state is valid for country. if so, then add to database.
  // if not, provide user feedback.
  try {
    const result = await fetch(`http://www.groupkt.com/state/get/${country}/${state}`)
    const values = await result.json();
  
    if (values.RestResponse.result){
      const text = 'INSERT INTO address (firstname, lastname, street, city, state, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
      const values = [firstname, lastname, street, city, state, country];
  
      const results = await pool.query(text, values);
      res.locals.id = results.rows[0].id;
    }
    else {
      return res.status(400).json('Sorry, unable to complete your request. Please check your state and country codes then try again. Hint: make sure to use ISO codes for both.')
    }
  
    next();
  }
  catch(err){
    return console.error(err);
  }

};

module.exports = userController;