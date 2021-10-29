const models = require('../models');
const Promise = require('bluebird');

// work for last two tests goes here
module.exports.createSession = (req, res, next) => {
  Promise.resolve(req.cookies.shortlyid)
    .then((hash) => {
      if (Object.keys(hash).length === 0) {
        throw hash;
      }
      // console.log('REQUEST BODY ', req);
      return models.Sessions.get({hash});
    })
    .then((session) => {
      if (Object.keys(session).length === 0) {
        throw session;
      } else {
        // console.log('SESSION ', session);

        // req.session = session;
        // res.cookie('shortlyid', req.session.hash);
        // var id = session.userId;
        // if (id) {
        //   req.session.userId = id;
        //   models.Users.get({id})
        //     .then((userData) => {
        //       // console.log('USER DATA ', userData);
        //       req.session.user = {username: userData.username};
        //     });
        //   next();
        // } else {
        //   next();
        // }

        return session;
      }
    })
    .catch(() => {
      return models.Sessions.create()
        .then((data) => {
          var id = data.insertId;
          return models.Sessions.get({id});
        })
        .then((session) => {
          res.cookie('shortlyid', session.hash);
          return session;
        });
    }).then((session) => {
      req.session = session;
      next();
    });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = function(req, res, next) {

  if (models.Sessions.isLoggedIn(req.session)) {
    next();
  } else {
    res.redirect('/login');
  }
};