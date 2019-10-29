const userController = require('../controllers/userController');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const httpMocks = require('node-mocks-http');

describe('userController', function(){
  // createAddress testing
  describe('createAddress', function(){
    it('should set res.locals.id when successfully creating a row', function(){
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

      userController.createAddress(request, response);

      expect(response.locals.id).to.be.an('integer');
    });

    it('should return status code 400 if state and country are not valid', function(){
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

      userController.createAddress(request, response);
      assert.strictEqual(response.statusCode, 400, 'response status code should be 400');

    });
  });

  describe('deleteAddress', function(){
    it('should respond with status code 200 if delete is succesful', function(){
      const request = httpMocks.createRequest({
        'method': 'DELETE',
        'url': '/home',
        'body': {
          'id': 4,
        }
      });

      const response = httpMocks.createResponse();

      userController.deleteAddress(request, response);
      assert.strictEqual(response.statusCode, 200, 'response status should be 200');
    });

    it('should respond with status code 400 if id does not exist in database', function(){
      const request = httpMocks.createRequest({
        'method': 'DELETE',
        'url': '/home',
        'body': {
          'id': 2,
        }
      });

      const response = httpMocks.createResponse();
      userController.deleteAddress(request, response);
      assert.strictEqual(response.statusCode, 400, 'response status should be 400');
    });

    it('should respond with status code 400 if no id is provided', function(){
      const request = httpMocks.createRequest({
        'method': 'DELETE',
        'url': '/home',
        'body': {}
      });

      const response = httpMocks.createResponse();
      userController.deleteAddress(request, response);
      assert.strictEqual(response.statusCode, 400, 'response status should be 400');
    });


  });

});

// deleteAddress tests
