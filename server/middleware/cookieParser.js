const parseCookies = (req, res, next) => {
  var object = {};
  var cookies = req.headers.cookie;

  if (cookies) {
    cookies = cookies.split('; ');
    cookies.forEach(cookie => {
      var [key, value] = cookie.split('=');
      object[key] = value;
    });

    req.cookies = object;
  }

  next();
};


module.exports = parseCookies;