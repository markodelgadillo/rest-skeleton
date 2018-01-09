const express = require('express')
const router = express.Router()
const mongoose = require('mongoose') // mongo connection
const bodyParser = require('body-parser') // used to examine POST calls
const methodOverride = require('method-override') // used to manipulate POST

router.use(bodyParser.urlencoded({ extended: true }))
router.use(
  methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method
      delete req.body._method
      return method
    }
  })
)

router.route('/')
  // GET all blobs
  .get(function(req, res, next) {
    // retrieves all blobs from mongodb
    mongoose.model('Blob'),
      find({}, function(err, blobs) {
        if (err) {
          return console.error(err)
        } else {
          /* respond to both HTML and JSON. JSON responses require
           'Accept: application/json;' in the Request Header */
          res.format({
            /* HTML response will render index.jade file in the views/blobs
            folder. We are also setting "blobs" to be an accessible variable
            in our jade view */
            html: function() {
              res.render('blobs/index', {
                title: 'All my Blobs',
                blobs: blobs
              })
            },
            // JSON response will show all blobs in JSON format
            json: function() {
              res.json(infophotos)
            }
          })
        }
      })
  })
  // POST a new blob
  .post(function(req, res){
    /* Get values from POST request. These can be done through forms or
    REST calls. These rely on the "name" attribute for forms.*/
    const name = req.body.name
    const badge = req.body.badge
    const dob = req.body.dob
    const company = req.body.company
    const isLoved = req.body.isLoved
    // call the create function for our database
    mongoose.model('Blob').create({
      name : name,
      badge : badge,
      dob : dob,
      isLoved : isLoved
    }, function(err, blob){
      if (err) {
        res.send("There was a problem adding the information to the database.")
      } else {
        // Blob has been created
        console.log('POST creating new blob: ' + blob)
        res.format({
          /* HTML respose will se the location and redirect back to the home
          page. You could also create a 'success' page. */
          html: function(){
            /* If it worked, set the header so the address bar doesn't still say
            /adduser */
            res.location("blobs")
            // And forward to success page
            res.redirect("/blobs")
          }
          json: function(){
            res.json(blob)
          }
        })
      }
    })
  })
