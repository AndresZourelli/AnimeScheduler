const nodemailer = require("nodemailer");

exports.sendResetEmail = async (token, email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "joy.collier@ethereal.email",
        pass: "prszMBfMCXABFeFzVq",
      },
    });

    await transporter.sendMail(
      {
        from: '"Anime Website" <anime@website.com>',
        to: email,
        subject: "Reset Token",
        text: `Here is your reset token http://localhost:3000/reset_password?token=${token}`,
      },
      (error, info) => {
        if (error) {
          throw new Error(error);
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};
