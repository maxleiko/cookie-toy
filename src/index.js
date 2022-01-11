// @ts-check
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const CWD = process.cwd();

function filepath(name) {
  return path.resolve(CWD, name);
}

/**
 * Redirects to /login if not logged in
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function privateMiddleware(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

async function main() {
  const [port = '8787'] = process.argv.slice(2);

  // use cookies
  app.use(
    session({
      name: 'greycat',
      secret: 'somes3cret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
      },
    })
  );

  // private entry point to index.html
  app.get('/', privateMiddleware, (req, res) => {
    res.sendFile(filepath('public/index.html'));
  });

  // public login page
  app.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
    } else {
      res.sendFile(filepath('public/login.html'));
    }
  });

  // auth POST handler
  app.post(
    '/auth',
    // parse url-encoded body
    bodyParser.urlencoded({ extended: false }),
    (req, res) => {
      // dummy check of credentials
      if (req.body.login === 'admin' && req.body.password === 'admin') {
        req.session.loggedIn = true;
        req.session.login = req.body.login;
        console.log('Session', req.session);
        res.redirect('/');
      } else {
        res.sendStatus(401);
      }
    }
  );

  // start listening for incoming connections
  app.listen(port, () => {
    console.log(`Server listening at :${port}`);
  });
}

main().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
