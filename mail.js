var mailer = require('nodemailer')
const config = require('./config')


function send(to, title, content) {
    if(process.argv.indexOf('--enable-mail')<0)
        return;

    if (!config.mail || !config.mail.host) {
        throw 'miss mail config';
    }

    var to = to || config.mail.to;

    if (!to) {
        throw 'send() need parameters: to'
    }

    let transport = mailer.createTransport({
        host: config.mail.host,
        port: config.mail.port,
        secure: config.mail.secure != undefined ? config.mail.secure : true,
        auth: {
            user: config.mail.user,
            pass: config.mail.pwd
        }
    })

    transport.sendMail({
        from: config.mail.from,
        to: to,
        subject: title,
        html: content
    })
    transport.close()
}

exports.send = send;