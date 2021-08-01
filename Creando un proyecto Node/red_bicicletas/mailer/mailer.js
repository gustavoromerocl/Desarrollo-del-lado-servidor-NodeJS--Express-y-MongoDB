/*
https://nodemailer.com/about/
https://www.npmjs.com/package/nodemailer-sendgrid-transport
https://ethereal.email/
*/
const nodemailer = require('nodemailer')

var mailConfig;
if (process.env.NODE_ENV === 'production' ){
    // all emails are delivered to destination
    mailConfig = {
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: 'raven.johns89@ethereal.email',
            pass: '8mRAJFKZAW98YXvKvS'
        }
    };
} else {
    // all emails are catched by ethereal.email
    mailConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'raven.johns89@ethereal.email',
            pass: '8mRAJFKZAW98YXvKvS'
        }
    };
}

module.exports = nodemailer.createTransport(mailConfig);