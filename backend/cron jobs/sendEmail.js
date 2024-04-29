const nodemailer = require('nodemailer');
const Mailgen = require("mailgen");

const config = {
    service:process.env.MAIL_SERVICE,
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS
    }
}

const sendEmail = async (name, toEmail, emailSubject, emailBody) => {
    const transporter = nodemailer.createTransport(config);
    const mailGenerator = new Mailgen({
        theme:'default',
        product:{
            name:"Savings Spheare",
            link:"www.savingsSpheare.in",
            copyright: 
            'Copyright © 2023 savings spheare. All rights reserved.' +
            "\n\n\nDisclaimer: This email and any attachments are confidential and intended solely for the recipient. Any unauthorized use, disclosure, or distribution is prohibited. Views or opinions expressed are solely those of the sender and do not necessarily represent the company. cars360 disclaims any liability for errors or omissions."
        },
    });

    const response = {
        body:{
            name,
            intro:emailBody
        }
    }

    const mail = mailGenerator.generate(response);
    const message = {
        from: process.env.MAIL_USER,
        to:toEmail,
        subject:emailSubject,
        html:mail
    }

    try {
        await transporter.sendMail(message);
        return 1;
    } catch (error) {
        console.error('Error sending email:', error);
        return 0;
    }
};

module.exports = sendEmail;