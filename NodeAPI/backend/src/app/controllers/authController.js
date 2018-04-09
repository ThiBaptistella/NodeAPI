const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

// get the parametersfrom UserSchema
const User = require('../models/user');
const authConfig = require('../../config/auth');

const router = express.Router();

function generateToken( params = {}) {
  return jwt.sign( params, authConfig.secret, {
    expiresIn: 86400,
  });
}

// router get info register
router.post('/register', async (req, res) => {
  // create a const to get email from input
  const { email } = req.body;
  try {
    if( await User.findOne({ email })) {
      return  res.status(400).send({ error: 'Email already exists'});
    }
    // recive post(request.body) from register page Await = wait for the process is all in
    const user = await User.create(req.body);
    // remove password incrypt after created
    user.password = undefined;
    return res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (err) {
    console.log(err);
    return  res.status(400).send({ error: 'Resgistration failed.'});
  }
});

// router get info authenticate
router.post('/authenticate', async (req, res) => {
  // create a const to get email and password from input
  const { email, password } = req.body;
  // seach for user and password
  const user = await User.findOne({ email }).select('+password');
  // if the user is not found throw error
  if ( !user ) {
    return  res.status(400).send({ error: 'User not found.'});
  }
  // check if the password typed is the same password of the database
  if ( !await bcrypt.compare(password, user.password)) {
    return  res.status(400).send({ error: 'Invalid password.'});
  }
  // remove password incrypt after created
  user.password = undefined;

  res.send({
    user,
    token: generateToken({ id: user.id }),
  });
});

// router to get forgot password
router.post('/forgot_password', async (req, res) => {
  // get email from  the front end form
  const { email } = req.body;
  try {
    // find if exist a user / email already
    const user = await User.findOne({ email });
    // if do not exit return Error
    if (!user) {
      return  res.status(400).send({ error: ' User not found.'});
      }
    // generate a radonm token with 20 caracters and convert to string save it on user.json
    const token = crypto.randomBytes(20).toString('hex');
    // data of experied also save it on user.json
    const now = new Date();
    now.setHours(now.getHours() + 1);
    // after all the checks update the password(user.json), token and date
    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now,
      }
    });
    // send email with the link forgot_password and token
    mailer.sendMail({
      to: email,
      from: 'thiago_baptistella1@hotmail.com',
      template: 'auth/forgot_password',
      context: { token },
    }, (err) => {
      if (err) {
        console.log(err);
        return  res.status(400).send({ error: 'Cannot send forgot password email.'});
      };
      // iff all good send email
      return res.send();
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: 'Error on forget password, try again.'});
  }
});

// router for reset password
router.post('/reset_password', async (req, res) => {
  // get email from  the front end form
  const { email, token, password } = req.body;
  try {
    // seach for user and password see if exists
    const user = await User.findOne({ email}).select('+passwordResetToken passwordResetExpires');
    if (!user) {
      return  res.status(400).send({ error: 'User do not exist'});
    }
    // check if token is different
    if (token !== user.passwordResetToken) {
      return  res.status(400).send({ error: 'Token invalid'});
    }
    // verify if token is experied
    const now = new Date();
    if (now > user.passwordResetExpires) {
      return  res.status(400).send({ error: 'Token experied, please generate a new one'});
    }
    // if everything is good, update the user password
    user.password = password;
    // save the new password
    await user.save();
    // send confirmation is all good
    res.send();
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: 'Error on reset password, try again.'});
  }
});

// import app.use from index
// pass this register router to app with this prefix auth
module.exports = app => app.use('/auth', router);
