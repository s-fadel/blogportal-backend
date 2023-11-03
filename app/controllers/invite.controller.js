const db = require("../models");
const Invite = db.invite;
const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.inviteUser = async (req, res) => {
  const { email } = req.body;

  try {
    const invitationToken = crypto.randomBytes(20).toString("hex");
    Invite.create({
      token: invitationToken,
      email: email,
    });

    const invitationLink = `https://localhost:8080/set-password/${invitationToken}`;

    // Skicka e-post till användaren med inbjudningslänken
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Inbjudan att skapa lösenord",
      html: `
        <p>Du har blivit inbjuden att skapa ditt lösenord på vår webbplats.</p>
        <p>Klicka på denna länk för att skapa ditt lösenord: ${invitationLink}</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Något gick fel vid sändningen av inbjudan via e-post.",
        });
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .send({ message: "Inbjudan skickad framgångsrikt via e-post!" });
      }
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
