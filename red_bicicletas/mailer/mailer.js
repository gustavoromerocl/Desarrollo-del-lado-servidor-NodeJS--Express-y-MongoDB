/*
https://nodemailer.com/about/
https://www.npmjs.com/package/nodemailer-sendgrid-transport
https://ethereal.email/
*/
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

let mailConfig;
// ENVIRONMENT HEROKU
if (process.env.NODE_ENV === "production") {
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_SECRET,
        },
    };
    mailConfig = sgTransport(options);
}

if (process.env.NODE_ENV === "development") {
    mailConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.ethereal_user,
            pass: process.env.ethereal_pwd
        }
    };
}

module.exports = nodemailer.createTransport(mailConfig);