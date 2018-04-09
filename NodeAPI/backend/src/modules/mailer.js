const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
// grab values from confi/mailer.json
const {host, port, user, pass} = require('../config/mailer.json');

// tranport info from email provider
const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass },
});
// send email use template nodemailer-express-handlebars
// compile template hbs
transport.use('compile', hbs({
  viewEngine: 'handlebars', //use handlebars as lenguage
  viewPath: path.resolve('./backend/src/resources/mail'), // path where the views for the email are
  extName: '.html', // extencion to be use on the templates email
}));

module.exports = transport;
