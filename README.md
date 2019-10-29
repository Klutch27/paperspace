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

```
{
  'firstname': 'firstname',
  'lastname': 'lastname',
  'street': 'street',
  'city': 'city',
  'state': 'state',
  'country': 'country'
}
```

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

This application utilizes Node + Express.js, with a PostgresQL database.

Express was chosen for three reasons:

1. it allows easy access to request/response pipeline
2. it allows for modularized middleware
3. semantic and declarative architecture allows for fast server build (e.g. app.get, app.post, app.delete, etc.)

- Routing occurs at the top-most application level. Because the application was small, it was not necessary to subdivide with a localRouter. However, on a larger application, I would implement a localRouter as well in order to modularize the requests.

- I opted for controller middleware because it allows me to isolate each function and think about them independently, and then chain them together in the sequence necessary. Although this particular application only had one function each, when the application grows larger it's really nice to be able to chain middleware --> e.g. authenticate, setCookie, retrieveData. Each function is relatively small and and focuses (generally) on a single task.

- I chose PostgresQL because I find SQL databases to be -- in the majority of instances -- superior to NoSQL. The formal schema/structure and the ACID compliance of SQL are more valuable than the ease of use provided by NoSQL. While NoSQL (MongoDB, with Mongoose as an ODM) would have worked well here, I find it easier to reason about SQL queries, and node-postgres is a really excellent package for implementing SQL databases into a Node application.

- There is a lot of ES8 async/await syntax in the application. All database related actions are asynchronous, and I needed each action to execute synchronously in order to return the appropriate data to the user. Async/await is a cleaner syntax and easier to read, when compared to .then/.catch.

- While there are no real CPU intensive tasks, all of these are thread-blocking calls, and ultimately slow down application performance (because Node is single-threaded).

- Update requests include a piece of logic to ensure that no NULL values are stored in the database. This required me to first make a request to the database, and compare the stored data to the new user input. This does not seem very elegant, and I'd liek to think there is a better approach -- ideally one wherein I make fewer SQL queries. One solution would be: if I had a React front-end, the user data could be stored in state. Then, new user input could be compared against the user data stored in state. This would move the business logic client-side, but would decrease the number of SQL queries.

*Design Problems/Areas for Improvement*
- The GET request is not architected in an ideal manner. In order to send get specific state/country data, a GET request must be sent with a body -- an unusual behavior. What I should have done was pass the state/country into the request parameters, and pulled it from there.

- Search results could be cached, to increase application speed.

- Because the application only ever performs one task (Create, Read, Update, or Delete), instead of utilizing the `locals` property on the response object, I returned the requested data immediately. This presented a major problem when I implemented testing. Because the data was returned directly and never placed on the response object, there was not a way for me to check the data and confirm that my application was behaving appropriately. The only reason I was able to circumvent this is because I did all my testing *after* I wrote the code (during development I tested via Postman requests and logging to the console). That being said, I now know how to write better tests, so that was ultimately a personal victory.

- I created a Dockerfile, in order to create a container and deploy the application to AWS. Unfortunately I ran into account issues and was unable to utilize Elastic Beanstalk. I pivoted to try and use Heroku, but I was unable to get my application to deploy successfully. This is something I need to revisit and figure out.
