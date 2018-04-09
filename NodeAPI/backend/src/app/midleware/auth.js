const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

// midleware, thake req and res from authenticate and do something (verified evething and then next();)
// send erro msg if the token is different
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: 'No token provided'});
  }
  // ex. token bearer hassh (bearer 7637672647326476234762742648726423hgchdcd)
  const parts = authHeader.split(' ');
  // if is not 2 parts bearer and hash return error
  if (!parts.length === 2 ) {
    return res.status(401).send({ error: 'token error'});
  }
  // sign the schema and token to parts
  const [ schema, token ] = parts;

  // check if contant (start) with bearer on the schema
  // ! = negative (regex syntax)
  // / = start the regex and end
  // ^ = inicial
  // $ = end
  // i = case sensitive
  if (!/^Bearer$/i.test(schema)) {
    return res.status(401).send({ error: 'token malformatted'});
  }
  // jwt verify the token on const array parts is the same as the user
  // authConfig secret is the hash
  // callback err
  // decoded is the user id (if it is rigth)
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ error: 'token invalid'});
    }
    // if ther is a token on the params and match go to next
    req.userId = decoded.id;
    next();
  });
};
