import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
admin.initializeApp();

const sendMail = (data: any) => {
  const gmailEmail = functions.config().gmail.login;
  const gmailPassword = functions.config().gmail.pass;

  const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPassword
    }
  });

  const mailOptions = {
    from: 'beloved cinelot user',
    to: gmailEmail,
    subject: `the bug collector: ${data.title}`,
    html: `<b>bug id:</b><br>${data.bugKey}<br><b>description of bug:</b><br>${data.desc}<br><b>steps to reproduce bug:</b><br>${data.stepsToFind}`
  };

  mailTransport
    .sendMail(mailOptions)
    .then(() => {
      console.log('successfully sent email');
    })
    .catch((error) => {
      console.log('error sending email: ' + error);
    });
};

exports.sendBugReport = functions.database
  .ref('users/{uid}/bugReports/{id}')
  .onCreate((snap) => {
    const data = snap.val();
    console.log(data);
    sendMail(data);
  });
