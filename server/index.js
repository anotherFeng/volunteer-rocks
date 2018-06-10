const express = require('express');
const session = require('express-session');
const saveToDb = require('../database/saveToDb.js');
const retrieveFromDb = require('../database/retrieveFromDb.js');
const VolunteerModel = require('../database/models.js').Volunteers;
const checkdb = require('../database/checkdbs.js');
const axios = require('axios');
const saveExampleOpportunity = require('../database/exampleOpGenarator.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const cookieParser = require('cookie-parser');
const addVolunteerToOpp = require('../database/addVolunteerToOpp').checkIfEnrolled;

const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/../client/dist'));
app.use(session({secret: 'Is it really a secret', cookie:{maxAge: 365*24*60*60}}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// saveExampleOpportunity.saveExampleOpportunity();

passport.use(new GoogleStrategy({
  clientID: '177608482290-e9id899c90egnaq61bu5acppkrnenm12.apps.googleusercontent.com',
  clientSecret: 'RfKLyzUdC7PMcr-_G_hxkVg0',
  callbackURL: 'http://localhost:3000/auth/google/callback',
},
  function(accessToken, refreshToken, profile, done) {
    let name = profile.displayName;
    let profileId = profile.id;

    VolunteerModel.findOne({ googleId: profileId }, function(err, volunteer) {
      if (err) {
        throw err;
      }

      if (!volunteer) {
        saveToDb.newVolunteer({
          googleId: profile.id,
          name: name,
          picture: profile.photos[0].value
        });

        return done(err, profile);
      }

      return done(err, volunteer);
    });
  }
));

passport.serializeUser(function(volunteer, done) {
  done(null, volunteer);
});

passport.deserializeUser(function(serializedObj, done) {
  VolunteerModel.findOne({ googleId: serializedObj.googleId }, function(err, volunteer) {
    done(err, volunteer);
  });
});


//MAIN PAGE GET REQUEST
// app.get('/main', (req, res) => {
//   checkdb.checkSessionId(req.session.id, res);
// });


app.get('/auth/google', passport.authenticate('google', { scope : ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  passport.authenticate('local')(req, res, function() {
    res.redirect('/')
  })
);

// // GET /auth/google
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  The first step in Google authentication will involve redirecting
// //   the user to google.com.  After authorization, Google will redirect the user
// //   back to this application at /auth/google/callback
// app.get('/auth/google',
//   passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' });

// // GET /auth/google/callback
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  If authentication fails, the user will be redirected back to the
// //   login page.  Otherwise, the primary route function function will be called,
// //   which, in this example, will redirect the user to the home page.
// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });


app.get('/main', (req, res) => {
  console.log('This is user', req.user);
  console.log('This is session', req.session)
  console.log("session exist check:- ",req.session.passport.user);
  req.session.passport.user ? res.status(200).send(req.session.passport.user).end('true') : res.status(401).end('false');
});

app.post('/login', (req, res) => {
  checkdb.checkUserCredential(req.body, res, session, req);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

//ORGANIZATION SIGNUP POST REQUEST
app.post('/signup', (req, res) => {
  checkdb.checkOrganizationExists(req, res);
});

//OPPORTUNITIES GET REQUEST


app.post('/newOpp', (req, res) => {
  saveToDb.newOpportunity(req.body);
  res.sendStatus(200);
});

app.post('/opportunities', (req, res) => {
  let zipApiUrl = `https://www.zipcodeapi.com/rest/jXEHhizBNOo3C2RRQSk7Yz7rnOBXayXcDpD0KuAhI1yofRUd7POm4rcDN0tUtTS8/radius.json/${req.body.zipcode}/1/mile`;

  // axios.get(zipApiUrl)
  //   .then(response => {
  //     //console.log('From zipapi ' + response.data.zip_codes[0].zip_code);
  //     retrieveFromDb.getZipCodeSearch(response.data.zip_codes, 5, res);
  //   }).catch(err => console.log('Err', err));

  retrieveFromDb.getOpportunities(5, res);
});

app.get('/opportunities/all', (req, res) => {
  retrieveFromDb.getOpportunities(1000, res);
});

app.post('/enroll', (req, res) => {
  let oppId = req.body.oppId;

  if (req.user) {
    addVolunteerToOpp(oppId, req.user._id, res);
  } else {
    res.send('login')
  }

});

module.exports = app;