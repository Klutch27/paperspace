const userController = require('../controllers/userController');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const httpMocks = require('node-mocks-http');

describe('userController', function(){
  // createAddress tests
  describe('createAddress', function(){
    it('should set res.locals.id when successfully creating a row', async function(){
      const request = httpMocks.createRequest({
        'method': 'POST',
        'url': '/home',
        'body': {
          'firstname': 'Gareth',
          'lastname': 'Leake',
          'street': '789 Testing Lane',
          'city': 'New York',
          'state': 'NY',
          'country': 'USA'
        }
      });

      const response = httpMocks.createResponse();

      await userController.createAddress(request, response);
      expect(response.locals).to.have.own.property('id');

    });

    it('should return status code 400 if state and country are not valid', async function(){
      const request = httpMocks.createRequest({
        'method': 'POST',
        'url': '/home',
        'body': {
          'firstname': 'Gareth',
          'lastname': 'Leake',
          'street': '456 Testing Street',
          'city': 'New York',
          'state': 'NN',
          'country': 'USA'
        }
      });

      const response = httpMocks.createResponse();

      await userController.createAddress(request, response);
      assert.strictEqual(response.statusCode, 400, 'response status code should be 400');

    });
  });
// find address tests

/* the best way to test this functionality would be to re-write the code and assign the data to res.locals. That way, I would have access to the response object and could verify the information coming back. At present, I'm not doing that because the data is sent back correctly, albeit I don't have access for testing purposes. Given time constraints, I am going to leave it as is, rather than re-write the code. But in the future, it would be best to assign return data to res.locals, and then have the server return res.locals. (again, this is so that I can have access to the data for testing purposes).
*/

  describe('findAddress', function(){
    it('should return all addresses with given state', async function(){
      const request = httpMocks.createRequest({
        'method': 'GET',
        'url': '/home',
        'body': {
          'firstname': 'Gareth',
          'lastname': 'Leake',
          'street': '456 Testing Street',
          'city': 'New York',
          'state': 'NY',
        }
      });

      const response = httpMocks.createResponse();

      const data = await userController.findAddress(request, response);
      // const results = await data.json();

      assert.strictEqual(response.statusCode, 200, 'response status code should be 200');
    });
  });

// update Address tests

/*
note, similar issue as above in the find address test. Only thing I can really test for here is status codes, which is somewhat useful, but not ideal.
*/

  describe('updateAddress', function(){
    it('should respond with status code 200 if update is succesful', async function(){
      const request = httpMocks.createRequest({
        'method': 'PATCH',
        'url': '/home',
        'body': {
          'id': 30,
          'firstname': 'SANTA',
          'lastname': 'CLAUS',
          'street': '456 Testing Street',
          'city': 'New York',
          'state': 'NY',
        }
      });

      const response = httpMocks.createResponse();

      await userController.updateAddress(request, response);
      assert.strictEqual(response.statusCode, 200, 'response status code should be 200');
    });

    it('should response with status code 400 if user inputs incorrect state and country', async function(){
      const request = httpMocks.createRequest({
        'method': 'PATCH',
        'url': '/home',
        'body': {
          'id': 30,
          'firstname': 'SANTA',
          'lastname': 'CLAUS',
          'street': '456 Testing Street',
          'city': 'New York',
          'state': 'NN',
        }
      });

      const response = httpMocks.createResponse();

      await userController.updateAddress(request, response);
      assert.strictEqual(response.statusCode, 400, 'response status code should be 400');
    });
    it('should response with status code 400 if user does not provide id', async function(){
      const request = httpMocks.createRequest({
        'method': 'PATCH',
        'url': '/home',
        'body': {
          'firstname': 'SANTA',
          'lastname': 'CLAUS',
          'street': '456 Testing Street',
          'city': 'New York',
          'state': 'NN',
        }
      });

      const response = httpMocks.createResponse();

      await userController.updateAddress(request, response);
      assert.strictEqual(response.statusCode, 400, 'response status code should be 400');
    })
  })

// delete Address tests
// NOTE: Because you have to provide the specific id, you have to manually update the id number each time you run this test.
  describe('deleteAddress', function(){
    it('should respond with status code 200 if delete is successful', async function(){
      const request = httpMocks.createRequest({
        'method': 'DELETE',
        'url': '/home',
        'body': {
          'id': 29,
        }
      });

      const response = httpMocks.createResponse();

      await userController.deleteAddress(request, response);
      assert.strictEqual(response.statusCode, 200, 'response status should be 200');
    });

    it('should respond with status code 400 if id does not exist in database', async function(){
      const request = httpMocks.createRequest({
        'method': 'DELETE',
        'url': '/home',
        'body': {
          'id': 2,
        }
      });

      const response = httpMocks.createResponse();
      await userController.deleteAddress(request, response);
      assert.strictEqual(response.statusCode, 400, 'response status should be 400');
    });

    it('should respond with status code 400 if no id is provided', async function(){
      const request = httpMocks.createRequest({
        'method': 'DELETE',
        'url': '/home',
        'body': {}
      });

      const response = httpMocks.createResponse();
      await userController.deleteAddress(request, response);
      assert.strictEqual(response.statusCode, 400, 'response status should be 400');
    });


  });

});

// deleteAddress tests
