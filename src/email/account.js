const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = (email, name) => {
  sgMail.send(
    {
      to: email, // Change to your recipient
      from: 'amalbalraj99@gmail.com', // Change to your verified sender
      subject: "welcome to Task Manager",
      text: `Welcome ${name}, Thanks you for varifying in our app`,
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
  ).then(()=>{
    console.log("email sent")
  }).catch((error)=>{
    console.log(error)
  })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send(
    {
      to: email, // Change to your recipient
      from: 'amalbalraj99@gmail.com', // Change to your verified sender
      subject: "Goodbye from task manager",
      text: `Goodbye ${name}, we will miss you`,
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
  ).then(()=>{
    console.log("email sent")
  }).catch((error)=>{
    console.log(error)
  })
}

module.exports = {
  sendEmail,
  sendCancellationEmail
}

