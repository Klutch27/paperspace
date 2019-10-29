const pool = require('../database/database');
const fetch = require('node-fetch');

const userController = {};

userController.createAddress = async (req, res, next) => {
// the only required data is a state and country
// everything else will be filled with NULL values (but these can be updated by user via PATCH request)
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

userController.updateAddress = async (req, res, next) =>{
  const { id, firstname, lastname, street, city, state, country } = req.body;
  try {
    if (id){    
      // pull data from db.
      // compare user inputted values to stored values
      // any values the user did not supply, create them from database information
      // store new updated values
      // note: prevents NULL values from being saved in database.
      const oldData = await pool.query('SELECT * FROM address WHERE id=$1', [id]);
      if (!oldData.rowCount){
        return res.status(400).json('No record exists for given id. Please check your input and try again.')
      }

      const userInput = {
        firstname,
        lastname,
        street,
        city,
        state,
        country
      };

      for (let key in userInput){
        if (!userInput[key]) userInput[key] = oldData.rows[0][key];
      }

      // check userInputted state and country to make sure that they're valid
      const checkLocation = await fetch(`http://www.groupkt.com/state/get/${userInput.country}/${userInput.state}`)
      const verified = await checkLocation.json();

      // if userInputted state and country are valid, update their info.
      if (verified.RestResponse.result){
        const newValues = [id, userInput.firstname, userInput.lastname, userInput.street, userInput.city, userInput.state, userInput.country]
  
        const text = 'UPDATE address SET firstname=$2, lastname=$3, street=$4, city=$5, state=$6, country=$7 WHERE id=$1 RETURNING *';
        const results = await pool.query(text, newValues);
        if (results.rows){
          return res.status(200).json(results.rows[0]);
        }
        else{
          return res.status(400).json('Please check your data and try again.');
        }
      }
      // user inputted an invalid state/county combination
      else {
        return res.status(400).json('Sorry, unable to complete your request. Please check your state and country codes then try again. Hint: make sure to use ISO codes for both.')
      }
    }
    // user provided an invalid id
    else {
      return res.status(400).json('Please include the unique address id in your request.');
    }

  }
  catch(err){
    console.error(err);
    return res.status(500).json('Server error. Please try again.');
  };

};

userController.deleteAddress = async (req, res, next)=>{
  const { id } = req.body;

  try {
    if (id){
      const text = 'DELETE FROM address WHERE id=$1'
      const values = [id];
      const results = await pool.query(text, values);

      if (results.rowCount > 0){
        return res.status(200).json('Record deleted.')
      }
      else {
        return res.status(400).json('No record exists for given id.')
      }
    }
    else {
      return res.status(400).json('Please include the unique address id in your request, and try again.');
    }
  }
catch(err){
  console.error(err);
  return res.status(500).json('There was an error trying to delete your record. Please try again.')
}
}

module.exports = userController;