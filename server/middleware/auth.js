const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  Promise.resolve(req.cookies.shortlyid)
    .then((hash) => {
      if (Object.keys(hash).length === 0) {
        throw hash;
      }
      return models.Sessions.get({hash});
    })
    .then((session) => {
      if (Object.keys(session).length === 0) {
        throw session;
      } else {
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

