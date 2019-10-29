# paperspace

**How to Test Application**
This application is strictly a backend Node application, with a server and database (PostgresQL). Curl commands are provided, although I personally recommend utilizing postman as it's a cleaner interface (as well as the tool I used for testing and developing). 

Once the code has been downloaded:

- `npm install`
  - install dependencies
- `npm start`
  - you should see the server and database initialize
===
*POST Requests*

Return Value: unique id. This id is needed in order to update/delete records (note: this value is also found in the response of a GET request, so you can look it up later if needed.)

A state and country (with proper ISO) codes are the only requirements when making a post request. However, the following properties may be utilized to create a new record:

`{
  'firstname': 'firstname',
  'lastname': 'lastname',
  'street': 'street',
  'city': 'city',
  'state': 'state',
  'country': 'country'
}`

Examples: 
```
curl -d '{"firstname":"Tom", "lastname":"Sawyer", "street":"123 Main Street", "city":"Brooklyn", "state":"NY", "country":"USA"}' -H "Content-Type: application/json" -X POST http://localhost:3000/home

curl -d '{"firstname":"Huck", "lastname":"Finn", "street":"456 Main Street", "city":"Brooklyn", "state":"NY", "country":"USA"}' -H "Content-Type: application/json" -X POST http://localhost:3000/home

curl -d '{"firstname":"Mark", "lastname":"Twain", "street":"789 Main Street", "city":"Brooklyn", "state":"NY", "country":"USA"}' -H "Content-Type: application/json" -X POST http://localhost:3000/home

```

===
*GET Requests*
Return value: Array of objects containing matches for your search parameters.

To view all data: `curl -X GET http://localhost:3000/home`

To retrieve entries for a particular state or country, you have to pass a body in the GET request. The state/country must be ISO codes. If there are no matches, the response is an empty array. Otherwise, the response is an array of objects that match your search parameters.

Examples:

`curl -X GET http://localhost:3000/home -d 'state=NY'`
`curl -X GET http://localhost:3000/home -d 'country=USA'`
===
*PATCH Requests*
Return Value: The update entry
Note: an id is required to update an entry. If you don't remember the id you wish to update, you can make a GET request and find your prior entry. The id will be listed there.

Example:
```
curl -d '{"id": 3, "firstname":"Marcus", "lastname":"Twain", "street":"789 Main Street", "city":"Brooklyn", "state":"NY", "country":"USA"}' -H "Content-Type: application/json" -X PATCH http://localhost:3000/home
```
===
*Delete Requests*
Return value: String indicating whether the value was deleted or not.

Example:
```
curl -d '{"id":1}' -H "Content-Type: application/json" -X DELETE http://localhost:3000/home

curl -d '{"id":2}' -H "Content-Type: application/json" -X DELETE http://localhost:3000/home
```

**Application Design**
