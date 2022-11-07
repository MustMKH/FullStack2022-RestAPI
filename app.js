const express = require('express');
const app = express();
const routes = require('./routes');

/* - - - D E S C R I P T I O N - - -
Building a REST API with Express to enable the user to create, read, update and delete (CRUD) quotes from the API */

/* - - - M I D D L E W A R E - - -

/* - - - EXPRESS.JSON - - - 
This express middleware is needed to access values in req.body. 
When a request comes in, it will be sent through this function before it hits one of the route handlers
This middleware tells express that we are expecting requests to come in as json
That way, express can take the json sent via the request body and make it available on the request object*/
app.use(express.json());

/* - - - ? - - - 
This means that when the request starts with the path /api, use the routes inside of the routes.js file
Make sure to import the routes.js file in a require statement at the top of this file*/
app.use('/api', routes);

/* - - - C O M M O N   S T A T U S   C O D E S - - -
200 - OK
201 - Created
204 - No Content
400 - Bad Request
404 - Not Found
500 - Internal Server Error */

/* - - - G L O B A L   E R R O R   H A N D L I N G - - - */
app.use((req, res, next) => {
    const err = new Error("Not Found")
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json( {
        error: {
            message: err.message
        }
    } )
})

/* - - - D A T A B A S E   A N D   O R M - - - 
Depending on which kind of database you would use, you would likely use some kind of library 
known as an ORM (Object Relational Mapping)
ORM facilitates the communication between your express app and your database (Mongoose, Sequelize).
The data.json file serves as a mock database for this project.
The records.js module serves as a very basic ORM
- Cross Origin Resource Sharing (CORS)
- User Authentication: the process of verifying who you are. When you log on to a PC with a user 
  name and password you are authenticating
- User Authorization: the process of verifying that you have access to something
*/

app.listen(3000, () => console.log('Quote API listening on port 3000!'));
