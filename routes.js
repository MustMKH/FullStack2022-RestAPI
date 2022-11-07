const express = require('express');
const router = express.Router();
const records = require('./records')

/* - - - M I D D L E W A R E - - -

- - - ASYNC HANDLER - - -*/
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
          await cb(req, res, next);
      } catch(err) {
          next(err);
      }
    };
  }

/* - - - T E S T - - -
router.get('/greetings', (req, res) => {
    // traditional server-side express application:
    // res.render('some_html_template')
    // instead, we want to send back JSON:
    res.json({greeting: "Hello World!"})
}); */

// - - - R O U T E   H A N D L E R S - - -

/* - - - GET LIST OF QUOTES - - -
Send a GET request to /quotes to READ a list of quotes
The following is a synchronous function, which doesn't wait for the response and returns an empty json object:
    router.get('/quotes', (req, res) => {
        const quotes = records.getQuotes();
        res.json(quotes);
    }); 
Use an async function instead: */
router.get('/quotes', async (req, res) => {
    try {
        const quotes = await records.getQuotes();
        res.json(quotes);
    } catch (err) {
        res.json( {message: err.message} )
    }
})

/* - - - GET A SPECIFIC QUOTE - - -
Send a GET request to /quotes/:id READ(view) a quote */
router.get('/quotes/:id', async (req, res) => {
    try {
        // console.log(req.params.id)
        // req.params.id is used to access the id number from the client request,
        // double equal is used here because params is a string and quote.id is a number:
        const quote = await records.getQuote(req.params.id);
        if (quote) {
            res.json(quote);            
        } else {
            res.status(404).json( {message: "Quote not found."} )
        }
    } catch (error) {
        res.status(500).json( {message: err.message} )
    }
});

/* - - - GET RANDOM QUOTE - - -
Send a GET request to /quotes/quotes/random to READ (view) a random quote */
router.get('/quotes/quote/random', asyncHandler(async (req,res,next) => {
    const quote = await records.getRandomQuote();
    res.json(quote);
}))

/* - - - CREATE A NEW QUOTE - - -
Send a POST request to /quotes to CREATE a new quote 
In Postman, select body, raw and JSON to post the new JSON object*/
/* router.post('/quotes', async (req, res) => {
    try {
    // Testing with a fake error:
    // throw new Error("Oh NOOOOOO something went horribly wrong!")
        if (req.body.author && req.body.quote) {
            const quote = await records.createQuote({
                quote: req.body.quote,
                author: req.body.author
            });
            res.status(201).json(quote)            
        } else {
            res.status(400).json( {message: "Missing quote or author."} )
        }
    res.json(quote);
    } catch(err) {
        res.status(500).json( {message: err.message} )
    }
})
Check the Dorothy quote added in data.json */

router.post('/quotes', asyncHandler(async (req, res) => {
    if (req.body.author && req.body.quote) {
        const quote = await records.createQuote({
            quote: req.body.quote,
            author: req.body.author
        });
        res.status(201).json(quote)            
    } else {
        res.status(400).json( {message: "Missing quote or author."} )
    }
}))

/* - - - EDIT A QUOTE - - - 
Send a PUT request to /quotes/:id to UPDATE (edit) a quote */
router.put('/quotes/:id', asyncHandler(async(req,res) => {

    const quote = await records.getQuote(req.params.id)
    if (quote) {
        quote.quote = req.body.quote;
        quote.author = req.body.author;
        await records.updateQuote(quote);
        /* For a put request, it is convention to send in the status code 204, which means no content
        This means that everything went OK but there is nothing to send back
        For put requests, it is convention not to respond with anything
        We need another way to end the request or the server will just hang indefinitely
        and our application will appear to be broken. For this reason, we need to use the express 
        end() method: */
        res.status(204).end();
    } else {
        res.status(404).json( {message: "Quote Not Found"} )
    }
    records.updateQuote()
}))

/* - - - DELETE A QUOTE - - - 
Send a DELETE request to /quotes/:id to DELETE a quote */
router.delete("/quotes/:id", async(req, res, next) =>{
    try {
        /* Testing with a fake error: 
        throw new Error("Something went horribly wrong again!")*/
        const quote = await records.getQuote(req.params.id)
        if (quote) {
            await records.deleteQuote(quote)
            // again, because we're only sending back a status, not a response, we need to use the end() method:
            res.status(204).end()            
        } else {
            res.status(404).json( {message: "Quote Not Found"} )
        }
    } catch(err) {
        /* Instead of manually changing the status code and sending an error message like below,
        we can pass the error to our global error handler with the express function next()
        res.status(500).json( {message: err.message} ) */
        next(err)
    }
})

// - - - E X P O R T I N G   T H E   R O U T E R - - -
module.exports = router;