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

userController.findAddress = async (req, res, next) => {
  // need to search state AND country. If state exists on req.body, search by state. otherwise, search by country.
  // note: below conditional is pretty repetitive. Leaving it right now for the sake of time, but there's probably a way to condense this (so it's neater.)
  try {
    const { state, country } = req.body;
    // const values = [state, country]
    console.log('state, country: ', state, country);
  
    // if state exists, return specific data.
    if (state){
      const text = 'SELECT * FROM address WHERE state=$1'
      const values = [state];
      const results = await pool.query(text, values);
      return res.status(200).json(results.rows);
    }
    // no state provided, therefore use general 'country' search.
    else if (country){
      const text = 'SELECT * FROM address WHERE country=$1'
      const values = [country]; 
      const results = await pool.query(text, values);
      return res.status(200).json(results.rows);
    }
    // no state or country, therefore assume they want to search all addresses and return all.
    else {
      const text = 'SELECT * FROM address'
      const results = await pool.query(text);
      return res.status(200).json(results.rows);
    }
  }
  catch(err){
    console.error(err);
    return res.status(500).json('Server Error.')
  }


};

module.exports = userController;